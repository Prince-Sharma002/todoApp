importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyCDY9JJb0c0Diydim9j5TkJynxeZI6qdpE",
  authDomain: "todo-6b543.firebaseapp.com",
  projectId: "todo-6b543",
  storageBucket: "todo-6b543.appspot.com",
  messagingSenderId: "577197753464",
  appId: "1:577197753464:web:ddc87bf451b358bc70598d",
  measurementId: "G-8YMCV04CJK"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
