const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const sendErrors = (res, errors) => res.status(400).json({ errors });

const validateCreateOrder = (req, res, next) => {
    try {
        const errors = [];
        const body = req.body || {};

        // Parse items (may be JSON string from multipart/form-data)
        let items = body.items;
        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch (e) {
                errors.push({ field: 'items', message: 'Invalid JSON for items' });
            }
        }

        if (!Array.isArray(items) || items.length === 0) {
            errors.push({ field: 'items', message: 'Items must be a non-empty array' });
        } else {
            items.forEach((it, idx) => {
                if (!it.product_id) errors.push({ field: `items[${idx}].product_id`, message: 'product_id is required' });
                const qty = Number(it.quantity);
                if (!Number.isFinite(qty) || qty <= 0) errors.push({ field: `items[${idx}].quantity`, message: 'quantity must be > 0' });
                const price = Number(it.price);
                if (!Number.isFinite(price) || price < 0) errors.push({ field: `items[${idx}].price`, message: 'price must be >= 0' });
            });
        }

        const customer_name = (body.customer_name || '').toString().trim();
        if (!customer_name) errors.push({ field: 'customer_name', message: 'Customer name is required' });

        const payment_method = (body.payment_method || '').toString().trim();
        if (!payment_method) errors.push({ field: 'payment_method', message: 'Payment method is required' });

        const order_type = (body.order_type || 'Pickup').toString();
        if (!['Pickup', 'Dine-in', 'Delivery'].includes(order_type)) errors.push({ field: 'order_type', message: 'Invalid order_type' });

        const total_amount = Number(body.total_amount);
        if (!Number.isFinite(total_amount) || total_amount < 0) errors.push({ field: 'total_amount', message: 'Invalid total_amount' });

        const delivery_fee = Number(body.delivery_fee || 0);

        // Conditional requirements
        if (order_type === 'Delivery') {
            if (!(body.address || '').toString().trim()) errors.push({ field: 'address', message: 'Address is required for Delivery' });
            if (!(body.landmark || '').toString().trim()) errors.push({ field: 'landmark', message: 'Landmark is required for Delivery' });

            const contact_number = (body.contact_number || '').toString().trim();
            if (!contact_number) {
                errors.push({ field: 'contact_number', message: 'Contact number is required for Delivery' });
            } else if (!/^\d{11}$/.test(contact_number)) {
                errors.push({ field: 'contact_number', message: 'Contact number must be exactly 11 digits' });
            }
        }
        if (order_type === 'Dine-in') {
            if (!(body.table_number || '').toString().trim()) errors.push({ field: 'table_number', message: 'Table number is required for Dine-in' });
        }

        // Payment-specific checks
        const digitalMethods = ['GCash', 'Maya', 'Card'];
        if (digitalMethods.includes(payment_method)) {
            if (!((body.payment_reference || '').toString().trim())) errors.push({ field: 'payment_reference', message: 'Reference number is required for digital payments' });
            if (!req.file) errors.push({ field: 'payment_proof', message: 'Payment screenshot is required for digital payments' });
        }

        // File checks
        if (req.file) {
            if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) errors.push({ field: 'payment_proof', message: 'Unsupported file type' });
            if (req.file.size > MAX_FILE_SIZE) errors.push({ field: 'payment_proof', message: 'File too large (max 5MB)' });
        }

        // Validate totals match items
        if (Array.isArray(items) && items.length > 0 && Number.isFinite(total_amount)) {
            const calcTotal = items.reduce((s, it) => {
                const price = Number(it.price) || 0;
                const qty = Number(it.quantity) || 0;
                return s + price * qty;
            }, 0) + (isNaN(delivery_fee) ? 0 : delivery_fee);
            // tolerance for float rounding
            if (Math.abs(calcTotal - total_amount) > 0.05) {
                errors.push({ field: 'total_amount', message: `Total amount mismatch (expected ${calcTotal.toFixed(2)})` });
            }
        }

        if (errors.length) return sendErrors(res, errors);

        // Attach normalized payload
        req.validatedOrder = {
            customer_name,
            items,
            total_amount: Number(total_amount),
            payment_method,
            order_type,
            address: (body.address || null),
            landmark: (body.landmark || null),
            contact_number: (body.contact_number || null),
            payment_reference: (body.payment_reference || null),
            delivery_fee: Number(delivery_fee) || 0,
            notes: (body.notes || null),
            table_number: (body.table_number || null),
        };

        next();
    } catch (err) {
        next(err);
    }
};

const validatePaymentUpdate = (req, res, next) => {
    try {
        const errors = [];
        const body = req.body || {};
        const { payment_status, payment_reference } = body;

        if (!payment_status && !payment_reference && !req.file) {
            errors.push({ field: 'payment', message: 'Provide payment_status, payment_reference or upload a payment_proof' });
        }

        const allowedStatuses = ['Pending Verification', 'Paid', 'Rejected'];
        if (payment_status && !allowedStatuses.includes(payment_status)) errors.push({ field: 'payment_status', message: 'Invalid payment_status' });

        // If marking as Paid, ensure proof or reference
        if (payment_status === 'Paid') {
            if (!payment_reference && !req.file) errors.push({ field: 'payment', message: 'Reference or proof required when marking Paid' });
        }

        if (req.file) {
            if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) errors.push({ field: 'payment_proof', message: 'Unsupported file type' });
            if (req.file.size > MAX_FILE_SIZE) errors.push({ field: 'payment_proof', message: 'File too large (max 5MB)' });
        }

        if (errors.length) return sendErrors(res, errors);

        req.validatedPayment = {
            payment_status: payment_status || null,
            payment_reference: payment_reference || null
        };

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { validateCreateOrder, validatePaymentUpdate };