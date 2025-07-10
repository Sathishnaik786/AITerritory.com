async function sendWelcomeEmail(email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) throw new Error('Resend API key or sender missing');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: 'Welcome to AI Territory Newsletter! 🚀',
      html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px 24px;background:#f9fafb;border-radius:12px;text-align:center;">
        <h2 style="color:#3b82f6;font-size:2rem;margin-bottom:8px;">Welcome to AI Territory! 🎉</h2>
        <p style="font-size:1.1rem;color:#222;margin-bottom:18px;">Thank you for subscribing to our newsletter.<br>Get ready for the latest AI insights, guides, and exclusive tools—straight to your inbox.</p>
        <p style="color:#6366f1;font-weight:bold;">Stay ahead in AI with us!</p>
        <hr style="margin:24px 0;">
        <p style="font-size:0.95rem;color:#888;">You can unsubscribe at any time.<br>AI Territory Team</p>
      </div>`
    })
  });
  if (!res.ok) throw new Error('Failed to send welcome email');
}

module.exports = { sendWelcomeEmail }; 