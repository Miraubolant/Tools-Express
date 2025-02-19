import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { from, to, subject, html, attachments } = req.body;

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      attachments
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(400).json({ error });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error sending email' });
  }
}