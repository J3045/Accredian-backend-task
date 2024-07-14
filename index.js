const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const sendMail = require('./sendMail');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
app.use(cors());

app.use(bodyParser.json());

app.post('/api/referral', async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

  if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if referral already exists for the referee email
    let referral = await prisma.referral.findFirst({
      where: { refereeEmail },
    });

    if (!referral) {
      // Create unique referral code
      const referralCode = `ref-${Math.random().toString(36).substr(2, 9)}`;

      // Create new referral
      referral = await prisma.referral.create({
        data: {
          referrerName,
          referrerEmail,
          refereeName,
          refereeEmail,
          referralCode,
        },
      });
    }

    // Send referral email using Nodemailer
    const mailOptions = {
      to: refereeEmail,
      subject: 'Course Referral',
      text: `Hi ${refereeName},\n\n${referrerName} (${referrerEmail}) has referred you. Your referral code is: ${referral.referralCode}`,
      referrerName,
      referrerEmail,
      refereeName,
      referralCode: referral.referralCode,
    };
    await sendMail(mailOptions);

    res.status(201).json(referral);
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'Failed to create referral or send email' });
  }
});

app.delete('/api/referral', async (req, res) => {
  try {
    await prisma.referral.deleteMany();

    res.status(200).json({ message: 'All referrals deleted successfully' });
  } catch (error) {
    console.error('Error deleting referrals:', error);
    res.status(500).json({ error: 'Failed to delete referrals' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
