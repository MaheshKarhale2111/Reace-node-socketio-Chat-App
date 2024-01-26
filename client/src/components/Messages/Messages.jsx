import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import Message from '../Message/Message';
import './messages.css'

export default function Messages({messages, name}) {
    console.log("In messages.jsc", messages);
  return (
        <ScrollToBottom className='messages' >
            {messages.map((message,i)=> {
               return( <Message message = {message} key={i} name = {name} />)
            })}
        </ScrollToBottom>
  )
}
