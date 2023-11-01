import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Notify = ()=>{

  // const [message, setMessage] = useState('');
  // const [notificationTime, setNotificationTime] = useState('');

  // const handleChange = (e) => {
  //   setMessage(e.target.value);
  // };

  // const handleTimeChange = (e) => {
  //   setNotificationTime(e.target.value);
  // };

  // const notify = () => {
  //   // Display the notification with the message and custom timestamp
  //   toast(`Message: ${message}\nTime: ${notificationTime}`);
  //   // Store the message and custom timestamp in local storage
  //   localStorage.setItem('userMessage', message);
  //   localStorage.setItem('notificationTime', notificationTime);
  // };
  

  return(

    <div>
      {/* <h1> Notify </h1>
      <input
        type="text"
        placeholder="Enter a message"
        value={message}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Enter a custom time (e.g., 12:00 PM)"
        value={notificationTime}
        onChange={handleTimeChange}
      />
      <button onClick={notify}>Show Notification</button>
      <ToastContainer /> */}
    </div>
    
  )
  
}

export default Notify;