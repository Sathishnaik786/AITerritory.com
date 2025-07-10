const supabase = require('../config/database');

const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    if (!event || !event.event_type) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    // Only handle payment completed events
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const transactionId = event.resource && event.resource.id;
      if (!transactionId) {
        return res.status(400).json({ error: 'Missing transaction ID in webhook' });
      }
      // Find the tool submission with this transaction_id
      const { data: submission, error: findError } = await supabase
        .from('tool_submissions')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();
      if (findError || !submission) {
        return res.status(404).json({ error: 'Submission not found for transaction ID' });
      }
      // Update payment_status to 'paid'
      const { error: updateError } = await supabase
        .from('tool_submissions')
        .update({ payment_status: 'paid' })
        .eq('id', submission.id);
      if (updateError) {
        return res.status(500).json({ error: 'Failed to update payment status' });
      }
      return res.status(200).json({ success: true });
    } else {
      // Log other events for now
      console.log('Received PayPal webhook event:', event.event_type);
      return res.status(200).json({ received: true });
    }
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return res.status(500).json({ error: 'Webhook handler error' });
  }
};

module.exports = { handleWebhook }; 