import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/send-contact', async (req, res) => {
  const { fullname, number, email, website, subject, message } = req.body;

  if (!fullname || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  const mailOptions = {
    from: `"${fullname}" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_TO,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${number || 'N/A'}</p>
      <p><strong>Website:</strong> ${website || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
});

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'mpa',
});

app.use(vite.middlewares);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
