import './App.css'
import { useState, useEffect } from 'react'

/*
What are the different order lists for frontend development skills based on categories?
*/

const App = () => {
  const [value, setValue] = useState("")
  const [message, setMessage] = useState(null)
  const [prevChats, setPrevChats] = useState([])
  const [curTitle, setCurTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: 'POST',
      headers: {
          "Content-type": 'application/json',
      },
      body: JSON.stringify ({
          message: value,
      })
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
      // contract.addMonster()
    } catch (error) {
      console.log(error)
    }
  }

  // This will sets the current title of the chat, and append more to each chat
  useEffect(() => {
    console.log(curTitle, value, message)
    if (!curTitle && value && message) {
      setCurTitle(value)
    }
    if (curTitle && value && message) {
      // Append two new elements to prechats
      setPrevChats(previousChats => (
        [...previousChats, 
          {
            title: curTitle,
            role: "user",
            content: value
          }, 
          {
            title: curTitle,
            role: message.role,
            content: message.content 
          }
        ]
      ))
    }
  }, [message, curTitle])

  const curChat = prevChats.filter(prevChat => prevChat.title === curTitle)
  // get every title from previous chats
  const uniqueTitles = Array.from(new Set(prevChats.map(prevChat => prevChat.title)))
  
  console.log(message)
  return (
    <div className="app">
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitle, idx) => <li key={idx} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Justin</p>
        </nav>
      </section>
      <section className='main'>
        {!curTitle && <h1>DioGPT</h1>}
        <ul className='feed'>
          {curChat?.map((chatMsg, idx) => <li key={idx}>
            <p className='role'>{chatMsg.role}</p>
            <p>{chatMsg.content}</p>
          </li>)}
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id='submit' onClick={getMessages}>➢</div>
          </div>
          <p className='info'>
            DioGPT 26/05/2023 version. 
            Stand power! The World!!
            Wryyyyyyy!!!!!!!!!!
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
