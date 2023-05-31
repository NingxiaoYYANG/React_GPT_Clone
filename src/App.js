import './App.css'
import { useState, useEffect } from 'react'

/*
what skills do I need to learn if I want to become a ${value}? Answer in tree data structure format without any extra words, if learning skill1 depending on skill2 then skill 2 should be parent node of skill 1.\n\
Answer in the following format:\n\
(Skill, SkillID, Parent, ParentID)|\n\
Here is an example to follow:\n\
(HTML, 1, None, 0)|\n\
(CSS, 2, None, 0)|\n\
(JavaScript, 3, None, 0)|\n\
(DOM Manipulation, 4, JavaScript, 3)|\n\
(CSS Frameworks, 5, CSS, 2)|\n\
(Bootstrap, 6, CSS Frameworks, 5)|\n\
(JavaScript Libraries, 7, JavaScript, 3)|\n\
(jQuery, 8, JavaScript Libraries, 7)|\n\
(React, 9, JavaScript Libraries, 7)|
(Redux, 10, React, 9)|\n\
(Angular, 11, JavaScript Libraries, 7)
*/

const App = () => {
  const [value, setValue] = useState("")
  const filtered_Input = `what skills do I need to learn if I want to become a ${value}? Answer in tree data structure format without any extra words, if learning skill1 depending on skill2 then skill 2 should be parent node of skill 1.\n\
  Answer in the following format:\n\
Skill, SkillID, Parent, ParentID| Here is an example to follow:\n\
HTML, 1, None, 0|CSS, 2, None, 0|JavaScript, 3, None, 0|DOM Manipulation, 4, JavaScript, 3|CSS Frameworks, 5, CSS, 2|Bootstrap, 6, CSS Frameworks, 5|JavaScript Libraries, 7, JavaScript, 3|jQuery, 8, JavaScript Libraries, 7|React, 9, JavaScript Libraries, 7|Redux, 10, React, 9|Angular, 11, JavaScript Libraries, 7`
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
          message: filtered_Input,
      })
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
      const MsgContent = data.choices[0].message.content


      // Split message into skillInfos
      const skillInfos = MsgContent.split("|")
      for (const InfoString of skillInfos) {
        const InfoArray = InfoString.split(", ")
        console.log(InfoArray)
        
      }

      // contract.addMonster()
    } catch (error) {
      console.log(error)
    }
  }

  // This will sets the current title of the chat, and append more to each chat
  useEffect(() => {
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
