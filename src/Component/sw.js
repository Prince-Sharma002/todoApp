// sw.js

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: 'path-to-icon.png', // Replace with your icon path
  };

  event.waitUntil(
    self.registration.showNotification('To-Do Notification', options)
  );
});