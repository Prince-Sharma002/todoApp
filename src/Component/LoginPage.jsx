import DatePicker from "react-datepicker";
import "./styles/login.scss"
import React, { useEffect, useState } from "react";
import { addDoc, collection , getDocs , query , deleteDoc , doc} from "firebase/firestore";
import {db , auth , getUserId } from "./firebase";
import {Link} from "react-router-dom";

const LoginPage = ({onLogin})=>{

  const [info , setInfo] = useState([]);
  const [rollNumber, setRollNumber] = useState("");
  const [dob, setDob] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);


  
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, `loginData`)
          )
        );

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
            dob: doc.data().dob.toDate(),
        }));
        console.log("data:", data);
        setInfo( data );
        } catch (error) {
        console.error('Error fetching data:', error);
        }
        };

      fetchDataFromFirestore();
  }, []);

  useEffect(() => {
    console.log("info : " , info);
  }, [info]);

  const handleSubmit = ()=>{
    const getDate = (date)=>{
      
        
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' }); 
      const year = date.getFullYear();
      
      const formattedDate = `${day} ${month} ${year}`;
      return formattedDate;
      
    }

    const matchingUser = info.find(
      (user) => user.rollNumber === rollNumber & getDate(user.dob) === getDate(dob) );

    if (matchingUser) {
      setLoggedIn(true);
      console.log("login successfuly")
      onLogin();
      
    } else {
      alert("Invalid credentials. Login failed.");
    }
  }

  
  return(
    <div className="login">
      <div className="">
        <h2 className="text-2xl"> STUDYPILOT </h2>
        <label>Roll Number</label>
        <input 
          className="bg-transparent border-b-2 border-black"
          type="text" 
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          />

        <label>Date Of Birth</label>
        <DatePicker 
          className="startDate text-left border-b-2 border-black z-50 addstyle bg-transparent text-black"
          placeholderText="DOB"
          selected={dob}
          onChange={(date) => setDob(date)}
          />

        <button
          className="addButton mx-auto w-1 text-center p-1 border-0 text-white bg-rose-600 hover:text-black hover:bg-stone-300  rounded ... "
          onClick={handleSubmit}
          >
          Login
            
        </button>


        
      </div>
    </div>

  )
}

export default LoginPage;