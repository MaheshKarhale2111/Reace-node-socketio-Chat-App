import React from "react";
import "./input.css";

export default function Input({message, setMessage,sendMessage}) {
  return (
    <div>
      <form className="form">
        <input
          type="text"
          className="input"
          placeholder="Type a message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        //   onKeyUp={(event) =>
        //     event.key === "Enter" ? sendMessage(event) : null
            
        //   }
        />
          <button className="sendButton" onClick={(event)=> sendMessage(event)}>Send</button>
      </form>
    </div>
  );
}
