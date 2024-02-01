import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, deleteDoc , doc } from "firebase/firestore";
import { db } from "./firebase";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

import "./styles/lostpanel.scss";

const LostPanel = () => {
  const [newele, setNewele] = useState({ title: "", date: new Date(), time: "10:00" });
  const [passId, setPassId] = useState("");
  const [lostItems, setLostItems] = useState([]);

  const passCodes = ["zxc", "bnm"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lostdata"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLostItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddlost = async () => {
    if (!newele.title || !newele.date || !newele.time || !passId) {
      alert("Please provide all information");
      return;
    }

    if (!passCodes.includes(passId)) {
      alert("Wrong Pass ID");
      return;
    }

    try {
      await addDoc(collection(db, `lostdata`), {
        title: newele.title,
        date: newele.date.toISOString(),
        time: newele.time,
      });

      setLostItems([...lostItems, newele]);
      setNewele({ title: "", date: new Date(), time: "10:00" });
      setPassId("");
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "lostdata", id));
      const updatedItems = lostItems.filter((item) => item.id !== id);
      setLostItems(updatedItems);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="lostPanel px-2 text-white">
      <h1> LostPanel </h1>
      <div className="inputDiv bg-transparent">
        <input
          className="addstyle bg-transparent text-white border-b-2 border-white"
          placeholder="Add Lost item details"
          value={newele.title}
          onChange={(e) => setNewele({ ...newele, title: e.target.value })}
        />
        <DatePicker
          className="startDate z-50 addstyle border-2 border-white bg-transparent text-white"
          placeholderText="lost date"
          selected={newele.date}
          onChange={(date) => setNewele({ ...newele, date })}
        />

        <TimePicker
          className="addstyle bg-transparent text-white"
          value={newele.time}
          onChange={(time) => setNewele({ ...newele, time })}
        />

        <input className="addstyle bg-transparent text-back border-b-2 border-white" type="text" placeholder="Password" onChange={(e) => setPassId(e.target.value)} />

        <button className="addButton text-center p-1 border-0 text-white bg-rose-600 hover:text-black hover:bg-white  rounded ... " onClick={handleAddlost}>Add</button>

      </div>
      
      <h2 className="GroceryList text-white tracking-wider text-2xl mb-1 font- mt-10">
        Lost Item List
      </h2>
      <div className="lostItems ItemDiv  border-4 rounded-lg  p-3 md:w-3/4 mx-auto mb-40">
        {lostItems.map((item) => (
          <div key={item.id} className="gItems mx-1 md:w-3/2 mb-2 flex justify-between">
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <p className="text-sm bg-stone-900 text-white p-1 me-1">{new Date(item.date).toLocaleDateString()}</p>
                <p className="text-sm bg-rose-600 text-white p-1">{item.time}</p>
              </div>
              <p>{item.title} </p>
            </div>
            <button className="delete-button bg-white text-black" onClick={() => handleDelete(item.id)}>Del</button>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default LostPanel;



// import React, { useEffect, useState } from "react";
// import { addDoc, collection , getDocs , query , deleteDoc , doc} from "firebase/firestore";
// import {db , auth , getUserId } from "./firebase";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import TimePicker from 'react-time-picker';
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';

// const LostPanel = ()=>{

//   const [lostDate , setLostDate ] = useState('');
//   const [value, onChange] = useState('10:00');

//   const [newele , setNewele] = useState([{ title: "" , date : "" , time : ""  }]);
//   const [allele, setAllele] = useState([]);
  
//   const [passId , setPassId ] = useState("qwe");
//   const passCodes = [ "zxc" , "bnm" ];
//   const passName = { "zxc" : "Govind Gupta" , "bnm" : "Avdhesh Tyagi" };  
  
//   // useEffect(() => {

//   //   }
//   // }, []);

//   const handleAddlost = ()=>{

//     let title = newele.title;
//     let date = newele.date;
//     let time = newele.time;

//     if( passCodes.includes(passId) ){


//     addDoc( collection(db, `lostdata`),{
//       title,
//       date,
//       time,
//     });
//     setAllele(...allele, newele);        
//     }
//     else {
//       alert("Wrong Pass ID")
//     } 
//   }

  
//   return(
//     <div className="lostPanel">
//       <h1> LostPanel </h1>
//       <input
//         placeholder="Add Lost item details"
//         value={newele.title}
//         onChange={(e) => setNewele({ ...newele, title: e.target.value })}
//         />
//       <DatePicker 
//         className="startDate z-50 addstyle"
//         placeholderText="lost date"
//         selected={newele.date}
//         onChange={(date) => setNewele({ ...newele, date })}
//         />
      
//       <TimePicker        
//         selected={newele.time}
//         onChange={(time) => setNewele({ ...newele, time })}
//       />

//       <input className=" addstyle" type="text" placeholder="Password" onChange={(e) => setPassId(e.target.value)} />

//       <button onClick={handleAddlost} > Add  </button>
//     </div>
//   )
// }

// export default LostPanel;