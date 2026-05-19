// Quick test script to verify order creation
// Run with: node test-order.js

// This script will:
// 1. Ensure `axios` is available
// 2. Fetch an available product from the API (/api/v1/products)
// 3. Create a small order for that product to avoid validation errors

let axios;
try {
    axios = require('axios');
} catch (e) {
    console.error('Missing dependency: axios is not installed in backend.');
    console.error('Run: npm --prefix backend install axios');
    process.exit(1);
}

const API_URL = (process.env.API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const PRODUCTS_ENDPOINT = `${API_URL}/api/v1/products`;
const ORDERS_ENDPOINT = `${API_URL}/api/v1/orders`;

async function findAvailableProduct() {
    try {
        const res = await axios.get(PRODUCTS_ENDPOINT, { timeout: 5000 });
        const products = Array.isArray(res?.data)
            ? res.data
            : res?.data?.products || [];
        if (!products || products.length === 0) return null;
        const available = products.find(p => (Number(p.stock) || 0) > 0);
        return available || products[0];
    } catch (err) {
        console.error('Could not fetch products list:', err?.message || err);
        return null;
    }
}

async function testOrder() {
    const product = await findAvailableProduct();
    if (!product) {
        console.error('No product available to create a test order. Ensure /api/v1/products returns data.');
        return;
    }

    const productId = product.id || product.product_id || product._id || product.uuid;
    if (!productId) {
        console.error('Product object did not contain an identifiable id:');
        console.error(product);
        return;
    }

    const price = Number(product.price ?? product.unit_price ?? 50);

    const items = [{ product_id: productId, quantity: 1, price }];
    const total = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);

    const payload = {
        customer_name: 'Test Customer',
        items,
        total_amount: total,
        payment_method: 'Cash on Delivery',
        order_type: 'Pickup',
        delivery_fee: 0,
    };

    try {
        const res = await axios.post(ORDERS_ENDPOINT, payload, { headers: { 'Content-Type': 'application/json' }, timeout: 5000 });
        console.log('✅ Order created successfully!');
        console.log('Response:', res.data);
    } catch (error) {
        const code = error?.code;
        console.error('❌ Error creating order:');
        if (code === 'ECONNREFUSED' || code === 'ECONNRESET') {
            console.error(`Cannot connect to API at ${ORDERS_ENDPOINT} (code: ${code}).`);
            console.error('Make sure your backend is running and the URL/port are correct.');
            console.error('You can set a custom API URL with the API_URL environment variable.');
        } else {
            console.error('Status:', error?.response?.status ?? error?.status ?? 'No status');
            console.error('Message:', error?.response?.data?.message ?? error?.message ?? 'No message');
            console.error('Full error (response.data or error object):', error?.response?.data ?? error);
        }
    }
}

(async () => {
    await testOrder();
})();