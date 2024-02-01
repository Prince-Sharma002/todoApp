// service-worker.js
self.addEventListener('message', event => {
  // Handle messages from the main app to schedule alarms
  const { time, label } = event.data;

  // Schedule an alarm using setTimeout or other mechanisms
  setTimeout(() => {
    self.registration.showNotification(label, {
      body: 'Alarm triggered!',
    });
  }, time - Date.now());
});

self.addEventListener('notificationclick', event => {
  // Handle notification click event (e.g., open the app or take action)
});
