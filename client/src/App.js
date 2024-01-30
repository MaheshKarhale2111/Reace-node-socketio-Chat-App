import React from "react";
import { Route, Routes } from "react-router-dom";
import Join from "./components/JoinFolder/Join";
import Chat from "./components/ChatFolder/Chat";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/chat" element={<Chat/>} />
      </Routes>
    </div>
  );
}
