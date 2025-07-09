const { supabase } = require('../lib/supabase');
const { sendWelcomeEmail } = require('../lib/resend');

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  // Check for existing email
  const { data: existing, error: findError } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .single();
  if (existing) {
    return res.status(409).json({ error: 'You are already subscribed.' });
  }
  if (findError && findError.code !== 'PGRST116') {
    return res.status(500).json({ error: 'Database error.' });
  }
  // Insert new subscriber
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email }]);
  if (error) {
    return res.status(500).json({ error: 'Failed to subscribe.' });
  }
  // Send welcome email (non-blocking)
  sendWelcomeEmail(email).catch(e => console.error('Welcome email error:', e));
  return res.status(200).json({ message: 'Subscribed successfully!' });
};

exports.getAllSubscribers = async (req, res) => {
  // TODO: Add admin authentication/authorization if needed
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, created_at')
    .order('created_at', { ascending: false });
  if (error) {
    return res.status(500).json({ error: 'Failed to fetch subscribers.' });
  }
  return res.status(200).json({ subscribers: data });
};

exports.deleteSubscriber = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Missing subscriber id.' });
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: 'Failed to delete subscriber.' });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Subscriber not found.' });
  return res.status(200).json({ message: 'Subscriber deleted.' });
}; 