import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer , momentLocalizer  } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Popup from "reactjs-popup";

import "./styles/calendar.scss"

import { addDoc, collection , getDocs , query , deleteDoc , doc} from "firebase/firestore";
import {db , auth , getUserId } from "./firebase";




const locales = {
    "en-US": import("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// first month start with 0 
const events = [
    {
        title: "Govind Gupta - Big Meeting",
        allDay: false,
        colorEvento:'green',
        start: new Date(2024, 0, 23),
        end: new Date(2024, 0, 24),
    },

  
  {
      title: "CT-3",
      colorEvento:'red',
      start: new Date(2024, 0, 10),
      end: new Date(2024, 0, 13),
  },
  {
     title:   "CT-3",
      colorEvento:'red',
      start: new Date(2024, 0, 15),
      end: new Date(2024, 0, 17),
    
  },
  {
      title: "Republic Day",
      colorEvento:'orange',
      start: new Date(2024, 0, 26),
       end : new Date (2024,0,27), 
  },
  {
      title: "Mini-Project competition",
      colorEvento:' deep pink',
      start: new Date(2024, 0, 17),
       end : new Date (2024,0,18), 
  },
];



// Function to define event colors
const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '';
    if (event.colorEvento) {
        backgroundColor = event.colorEvento;
    }
    const style = {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
};


function App() {

  const [info, setInfo] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [allEvents, setAllEvents] = useState([]);
  const [academicEvents, setAcademicEvents] = useState([]);

  const [passId , setPassId ] = useState("qwe");
  const passCodes = [ "zxc" , "bnm" , "asd" ];
  const passName = { "asd" : "Hoshiyar Singh" ,  "zxc" : "Govind Gupta" , "bnm" : "Avdhesh Tyagi" };
  
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Function to handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
  
  
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, `events`)
          )
        );
        const querySnapshot2 = await getDocs(
          query(
            collection(db, `academicCalendar`) 
          )
        );

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          start: doc.data().start.toDate(),
          end: doc.data().end.toDate(),
        }));
        const data2 = querySnapshot2.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          start: doc.data().start.toDate(),
          end: doc.data().end.toDate(),
        }));
        console.log(data2)
        setAllEvents( [ ...data , ...data2]);
        console.log( allEvents );
        } catch (error) {
        console.error('Error fetching data:', error);
        setAllEvents([]);
        }
        };

    fetchDataFromFirestore();
  }, []);

  // Function to format Firestore Timestamp to a readable date string
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata', // Adjust the timezone as needed
      // Add other date formatting options as per your requirement
    });
  };
    const handleAddEvent = async()=>{

        for (let i=0; i<allEvents.length; i++){

            const d1 = new Date (allEvents[i].start);
            const d2 = new Date(newEvent.start);
            const d3 = new Date(allEvents[i].end);
            const d4 = new Date(newEvent.end);
          
        }

      
      let title = newEvent.title;
      let start = newEvent.start;
      let end = newEvent.end;

      if( passCodes.includes(passId) ){

        let user = passName[passId];
        title = `${user} - ${title}`
        
      await addDoc( collection(db, `events`),{
        title,
        start,
        end,
      });
      setAllEvents([...allEvents, newEvent]);        
      }
      else {
        alert("Wrong Pass ID")
      } 
    }

  const handleDeleteEvent = async (event) => {
    try {
      const eventDocRef = doc(db, `events/${event.id}`);
      await deleteDoc(eventDocRef);
      const updatedEvents = allEvents.filter((ev) => ev.id !== event.id);
      setAllEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  
    return (
        <div className="App p-1">
            <h1>Calendar</h1>
            <div className="inputDiv mb-20 z-10 rounded-lg bg-transparent">
                <input className="titleInput text-white border-b-2 border-white addstyle bg-transparent text-black"
                  type="text"
                  placeholder="Add Title"
                  style={{  }}
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                <DatePicker 
                  className="startDate border-2 border-white z-50 addstyle bg-transparent text-white"
                  placeholderText="Start Date"
                  style={{  }} 
                  selected={newEvent.start}
                  onChange={(start) => setNewEvent({ ...newEvent, start })} />

                <DatePicker
                  className="endDate z-10 border-2 border-white addstyle bg-transparent text-white"
                  placeholderText="End Date"
                  selected={newEvent.end}
                  onChange={(end) => setNewEvent({ ...newEvent, end })} />        
              <input className=" addstyle bg-transparent border-b-2 border-white text-white" type="text" placeholder="Password" onChange={(e) => setPassId(e.target.value)} />
              
                <button
                  className="addButton text-center p-1 border-0 text-white bg-rose-600 hover:text-black hover:bg-white  rounded ... "
                  stlye={{ marginTop: "10px" }}
                  onClick={handleAddEvent}>
                    Add Event
                </button>
            </div>


          <Popup
            open={selectedEvent !== null}
            closeOnDocumentClick
            onClose={() => setSelectedEvent(null)}
          >
            {selectedEvent && (
              <div className="event-details-popup p-5 bg-rose-400 text-white m-1 rounded-lg
                lg:w-[60rem]">
                <h2 className="text-lg">{selectedEvent.title}</h2>
                <p>Start: {selectedEvent.start.toLocaleString()}</p>
                <p>End: {selectedEvent.end.toLocaleString()}</p>
                {/* Add other event details */}
                <button className="w-20 bg-white text-stone-800 hover:bg-stone-800 hover:text-white" onClick={() => handleDeleteEvent(selectedEvent)}>Delete</button>
              </div>
            )}
          </Popup>

          
            <Calendar
              className="calendar z-{10} text-white"
              localizer={localizer} 
              events={allEvents} 
              startAccessor="start" 
              endAccessor="end" 
              style={{ height: 500, margin: "1rem" }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              />
        </div>
    );
}

export default App;






