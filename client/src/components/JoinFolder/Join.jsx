import { React, useState } from "react";
import { Link } from "react-router-dom";
import './Join.css'

export default function Join() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input type="text" placeholder="Name" className="joinInput" onChange={(event)=> setName(event.target.value)} />
          <input type="text" placeholder="Room" className="joinInput mt-20" onChange={(event)=> setRoom(event.target.value)} />

          <Link onClick={event =>(!name || !room ? event.preventDefault() : null)} to={`/chat?name=${name}&room=${room}`}>
          <button className="button mt-20" type="submit">Sign In</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
