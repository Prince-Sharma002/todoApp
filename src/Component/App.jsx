import './App.css'
import React, { useState, useEffect } from 'react';
import Speech from 'react-speech';
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { SiGoogleforms } from "react-icons/si";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const TodoList = () => {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [x, setX] = useState(0);
  const [text, settext] = useState("");
  const [time, setTime] = useState(new Date());

  const msg = new SpeechSynthesisUtterance()

  useEffect(() => {
    getFromLocalStorage();
  }, []);

  const addToG = (element) => {
    if (element !== '') {
      const timePattern = /(\d{1,2}:\d{2} [AaPp][Mm])/;
      const match = element.match(timePattern);

      if (match) {
        const time = match[0];
        const item = {
          id: Date.now(),
          name: element,
          time: time,
          check: false,
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
        } else if (ampm.toLowerCase() === 'am'  && hours === 12) {
          notificationTime.setHours(notificationTime.getHours() - 12);
        }

        const timeUntilNotification = notificationTime - now;

        // Schedule the notification
        setTimeout(() => {
          speak(`sir time to , ${item.name}`);
          toast(`Time to "${item.name}"`, { autoClose: 10000 });
        }, timeUntilNotification);
      } else {
        const item = {
          id: Date.now(),
          name: element,
          check: false,
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
    const textToSpeak = items.map((item) => item.name).join(', ');
    if (window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(msg);
    }
  };

  const speak = (text) => {
    const textToSpeak = text;
    if (window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(msg);
    }
  };


  const [transcript, setTranscript] = useState('');
  const recognition = new window.webkitSpeechRecognition(); // Create a speech recognition object

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
    else if (resultLC.includes("plan")) {
          if (items.length > 0 ) {
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
          <li key={item.id} data-key={item.id}>
            <input
              type="checkbox"
              className="form-checkbox text-pink-600"
              checked={item.check}
              onChange={() => toggle(item.id)}
            />
            <span className='flex justify-center items-center'> {item.name} </span>

            <button
              className="delete-button"
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
        <span className='text-left'>{formattedTime}</span>
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
          addToG(inputValue);
        }}
      >
        <input
          type="text"
          className="gInput  placeholder:italic placeholder:text-slate-400 block bg-white w-1/2 border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm mx-auto w-full md:w-3/4 lg:w-1/2  sm:text-center md:text-left "
          placeholder="Add To-Do"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="add-button  text-center mx-auto mt-5  border-4 border-rose-600 shadow-lg hover:bg-rose-600 hover:text-white rounded ..."
          type="submit"
        >
          Add
        </button>
      </form>


      <h2 className="GroceryList text-neutrsl-800 tracking-wider text-xl mb-1 font-bold mt-10">
        To-Do List
      </h2>

      <div className="ItemDiv mx-2 border-4  p-3 md:w-3/2 mb-40">
        {items.length === 0 ? <p>No To do's</p> : display(items)}
      </div>

      <div className='p-2 absolute bottom-20 right-0 mt-4 mb-2  border-2 text-left bg-zinc-100 rounded-lg me-2'>
        <h7 className="font-bold ">Transcript:</h7>
        <p className='text-xs font-thin tracking-tighter text-gray-700'> {transcript}... </p>
      </div>
      
      <div className="footer h-16 z-0 bg-slate-600/20 w-full absolute bottom-0 left-0
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
