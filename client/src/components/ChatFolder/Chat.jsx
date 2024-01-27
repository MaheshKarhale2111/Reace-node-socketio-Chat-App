import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;

export default function Chat() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "https://chat-app-backend-0pf2.onrender.com/";
  const navigate = useNavigate();

  let location = useLocation();
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);
    socket.emit("join", { name, room },(response)=> {
      if(response === 'error') { 
        alert("username is already taken"); 
        navigate('/');
      }
    } ); // using ES6 syntax where key and object names are same

    return () => {
      socket.emit("onDisconnect");
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("This is message ", message);
      setMessages(messages => [...messages,message] );
    });

    socket.on("roomData", ({ users }) => {
      console.log(users);
      setUsers(users);
    });
  }, []);

  // function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();
    console.log("sendmessage is called with ", message);
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
      // third parameter is callback where we will clean the state
      // note that this callback is called in backend as callback()
    }
  };
  // console.log("reloaded");
  // console.log(messages); 

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room}/>
        <Messages messages={messages} name = {name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}
