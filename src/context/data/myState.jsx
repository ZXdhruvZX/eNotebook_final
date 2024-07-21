import React, { useEffect, useState } from "react";
import MyContext from "./myContext";

function MyState(props) {
  //* Loading state
  const [loading, setLoading] = useState(false);

  //* get Notes
  const [allNotes, setAllNotes] = useState([]);

  //* Get All Notes Functions
  const getAllNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const notesData = await res.json();
      console.log(notesData);
      setAllNotes(notesData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //* Add Note state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  //* Add note Function
  const addNote = async () => {
    const res = await fetch(`http://localhost:4000/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    //* response
    const noteData = await res.json();
    // console.log(noteData)
    getAllNotes();

    //* condition
    if (noteData.error) {
      toast.error(noteData.error);
      // console.log(noteData.error)
    } else {
      toast.success(noteData.success);
      // console.log(noteData.success)
    }

    //* after submit data all fields empty
    setTitle("");
    setDescription("");
    setTag("");
  };

  return (
    <MyContext.Provider value={{ allNotes, getAllNotes, loading ,title, setTitle, description, 
      setDescription, tag, setTag,
      addNote}}>
      {props.children}
    </MyContext.Provider>
  );
}

export default MyState;
