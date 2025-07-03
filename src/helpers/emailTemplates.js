export const verificationEmailTemplate = (verifyLink, userName) => {
    return {
        subject: "Verify Your Ecountry Account",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
                    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
                    .content { padding: 30px; background-color: #f9f9f9; }
                    .button { display: inline-block; padding: 15px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-size: 16px; }
                    .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Ecountry!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName}!</h2>
                        <p>Thank you for joining Ecountry. Please verify your email address by clicking the button below:</p>
                        <div style="text-align: center;">
                            <a href="${verifyLink}" class="button">Verify Email</a>
                        </div>
                        <p>Or copy this link: ${verifyLink}</p>
                        <p>This link will expire in 24 hours for your security.</p>
                        <p>If you did not create an account, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Ecountry. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Hi ${userName}!\nThank you for joining Ecountry. Please verify your email: ${verifyLink}\nThis link expires in 24 hours.`
    };
};

export const passwordResetEmailTemplate = (resetToken, userName) => {
    return {
        subject: "Reset Your Ecountry Password",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
                    .header { background-color: #DC2626; color: white; padding: 20px; text-align: center; }
                    .content { padding: 30px; background-color: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 24px; background-color: #DC2626; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset - Ecountry</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName}!</h2>
                        <p>We received a request to reset your Ecountry account password. Use the code below to reset your password:</p>
                        <div class="code">${resetToken}</div>
                        <p>This code will expire in 1 hour for your security.</p>
                        <p>If you did not request a password reset, you can safely ignore this email.</p>
                        <p>Need help? Contact our support team anytime.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Ecountry. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Hi ${userName}!\nWe received a request to reset your Ecountry password. Your reset code is: ${resetToken}. This code expires in 1 hour. If you did not request this, you can ignore this email.`
    };
};

export const welcomeEmailTemplate = (userName) => {
    return {
        subject: "Welcome to Ecountry!",
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1>Welcome, ${userName}!</h1>
                <p>Your account has been successfully verified. You can now enjoy all the features of Ecountry!</p>
                <p>We're thrilled to have you as part of our community. If you have any questions, our support team is here to help.</p>
                <p>Start exploring and make the most of your Ecountry experience!</p>
                <p style="color: #666; font-size: 14px;">&copy; 2025 Ecountry. All rights reserved.</p>
            </div>
        `,
        text: `Welcome, ${userName}! Your account has been successfully verified. Enjoy all the features of Ecountry!`
    };
};