const subscribeAdminToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push not supported');
    return;
  }

  try {
    const reg = await navigator.serviceWorker.ready;

    // Unsubscribe existing first to force fresh save to MongoDB
    const existing = await reg.pushManager.getSubscription();
    if (existing) await existing.unsubscribe();

    // Subscribe fresh
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    });

    // Send subscription to backend
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    });

    console.log('Push subscription registered');
  } catch (err) {
    console.error('Subscription error:', err);
  }
};