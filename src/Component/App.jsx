import "./styles/app.scss";
import React, { useState, useEffect } from 'react';
import Speech from 'react-speech';
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { SiGoogleforms } from "react-icons/si";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getMessaging, getToken } from "firebase/messaging";
import {messaging} from "./firebase";

const TodoList = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [items, setItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [x, setX] = useState(0);
  const [text, settext] = useState("");
  const [time, setTime] = useState(new Date());
  const [myToken , setMyToken ] = useState("");
  const msg = new SpeechSynthesisUtterance()

  async function getPermission() {
    const permission = await Notification.requestPermission();

    if( permission === 'granted' ){
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BDmacvpeNC0NhCh1yeUKST0JEtsKVVrhCZiuSJOthb9nXmPEeN5rXJyLzfyE_ADR9wSwrFyUw0hTToPt5oS0_Fs",
      });
      setMyToken(token);
      console.log("Token Gen", token);
    }
    else if( permission === "denied"){
      console.log("permission denied");
    }
    
  }
  
  useEffect(() => {
    getFromLocalStorage();
    getPermission();
  }, []);

  function extractSubject(inputString) {
    // Define a regex pattern to match the subject
    const regexPattern = /of subject\s*([\w\s.-]+)/i;

    // Use the regex pattern to match against the input string
    const match = inputString.match(regexPattern);

    if (match) {
      // Extracted subject
      const [, subject] = match;
      return subject;
    } else {
      return null; // Return null if no match is found
    }
  }
  
  const addToG = (element , element2) => {


    const subject = extractSubject(element);
    if (subject) {
      console.log("Subject:", subject);
      element2 = subject;
      
      const keyword = "of subject";

      const keywordIndex = element.indexOf(keyword);

      if (keywordIndex !== -1) {
          element = element.substring(0, keywordIndex).trim();
      }
      
    }
     
    if (element !== '') {
      const timePattern = /(\d{1,2}:\d{2} [AaPp][Mm])/;
      const match = element.match(timePattern);
      if (match) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const time = match[0];
        const item = {
          id:  Date.now(),
          name: element,
          time: `${date}/${month}/${year}`,
          check: false,
          agenda : element2,
        };

        setItems([...items, item]);
        changeText();
        addInLocalStorage([...items, item]);

        // Calculate the time in milliseconds until the notification
        const now = new Date();
        const [timeStr, ampm] = time.split(' ');
        const [hours, minutes] = timeStr.split(':');
        let notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        // Adjust for AM/PM
        if (ampm.toLowerCase() === 'pm' && hours < 12) {
          notificationTime.setHours(notificationTime.getHours() + 12);
        } else if (ampm.toLowerCase() === 'am' && hours === 12) {
          notificationTime.setHours(notificationTime.getHours() - 12);
        }

        const timeUntilNotification = notificationTime - now;

        // Schedule the notification
        setTimeout(() => {
          speak(`sir time to, ${item.name}`);
          toast(`"${item.agenda} : ${item.name}"`, { autoClose: 10000 });
        }, timeUntilNotification);
      } else {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const item = {
          id:  Date.now(),
          name: element,
          check: false,
          time : `${date}/${month}/${year}`,
          agenda : element2,
        };

        setItems([...items, item]);
        changeText();
        addInLocalStorage([...items, item]);
      }

      setInputValue('');
    }
  };

  const changeText = () => {
    settext(items.map((item) => item.name).join(', '));
    // const utterance = new SpeechSynthesisUtterance(text);
    // utterance.lang = 'en-US';
    // speechSynthesis.speak(utterance);
  }

  const speakTodo = () => {
    
    let textToSpeak = items.map((item) => item.name).join(', ');
    if (window.speechSynthesis) {
      if (!textToSpeak.trim()) { 
        let msg = new SpeechSynthesisUtterance("no task schedule sir,");
         window.speechSynthesis.speak(msg);
 }
      else{
        textToSpeak = "sir you need to," + textToSpeak;
        let msg = new SpeechSynthesisUtterance(textToSpeak);
        window.speechSynthesis.speak(msg);
      }
    }
  };

  const speak = (text) => {
    const textToSpeak = text;
    if (window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(msg);
    }
  };

  function wordToNumber(word) {
    const wordsToNumbers = {
      zero: 0, one: 1, first:1, two: 2, second:2, three: 3, third : 3 ,four: 4, fourth:4,
      five: 5, fifth : 5 , 
      six: 6, sixth:6, seven: 7,seventh:7, eight: 8,eigth:8, nine: 9, ninth:9 ,ten: 10 ,           tenth:10 
    };
    return wordsToNumbers[word.toLowerCase()];
  }

  function extractNumberFromString(str) {
    const words = str.split(' ');
    let extractedNumber = null;

    for (let i = 0; i < words.length; i++) {
      const number = wordToNumber(words[i]);
      if (!isNaN(number)) {
        extractedNumber = number;
        break;
      }
    }

    return extractedNumber;
  }

  
  const [transcript, setTranscript] = useState('');
  const recognition = new window.webkitSpeechRecognition();

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    setTranscript(result);
    const resultLC = result.toLowerCase();
    if (resultLC.includes("add") || resultLC.includes("insert")) {
      let item = result.split(" ").slice(1).join(" ");

      // Replace "p.m." with "PM" and "a.m." with "AM"
      item = item.replace(/p\.m\./gi, "PM").replace(/a\.m\./gi, "AM");

      speak(",added sir");
      addToG(item);
    }

    else if (resultLC.includes("delete all")) {
      deleteAll();
    }
    else if( resultLC.includes("delete") ){
      const extractedInt = extractNumberFromString(resultLC);
      if( extractedInt <= items.length ){
        items.splice(extractedInt-1, 1);
        setItems(items);
        changeText();
        addInLocalStorage(items);
        display(items);
      }
    }
    else if (resultLC.includes("plan")) {
      if (items.length > 0) {
        const todayTodo = items
          .filter((item) => item.check === false)
          .map((item) => item.name).join(', ');

        const msg = `sir you need too , ${todayTodo}`;
        speak(msg);
      }
      else {
        speak("there is no task sir");
      }
    }
    else if (resultLC.includes("time")) {
      speak(`its ${time.getHours()} ${time.getMinutes()} `);
    }
  };

  
  const startRecognition = () => {
    recognition.start();
  };

  const MuteFunc = () => {
    recognition.stop();
    setTranscript("");
  }

  const display = (itemList) => {
    
    return (
      <ul className="gItems">
        {itemList.map((item) => (
          <li className="bg-stone-900 px-2 my-1" key={item.id} data-key={item.id}>
            <input
              type="checkbox"
              className="form-checkbox text-pink-600"
              checked={item.check}
              onChange={() => toggle(item.id)}
            />

          <div className="flex flex-col" > 
            <div className="flex flex-row">
              <p className="text-sm bg-stone-900 text-white p-1 me-1"> {item.time} </p>
              <p className="text-sm bg-rose-600 text-white p-1"> {item.agenda} </p>
            </div>
            <p className='text-lg text-white'> {item.name}  </p>
          </div>
                
            <button

              className="delete-button bg-white text-black"
              type="button"
              onClick={() => deleteItem(item.id)}
            >
              Del
            </button>
          </li>
        ))}
      </ul>
    );
  };


  const Clock = () => {

    useEffect(() => {
      // Update the time every second
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);

      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    }, []);

    // Format the time as HH:MM:SS
    const formattedTime = time.toLocaleTimeString();

    return (
      <div className="clock text-left">
        <span className='text-left text-white'>{formattedTime}</span>
      </div>
    );
  };


  const deleteAll = () => {
    if (items.length > 0) {
      speak("All items deleted");
      setItems([]);
      changeText();
      addInLocalStorage([]);
      return;
    }
    else {
      speak("No Item To delete");
    }

  }




  const addInLocalStorage = (itemList) => {
    localStorage.setItem('ItemList', JSON.stringify(itemList));
  };

  const getFromLocalStorage = () => {
    const reference = localStorage.getItem('ItemList');
    if (reference) {
      setItems(JSON.parse(reference));
    }
  };

  const deleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    changeText();
    addInLocalStorage(updatedItems);
  };

  const toggle = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, check: !item.check } : item
    );
    setItems(updatedItems);
    addInLocalStorage(updatedItems);

  };


  // const notify = () => toast('jai shri ram');


  // if (time.getHours() === 14 && time.getMinutes() === 45 && time.getSeconds() === 0) {
  //   notify();
  //   speak("jai shri ram");
  // }

  return (
    <div className="container mx-auto p-0 m-0">
      
      <h1>To-Do</h1>
      <form
        className="gForm px-4 py-1  place-content-center"
        onClick={(e) => {
          e.preventDefault();
          addToG(inputValue , inputValue2);
        }}
      >

        <div className='inputDiv1 flex flex-col lg:flex-row justify-center'>
          <input
            className='gInput bg-transparent placeholder:italic  placeholder:text-white block border border-slate-300  py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm w-full md:w-1/3 lg:w-1/3 sm:text-center md:text-left m-1 text-white'
            type="text" placeholder='Add Subject' value={inputValue2}
            onChange={(e)=> setInputValue2(e.target.value)} />
          
          <input
            type="text"
            className="gInput  placeholder:italic placeholder:text-white block bg-transparent border border-slate-300 py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm w-full md:w-1/2 lg:w-1/2  sm:text-center md:text-left m-1"
            placeholder="Add To-Do"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        
        <button
          className="add-button text-center mx-auto mt-5 py-2 px-8 bg-rose-600 shadow-lg hover:bg-rose-600 text-white text-xl hover:bg-white hover:text-black  rounded ..."
          type="submit"
        >
          Add
        </button>
      </form>

      <h2 className="GroceryList  text-white tracking-wider text-2xl mb-1 mt-10">
        To-Do List
      </h2>

      <div className="ItemDiv mx-2 text-white border-4 rounded-lg  p-3 md:w-3/2 mb-40">
        {items.length === 0 ? <p>No To do's</p> : display(items)}
      </div>

      <div className='p-2 lg:absolute bottom-20 right-0 mt-4 mb-2  border-2 text-left bg-zinc-100 rounded-lg me-2'>
        <h6 className="font-bold ">Transcript:</h6>
        <p className='text-xs font-thin tracking-tighter text-gray-700'> {transcript}... </p>
      </div>

      <div className="footer h-16 z-0 bg-slate-600/20 w-full lg:absolute bottom-0 left-0 
                      flex justify-center items-center space-x-4 p-10">


        <div className="leftIcons w-full" >
          {Clock()}
        </div>

        <div className="middleIcons w-full flex space-x-4" >

          <button className='z-10 text-2xl bg-rose-500 rounded-full p-4 text-white  hover:text-slate-900' onClick={startRecognition}>
            {<BsMicFill />}
          </button>

          <button className='z-10 text-2xl bg-rose-500 rounded-full p-4 text-white  hover:text-slate-900' onClick={MuteFunc}>
            {<BsMicMuteFill />}
          </button>

        </div>

        <div className="rightIcons flex space-x-4" >

          <button className='z-10 text-lg bg-stone-900 rounded-full p-2 text-white border-2 hover:bg-white hover:text-black' onClick={deleteAll}>
            {<AiFillDelete />}
          </button>

          <button className='z-10 text-lg bg-stone-900 rounded-full p-2 text-white border-2 hover:bg-white hover:text-black' onClick={speakTodo}>
            {<SiGoogleforms />}
          </button>
        </div>

      </div>


      {/* <div>
        <button onClick={notify} > Nootify </button>
        < ToastContainer />
      </div> */}

      <ToastContainer />

    </div>
  );
};

export default TodoList;
