export const generateOtpEmailHtml = (name: string, otp: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            margin-top: 40px;
            margin-bottom: 40px;
        }
        .header {
            background-color: #1F2937;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            letter-spacing: 1px;
        }
        .header h1 span {
            color: #C89B3C;
        }
        .content {
            padding: 40px 30px;
            color: #333333;
        }
        .content h2 {
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            color: #1F2937;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #5A5A5A;
        }
        .otp-box {
            background-color: #F8F6F2;
            border: 2px dashed #C89B3C;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-box .code {
            font-size: 36px;
            font-weight: bold;
            color: #1F2937;
            letter-spacing: 10px;
            margin: 0;
        }
        .warning {
            font-size: 14px;
            color: #e53e3e;
            margin-bottom: 30px;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eeeeee;
        }
        .footer p {
            font-size: 12px;
            color: #999999;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Hooks <span>&</span> Knots</h1>
        </div>
        <div class="content">
            <h2>Verify Your Email</h2>
            <p>Hi ${name},</p>
            <p>Thank you for creating an account with Hooks & Knots! To complete your registration, please enter the following 6-digit verification code:</p>
            
            <div class="otp-box">
                <p class="code">${otp}</p>
            </div>
            
            <p class="warning">
                <strong>Important:</strong> This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
            </p>
            
            <p>If you didn't request this registration, you can safely ignore this email.</p>
            
            <p>Best Regards,<br><strong>Hooks & Knots Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Hooks & Knots. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const generateOrderConfirmationEmailHtml = (order: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #1F2937; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px; }
        .header h1 span { color: #C89B3C; }
        .content { padding: 40px 30px; color: #333333; }
        .content h2 { font-size: 22px; margin-top: 0; margin-bottom: 20px; color: #1F2937; }
        .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #5A5A5A; }
        .order-details { background-color: #F8F6F2; border-radius: 8px; padding: 20px; margin: 30px 0; }
        .order-details h3 { font-size: 18px; margin-top: 0; margin-bottom: 15px; color: #1F2937; border-bottom: 1px solid #DCCFC0; padding-bottom: 10px; }
        .order-item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #5A5A5A; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;}
        .order-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .totals { margin-top: 20px; padding-top: 15px; border-top: 2px solid #DCCFC0; }
        .total-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #5A5A5A; }
        .total-row.grand-total { font-size: 18px; font-weight: bold; color: #1F2937; margin-top: 10px; }
        .info-section { margin-top: 30px; }
        .info-section h4 { font-size: 16px; margin-bottom: 10px; color: #1F2937; }
        .info-section p { font-size: 14px; color: #5A5A5A; line-height: 1.5; margin-bottom: 5px; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; }
        .footer p { font-size: 12px; color: #999999; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Hooks <span>&</span> Knots</h1>
        </div>
        <div class="content">
            <h2>Order Confirmed!</h2>
            <p>Hi ${order.first_name},</p>
            <p>Thank you for your purchase. We have received your order <strong>#${order.order_number}</strong> and are getting it ready.</p>
            
            <div class="order-details">
                <h3>Order Summary</h3>
                ${order.items.map((item: any) => `
                <div class="order-item">
                    <span style="flex: 2;">${item.product_name} x ${item.quantity}</span>
                    <span style="flex: 1; text-align: right;">₹${item.total_price}</span>
                </div>
                `).join('')}
                
                <div class="totals">
                    <div class="total-row">
                        <span>Subtotal</span>
                        <span>₹${order.subtotal}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping</span>
                        <span>₹${order.shipping}</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Total Amount</span>
                        <span>₹${order.total}</span>
                    </div>
                </div>
            </div>

            <div class="info-section">
                <h4>Shipping Address</h4>
                <p>
                    ${order.shipping_name}<br>
                    ${order.shipping_address}<br>
                    ${order.shipping_city}, ${order.shipping_state} ${order.shipping_pincode}<br>
                    ${order.shipping_country}
                </p>
            </div>

            <p style="margin-top: 30px;">If you have any questions about your order, reply to this email or contact our support team.</p>
            
            <p>Best Regards,<br><strong>Hooks & Knots Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Hooks & Knots. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
