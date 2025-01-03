import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #20d49a;
                    padding-bottom: 10px;
                }
                .header h1 {
                    color: #20d49a;
                    font-size: 24px;
                }
                .content {
                    margin-top: 20px;
                    text-align: center;
                }
                .otp-code {
                    display: inline-block;
                    font-size: 24px;
                    font-weight: bold;
                    color: #333333;
                    background-color: #f4f4f4;
                    padding: 10px 20px;
                    border-radius: 5px;
                    letter-spacing: 2px;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #666666;
                    font-size: 14px;
                }
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 10px;
                    }
                    .otp-code {
                        font-size: 18px;
                        padding: 8px 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Your OTP Code</h1>
                </div>
                <div class="content">
                    <p>Hi,</p>
                    <p>Thank you for signing up. Use the OTP below to verify your email address:</p>
                    <div class="otp-code">${otp}</div>
                    <p>Please note that this OTP is valid for only 5 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP email:", error);
    } else {
      console.log("OTP email sent to " + email + ": " + info.response);
    }
  });
};
