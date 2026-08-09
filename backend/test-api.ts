import axios from 'axios';
import mysql from 'mysql2/promise';

const API_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('--- STARTING API TESTS ---');
    const client = axios.create({ baseURL: API_URL, validateStatus: () => true });

    const check = (condition: boolean, msg: string, res?: any) => {
        if (!condition) {
            console.error('FAIL:', msg);
            if (res) console.error('Response Data:', JSON.stringify(res.data, null, 2));
            process.exit(1);
        }
    };

    // Login
    let res = await client.post('/auth/login', { email: 'admin@hooks.com', password: 'password123' });
    check(res.status === 200, `Expected 200, got ${res.status}`, res);
    const cookie = res.headers['set-cookie']?.[0];
    const authClient = axios.create({ baseURL: API_URL, headers: { Cookie: cookie }, validateStatus: () => true });

    // ====== CATEGORY TESTS ======
    console.log('Testing Categories...');
    const rand = Math.random().toString(36).substring(7);
    res = await authClient.post('/admin/categories', { name: 'Test Category ' + rand, description: 'Desc' });
    check(res.status === 201, `Expected 201 for category creation, got ${res.status}`, res);
    const catId = res.data.data?.category?.id || res.data.data?.id || res.data.category?.id || 1;
    
    res = await client.get('/categories');
    check(res.status === 200, `Expected 200, got ${res.status}`, res);
    const categories = res.data.data?.categories || res.data.data || res.data;
    check(categories.length > 0, 'Expected at least 1 category', res);
    
    // ====== PRODUCT TESTS ======
    console.log('Testing Products...');
    res = await authClient.post('/admin/products', {
        category_id: catId,
        name: 'Test Product ' + rand,
        description: 'Product Desc',
        price: 99.99,
        stock: 10,
        sku: 'TEST-SKU-' + rand
    });
    check(res.status === 201, `Expected 201 for product creation, got ${res.status}`, res);
    const prodId = res.data.data?.product?.id || res.data.data?.id || res.data.product?.id || 1;
    
    res = await authClient.post('/admin/products', {
        category_id: catId, name: 'Invalid Product', price: -5, stock: -1
    });
    check(res.status === 400, `Expected 400 for negative price, got ${res.status}`, res);

    res = await client.get('/products');
    check(res.status === 200, `Expected 200, got ${res.status}`, res);
    const products = res.data.data?.items || res.data.data?.products || res.data.data || res.data;
    check(products.length > 0, 'Expected products to be returned', res);

    // ====== CUSTOMER & ORDER TESTS ======
    console.log('Testing Orders & Customers...');
    // Create an order (this should create a customer implicitly based on the Phase 6 implementation)
    res = await client.post('/orders', {
        customer: {
            email: `customer_${rand}@test.com`,
            first_name: 'John',
            last_name: 'Doe',
            phone: '9876543210'
        },
        address: {
            full_name: 'John Doe',
            address_line: '123 Test St',
            city: 'Testville',
            state: 'TS',
            pincode: '123456',
            country: 'India',
            phone: '9876543210'
        },
        items: [
            { product_id: prodId, quantity: 2 }
        ]
    });
    check(res.status === 201, `Expected 201 for order creation, got ${res.status}`, res);
    console.log('Order create response:', res.data);
    const orderId = res.data.data?.orderId || res.data.data?.id || 1;
    
    // Fetch orders as admin
    res = await authClient.get('/admin/orders');
    check(res.status === 200, `Expected 200 for admin orders, got ${res.status}`, res);
    const orders = res.data.data?.items || res.data.data || [];
    check(orders.length > 0, 'Expected at least 1 order', res);

    // Fetch customers as admin
    res = await authClient.get('/admin/customers');
    check(res.status === 200, `Expected 200 for admin customers, got ${res.status}`, res);
    const customers = res.data.data?.items || res.data.data || [];
    check(customers.length > 0, 'Expected at least 1 customer', res);

    console.log('API Tests passed so far!');
}

runTests().catch(console.error);
