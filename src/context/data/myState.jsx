import React, { useEffect, useState } from 'react'
import MyContext from './myContext';


function MyState(props) {

  //* Loading state
  const [loading, setLoading] = useState(false);

  //* get Notes
  const [allNotes, setAllNotes] = useState([]);
  
  //* Get All Notes Functions
    const getAllNotes = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:4000/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
        const notesData = await res.json();
        console.log(notesData)
        setAllNotes(notesData);
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

  return (
    <MyContext.Provider value={{ allNotes, getAllNotes,loading }} >
      {props.children}
    </MyContext.Provider>
  )
}

export default MyState