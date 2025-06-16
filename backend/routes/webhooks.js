const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/webhooks/clerk - Handle Clerk webhooks
router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payload = req.body;
    const headers = req.headers;

    // Verify webhook signature (implement based on Clerk's documentation)
    // const isValid = verifyClerkWebhook(payload, headers);
    // if (!isValid) {
    //   return res.status(400).json({ error: 'Invalid signature' });
    // }

    const event = JSON.parse(payload.toString());
    
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;
      case 'user.updated':
        await handleUserUpdated(event.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing Clerk webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleUserCreated(userData) {
  try {
    const user = new User({
      clerkId: userData.id,
      email: userData.email_addresses[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
      username: userData.username,
      avatar: userData.image_url,
      emailVerified: userData.email_addresses[0]?.verification?.status === 'verified'
    });

    await user.save();
    console.log('User created:', user.email);
  } catch (error) {
    console.error('Error creating user from webhook:', error);
  }
}

async function handleUserUpdated(userData) {
  try {
    const user = await User.findOne({ clerkId: userData.id });
    
    if (user) {
      user.email = userData.email_addresses[0]?.email_address || user.email;
      user.firstName = userData.first_name || user.firstName;
      user.lastName = userData.last_name || user.lastName;
      user.username = userData.username || user.username;
      user.avatar = userData.image_url || user.avatar;
      user.emailVerified = userData.email_addresses[0]?.verification?.status === 'verified';
      
      await user.save();
      console.log('User updated:', user.email);
    }
  } catch (error) {
    console.error('Error updating user from webhook:', error);
  }
}

async function handleUserDeleted(userData) {
  try {
    await User.findOneAndUpdate(
      { clerkId: userData.id },
      { isActive: false }
    );
    console.log('User deactivated:', userData.id);
  } catch (error) {
    console.error('Error deactivating user from webhook:', error);
  }
}

module.exports = router;