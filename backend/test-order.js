// Quick test script to verify order creation
// Run with: node test-order.js

const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

const testOrder = async() => {
    try {
        const form = new FormData();

        // Sample order data
        const items = [{
            product_id: "550e8400-e29b-41d4-a716-446655440000", // Replace with actual product ID from your DB
            quantity: 1,
            price: 50
        }];

        form.append('customer_name', 'Test Customer');
        form.append('items', JSON.stringify(items));
        form.append('total_amount', '50');
        form.append('payment_method', 'Cash on Delivery');
        form.append('order_type', 'Pickup');
        form.append('delivery_fee', '0');

        const response = await axios.post('http://localhost:5000/api/v1/orders', form, {
            headers: form.getHeaders()
        });

        console.log('✅ Order created successfully!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('❌ Error creating order:');
        console.error('Status:', error.response ? .status);
        console.error('Message:', error.response ? .data ? .message || error.message);
        console.error('Full error:', error.response ? .data);
    }
};

testOrder();