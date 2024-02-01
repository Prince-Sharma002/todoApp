import {  React, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Speech from 'react-speech';
import "./styles/about.scss"



const About = ()=>{

  const [buttontext , setbuttontext] = useState("Speak");
    const textToSpeak = `
  Welcome to our innovative Todo App, where productivity meets convenience! Our application offers a unique user experience by integrating speech recognition for seamless task management. Whether you're on the go or prefer hands-free operation, our app caters to your needs.

  Key Features:

  Speech Integration: Perform tasks effortlessly by simply using your voice. Add, delete, or manage todos without typing a single word. Our app understands your commands and executes them promptly.

  Task Management: Organize your daily routine efficiently. Add, remove, or modify tasks effortlessly, ensuring nothing slips through the cracks. You can prioritize, categorize, and keep track of all your todos hassle-free.

  Voice Output: Experience the convenience of auditory feedback. Our app not only recognizes your voice commands but also responds audibly, keeping you updated on your tasks and schedules.

  Automatic Notifications: Stay on top of your agenda with automatic notifications. Set reminders within your todos, and our app ensures you never miss an important deadline or task.

  Time Display: Our app offers real-time clock updates. Easily check the current time while managing your todos, allowing you to stay organized and on schedule throughout your day.

  Why Choose Our App:

  Efficiency: Save time and effort by managing tasks hands-free with voice commands.
  Customization: Tailor your todos and notifications to suit your unique schedule and preferences.
  Accessibility: Our app is designed for everyone, ensuring ease of use for all users, including those with accessibility needs.
  Our goal is to provide a seamless, user-friendly experience that simplifies task management and enhances productivity in your daily life. Embrace the future of todo management with our innovative app!

  Download now and experience a new way of organizing your tasks effortlessly.

  `
  
const AboutSpeak = ()=>{

  if (window.speechSynthesis && buttontext === "Speak") {
    const msg = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(msg);
    setbuttontext("Stop");
  }
  else{
    window.speechSynthesis.cancel();
    setbuttontext("Speak");
  }
}
  

  
  return(

    <section className="about">
      <h1 className="text-center">About</h1>
      <p className='text-justify'>Welcome to our innovative Todo App, where productivity meets convenience! Our application offers a unique user experience by integrating speech recognition for seamless task management. Whether you're on the go or prefer hands-free operation, our app caters to your needs.</p>

<div>
  <h3>Keyframes : </h3>

  <p> 
    <span>Speech Integration:</span>
    Perform tasks effortlessly by simply using your voice. Add, delete, or manage todos without typing a single word. Our app understands your commands and executes them promptly.
 </p>

  <p>
    <span>Task Management:</span> Organize your daily routine efficiently. Add, remove, or modify tasks effortlessly, ensuring nothing slips through the cracks. You can prioritize, categorize, and keep track of all your todos hassle-free.
  </p>

  <p>
    <span>Voice Output:</span> Experience the convenience of auditory feedback. Our app not only recognizes your voice commands but also responds audibly, keeping you updated on your tasks and schedules.
  </p>

<p>
    <span>Automatic Notifications:</span> Stay on top of your agenda with automatic notifications. Set reminders within your todos, and our app ensures you never miss an important deadline or task.
</p> 

<p>
    <span>Time Display:</span> Our app offers real-time clock updates. Easily check the current time while managing your todos, allowing you to stay organized and on schedule throughout your day.
</p>  


</div>     

<div className='text-justify'>
<h3>
  Why Choose Our App:
</h3>

      <p>
      <span>Efficiency:</span> Save time and effort by managing tasks hands-free with voice commands.
        </p>
  <p>
      <span>Customization:</span> Tailor your todos and notifications to suit your unique schedule and preferences.
  </p>
  <p>
      <span>Accessibility:</span> Our app is designed for everyone, ensuring ease of use for all users, including those with accessibility needs.
  </p>
      Our goal is to provide a seamless, user-friendly experience that simplifies task management and enhances productivity in your daily life. Embrace the future of todo management with our innovative app!

      Download now and experience a new way of organizing your tasks effortlessly.
</div>      
      <button onClick={AboutSpeak}> {buttontext}  </button>
    </section>
    
  )
  
}

export default About;