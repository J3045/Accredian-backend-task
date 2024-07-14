const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const sendMail = async ({ to, referrerName, referrerEmail, refereeName, referralCode }) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to,
      subject: 'Course Referral',
      text: `Hi ${refereeName},\n\n${referrerName} (${referrerEmail}) has referred you. Your referral code is:\n${referralCode}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Referral Invite</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    background-color: #ffffff;
                    width: 80%;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border: 1px solid #ddd;
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                }
                .header img {
                    max-width: 100%;
                    height: auto;
                }
                .content {
                    padding: 20px 0;
                    text-align: center;
                }
                .content h1 {
                    color: #333333;
                }
                .content p {
                    color: #555555;
                }
                .referral-code {
                    background-color: #ff6347;
                    color: #ffffff;
                    padding: 10px 20px;
                    border-radius: 5px;
                    display: inline-block;
                    font-size: 18px;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    padding: 10px 0 5px;
                    color: #888888;
                    font-size: 12px;
                }
                .social-media {
                    text-align: center;
                    margin: 10px 0;
                }
                .social-media a {
                    margin: 0 5px;
                    text-decoration: none;
                    color: #ff6347;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="cid:referral_email.png" alt="Referral Image">
                </div>
                <div class="content">
                    <h1>Hello, ${refereeName}!</h1>
                    <p>${referrerName} (${referrerEmail}) has referred you to our course.</p>
                    <p>Your referral code is:</p>
                    <p><span class="referral-code">${referralCode}</span></p>
                </div>
                <div class="footer">
                    <div class="social-media">
                        <a href="https://www.facebook.com">Facebook</a>
                        <a href="https://www.twitter.com">Twitter</a>
                        <a href="https://www.linkedin.com">LinkedIn</a>
                    </div>
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'referral_email.png',
          path: path.join(__dirname, 'referral_email.png'),
          cid: 'referral_email.png'
        }
      ]
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendMail;
