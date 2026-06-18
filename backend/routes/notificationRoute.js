import express from 'express';
import webpush from 'web-push';
import subscriptionModel from '../models/subscriptionModel.js';

const router = express.Router();

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Admin panel calls this to register the device
router.post('/subscribe', async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    await subscriptionModel.findOneAndUpdate(
      { endpoint },
      { endpoint, keys },
      { upsert: true, new: true }
    )
    console.log('Admin subscribed for push notifications');
    res.json({ success: true });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
});

// This function is called when a new order is placed
export const sendOrderNotification = async (order) => {
  try {
    const subscriptions = await subscriptionModel.find({})
    if (subscriptions.length === 0) {
      console.log('No admin subscription found');
      return;
    }
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          sub,
          JSON.stringify({
            title: '🛒 New Order!',
            body: `New order received — ৳${order.amount}`,
          })
        );
      } catch (err) {
        console.error('Push failed:', err);
        // remove expired subscription
        await subscriptionModel.findOneAndDelete({ endpoint: sub.endpoint })
      }
    }
  } catch (error) {
    console.error('Notification error:', error)
  }
};

export default router;