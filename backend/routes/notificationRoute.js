import express from 'express';
import webpush from 'web-push';

const router = express.Router();

let adminSubscription = null;

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Admin panel calls this to register the device
router.post('/subscribe', (req, res) => {
  adminSubscription = req.body;
  console.log('Admin subscribed for push notifications');
  res.json({ success: true });
});

// This function is called when a new order is placed
export const sendOrderNotification = async (order) => {
  if (!adminSubscription) {
    console.log('No admin subscription found');
    return;
  }
  try {
    await webpush.sendNotification(
      adminSubscription,
      JSON.stringify({
        title: '🛒 New Order!',
        body: `New order received — ৳${order.amount}`,
      })
    );
  } catch (err) {
    console.error('Push failed:', err);
    adminSubscription = null; // clear expired subscription
  }
};

export default router;