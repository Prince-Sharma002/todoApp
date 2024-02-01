import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Speech from 'react-speech';
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import "./styles/stopwatch.scss"


const PomodoroTimer = () => {
const [pomodoro, setPomodoro] = useState(25);
const [breakTime, setBreakTime] = useState(5);
const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 }); // Initial time
const [isPomodoro, setIsPomodoro] = useState(true);
const [isRunning, setIsRunning] = useState(false);
const [text, settext] = useState("");
const [time, setTime] = useState(new Date());

const [transcript, setTranscript] = useState('');
const recognition = new window.webkitSpeechRecognition();
  
  const speak = (text) => {
    const textToSpeak = text;
    if (window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(msg);
    }
  };

useEffect(() => {
  document.title = `${('0' + timeLeft.minutes).slice(-2)}:${('0' + timeLeft.seconds).slice(-2)}`;
  if (isRunning) {
    const countdown = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.minutes === 0 && prevTime.seconds === 0) {
          clearInterval(countdown);
          if (isPomodoro) {
            startBreak();
          } else {
            startPomodoro();
          }
          return { minutes: timeLeft.minutes, seconds: 0 }; // Reset the timer
        } else if (prevTime.seconds === 0) {
          return { minutes: prevTime.minutes - 1, seconds: 59 };
        } else {
          return { minutes: prevTime.minutes, seconds: prevTime.seconds - 1 };
        }
      });
    }, 1000);
    return () => clearInterval(countdown);
  }
}, [isRunning, isPomodoro, timeLeft.minutes, timeLeft.seconds]);

const startClock = () => {
  setIsRunning(true);
  speak("its study time, work hard");
  toast("study time, work hard");
};

const startPomodoro = () => {
  setIsPomodoro(true);
  setIsRunning(false);
  setTimeLeft({ minutes: pomodoro, seconds: 0 });
};

const startBreak = () => {
  setIsPomodoro(false);
  setIsRunning(false);
  speak("its Break Time , have some fun");
  toast("Break Time , have some fun");
  setTimeLeft({ minutes: breakTime, seconds: 0 });
};

  const resetClock = () => {
    setIsRunning(false);
    setTimeLeft({
      minutes: isPomodoro ? pomodoro : breakTime,
      seconds: 0,
    });
  };

  const handleLengthChange = (type, value) => {
    if (type === 'pomodoro') {
      setPomodoro((prevPomodoro) => Math.min(Math.max(prevPomodoro + value, 1), 60));
    } else {
      setBreakTime((prevBreakTime) => Math.min(Math.max(prevBreakTime + value, 1), 15));
    }
    resetClock();
  };


  const startRecognition = () => {
    recognition.start();
  };

  const MuteFunc = () => {
    recognition.stop();
    setTranscript("");
  }

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    setTranscript(result);
    const resultLC = result.toLowerCase();
    if( resultLC.includes("study")){
      startClock();
    }
    else if( resultLC.includes("break") ){
      startBreak();
    }
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


  const deadline = new Date(Date.parse(new Date()) + (timeLeft.minutes * 60 * 1000));

  return (
    <div className="main ">
      <h1>StopWatch</h1>
      <div className="container mx-auto mb-8">
        <div className="session-length">
          <div className="pomodoro-length bg-stone-700 w-1/2 mx-auto text-white p-1">
            <p className="text-lg bolder text-white my-1">Session Length</p>
            <button
              className="btn btn-count text-4xl hover:text-rose-500"
              onClick={() => handleLengthChange('pomodoro', 1)}
            >
              +
            </button>
            <span className="pomodoro-minutes-count mx-4">{pomodoro}</span>
            <button
              className="btn btn-count text-4xl hover:text-rose-500"
              onClick={() => handleLengthChange('pomodoro', -1)}
            >
              -
            </button>
          </div>

          <div className="break-time-length bg-stone-900 w-1/2 mx-auto text-white p-1">
            <p className="break text-lg bolder text-white my-1">Break Time</p>
            <button
              className="btn btn-count text-4xl hover:text-rose-500"
              onClick={() => handleLengthChange('break', 1)}
            >
              +
            </button>
            <span className="break-minutes-count mx-4">{breakTime}</span>
            <button
              className="btn btn-count text-4xl hover:text-rose-500"
              onClick={() => handleLengthChange('break', -1)}
            >
              -
            </button>
          </div>
        </div>

        <section className="clock bg-stone-200 mx-auto w-1/2 py-4">
          <div className="clock-timer text-4xl py-4 text-rose-500" id="clock-timer ">
            <span className="minutes">{('0' + timeLeft.minutes).slice(-2)}</span>:
            <span className="seconds">{('0' + timeLeft.seconds).slice(-2)}</span>
          </div>

          <div className="options">
            <button
              className="btn btn-control start-pomodoro border-2 bg-black text-white p-2 hover:text-rose-500"
              onClick={startClock}
              disabled={isRunning}
            >
              Start Timer
            </button>
            <button
              className="btn btn-control break border-2 bg-black text-white p-2 hover:text-rose-500"
              onClick={startBreak}
              disabled={isRunning}
            >
              Take a break
            </button>
            <button
              className="btn btn-control reset hidden"
              onClick={resetClock}
              disabled={!isRunning}
            >
              Reset
            </button>
          </div>
        </section>
      </div>

      <div className="footer h-16 z-0 bg-slate-600/20 w-full bottom-0 left-0
                    flex justify-center items-center space-x-4 p-10 lg:absolute">
      <div className="leftIcons w-full text-white" >
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

    </div>
      
      <ToastContainer />
    </div>
  );
};

export default PomodoroTimer;
