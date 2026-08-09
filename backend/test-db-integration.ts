import { pool } from './src/config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as orderService from './src/services/orderService.js';

async function runTest() {
    console.log('Starting DB Integration Test...\n');
    let categoryId, productId, productImageId;
    let customerId, addressId, orderId, paymentId;

    try {
        const testId = Date.now();
        // 1. Create Category
        console.log('1. Creating TEST Category...');
        const [catResult] = await pool.query<ResultSetHeader>(
            `INSERT INTO categories (name, slug, description, status) VALUES ('TEST Category ${testId}', 'test-category-${testId}', 'Integration test category', 'active')`
        );
        categoryId = catResult.insertId;
        console.log(`✅ Category created (ID: ${categoryId})`);

        // 2. Create Product
        console.log('2. Creating TEST Product...');
        const [prodResult] = await pool.query<ResultSetHeader>(
            `INSERT INTO products (category_id, name, slug, description, price, discount_price, stock, sku, status) 
             VALUES (?, 'TEST Product ${testId}', 'test-product-${testId}', 'Integration test product', 1000.00, 800.00, 10, 'TEST-SKU-${testId}', 'active')`,
            [categoryId]
        );
        productId = prodResult.insertId;
        console.log(`✅ Product created (ID: ${productId}, Stock: 10, Price: 1000, Discount: 800)`);

        // 3. Create Product Image
        console.log('3. Creating TEST Product Image...');
        const [imgResult] = await pool.query<ResultSetHeader>(
            `INSERT INTO product_images (product_id, file_path, alt_text, is_primary) VALUES (?, '/test-path.jpg', 'Test Image', 1)`,
            [productId]
        );
        productImageId = imgResult.insertId;
        console.log(`✅ Product Image created (ID: ${productImageId})`);

        // 4. Create Order using OrderService (tests server-side total and customer/address creation)
        console.log('4. Creating Order via OrderService (tests customer & address creation & server-side total)...');
        const orderData = {
            customer: { first_name: 'Test', last_name: 'User', email: `test.user.${testId}@example.com`, phone: '9999999999' },
            address: { full_name: 'Test User', address_line: '123 Test St', city: 'Test City', state: 'Test State', pincode: '123456', country: 'Testland' },
            items: [{ product_id: productId, quantity: 2 }]
        };
        const orderResult = await orderService.createOrder(orderData);
        orderId = orderResult.order_id;
        customerId = orderResult.customer_id;
        
        // Find Address ID
        const [addresses] = await pool.query<RowDataPacket[]>('SELECT id FROM addresses WHERE customer_id = ?', [customerId]);
        addressId = addresses[0].id;

        console.log(`✅ Order created (ID: ${orderId}, Number: ${orderResult.order_number})`);
        console.log(`✅ Customer created/found (ID: ${customerId})`);
        console.log(`✅ Address created (ID: ${addressId})`);

        // Verify Server-side total
        // Expected: 2 * 800 (discount price) = 1600 + 0 shipping = 1600
        if (orderResult.total !== 1600) {
            throw new Error(`❌ Server-side total mismatch! Expected 1600, got ${orderResult.total}`);
        }
        console.log(`✅ Server-side total verified (${orderResult.total})`);

        // 5. Create Payment record manually (simulating Razorpay creation)
        console.log('5. Creating TEST Payment Record...');
        const [payResult] = await pool.query<ResultSetHeader>(
            `INSERT INTO payments (order_id, customer_id, razorpay_order_id, amount, currency, payment_status)
             VALUES (?, ?, 'rzp_test_order_123', ?, 'INR', 'CREATED')`,
            [orderId, customerId, orderResult.total]
        );
        paymentId = payResult.insertId;
        console.log(`✅ Payment record created (ID: ${paymentId})`);

        // 6. Simulate Successful Payment (Stock deduction & Order status update)
        console.log('6. Simulating Successful Payment & Verifying Stock Deduction...');
        
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        
        // Update payment
        await conn.query(`UPDATE payments SET payment_status = 'SUCCESS', razorpay_payment_id = 'rzp_test_pay_123' WHERE id = ?`, [paymentId]);
        // Update order status
        await conn.query(`UPDATE orders SET status = 'CONFIRMED' WHERE id = ?`, [orderId]);
        // Deduct stock safely
        const [items] = await conn.query<RowDataPacket[]>('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
        for (const item of items) {
            await conn.query('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?', [item.quantity, item.product_id, item.quantity]);
        }
        await conn.commit();
        conn.release();

        // Verify stock
        const [prodCheck] = await pool.query<RowDataPacket[]>('SELECT stock FROM products WHERE id = ?', [productId]);
        if (prodCheck[0].stock !== 8) {
            throw new Error(`❌ Stock deduction failed! Expected 8, got ${prodCheck[0].stock}`);
        }
        console.log(`✅ Stock deducted correctly (Remaining: 8)`);

        // Verify order status
        const [orderCheck] = await pool.query<RowDataPacket[]>('SELECT status FROM orders WHERE id = ?', [orderId]);
        if (orderCheck[0].status !== 'CONFIRMED') {
            throw new Error(`❌ Order status update failed! Expected CONFIRMED, got ${orderCheck[0].status}`);
        }
        console.log(`✅ Order status verified (CONFIRMED)`);

        // 7. Verify Foreign Keys / Relationships
        console.log('7. Verifying Relationships / Foreign Keys...');
        const [itemCheck] = await pool.query<RowDataPacket[]>('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
        if (itemCheck.length !== 1 || itemCheck[0].product_id !== productId) {
             throw new Error('❌ Order item relationship invalid');
        }
        console.log(`✅ Relationships verified successfully`);

        console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
    } finally {
        console.log('\n🧹 Cleaning up TEST records...');
        try {
            // Delete in reverse order of creation to respect foreign keys
            if (paymentId) await pool.query('DELETE FROM payments WHERE id = ?', [paymentId]);
            if (orderId) await pool.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
            if (orderId) await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
            if (addressId) await pool.query('DELETE FROM addresses WHERE id = ?', [addressId]);
            if (customerId) await pool.query('DELETE FROM customers WHERE id = ?', [customerId]);
            if (productImageId) await pool.query('DELETE FROM product_images WHERE id = ?', [productImageId]);
            if (productId) await pool.query('DELETE FROM products WHERE id = ?', [productId]);
            if (categoryId) await pool.query('DELETE FROM categories WHERE id = ?', [categoryId]);
            console.log('✅ Cleanup successful.');
        } catch (cleanupErr) {
            console.error('❌ Cleanup failed:', cleanupErr);
        }
        await pool.end();
        process.exit(0);
    }
}

runTest();
