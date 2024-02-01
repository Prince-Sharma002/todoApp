import React, { useState, useEffect } from 'react';
import "./styles/notes.scss";
import { MdEdit , MdDelete  , MdSaveAlt , MdCancel } from "react-icons/md";

const Notes = () => {
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState([]);
  const [currTime , setCurrTime] = useState(['']);

  useEffect(() => {
    // storing of notes from local storage in notes when app first start
    const storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  // update local storage when notes changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleInputChange = (event) => {
    setNoteInput(event.target.value);
  };

  const addNote = () => {

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const date = String(currentDate.getDate()).padStart(2, '0');

    const currTime = `${date}-${month}-${year}`;
    
    if (noteInput.trim() !== '') {
      const newNote = {
        id: Date.now(),
        text: noteInput.trim(),
        time : currTime,
      };
      setNotes([newNote, ...notes]);
      setNoteInput('');
    }
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  const updateNote = (id, newText) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, text: newText } : note
    );
    setNotes(updatedNotes);
  };

  return (
    <div className="notes">
      <h1>Notes</h1>
      <input
        type="text"
        value={noteInput}
        onChange={handleInputChange}
        placeholder="Enter a note"
        className="gInput  placeholder:italic placeholder:text-white block bg-transparent border border-slate-300 py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm w-full md:w-1/2 lg:w-1/2  sm:text-center md:text-left mx-auto text-xl"
        
      />
      <button onClick={addNote}
        className="add-button text-center mx-auto mt-5 py-2 px-8 bg-rose-600 shadow-lg hover:bg-rose-600 text-white text-xl hover:bg-white hover:text-black  rounded ..."
        >Add</button>
      <div className='grid grid-cols-1 gap-2 md:grid-cols-4'>
        {notes.map((note) => (
      <NotesCard className="border-white"
        key={note.id}
        id={note.id}
        text={note.text}
        deleteNote={deleteNote}
        time={note.time}
        updateNote={updateNote} // Pass the updateNote function as prop
      />
    
    ))}
      </div>
    </div>
  );
};

const NotesCard = ({ id, text, deleteNote, time , updateNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(text);

  const handleDelete = () => {
    deleteNote(id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateNote(id, updatedText); // Update the note text
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Cancel the edit and revert to the original text
    setUpdatedText(text);
    setIsEditing(false);
  };

  return (
    <div className='notescard rounded-md border-white'>
      {isEditing ? (
        <div className="text-white border-white">
          {/* <input 
            
            className='NotesEdit'
            type='text'
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
          /> */}

          <textarea className="bg-transparent" name="text" rows="7" cols="10" wrap="soft"               value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)} ></textarea>
          
          <div className="flex text-white align-center justify-between items-center align-bottom">
            <p className="text-xs text-slate-500">{time}</p>
            <div className="flex">
              <button 
                className="bg-stone-900 p-1 text-white rounded-md mx-1"
                onClick={handleSave}> <MdSaveAlt /> </button>
              <button
                className="bg-stone-900 p-1 text-white rounded-md"
                onClick={handleCancel}> <MdCancel /> </button>
            </div>
          </div>

          
        </div>
      ) : (
        <div className="text-white border-white">
          <section> {text} </section>
          <div className="flex align-center justify-between items-center ">
            <p className="text-xs text-white"> {time} </p>
            <div className="flex">
              <button 
                className="bg-stone-900 p-1 text-white rounded-md mx-1"
                onClick={handleEdit}> <MdEdit /> </button>
              <button
                className="bg-stone-900 p-1 text-white rounded-md"
                onClick={handleDelete}> <MdDelete /> </button>
            </div>
          </div>    
        </div>
      
      )}
    </div>
  );
};


export default Notes;
