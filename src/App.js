import './App.css';
import { useState, useEffect } from 'react';
const fetch = require("node-fetch");

function App() {
  const [userQsn, setUsrQsn] = useState('');
  const [currTitle, setCurrTitle] = useState('');
  const [response, setResponse] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  // const [historyList, setHistoryList] = useState([]);

  useEffect(() => {

    if(currTitle.length === 0 && userQsn.length > 0 && 
      Object.keys(response).length > 0 ){
      console.log("In 1st if");
      console.log(response);
      setCurrTitle(userQsn);
    }
    if(currTitle.length > 0 && userQsn.length > 0 && 
      Object.keys(response).length > 0 ){
      console.log("In 2nd if");
      console.log("response : ",response);

      setChatHistory(chatHistory => ([...chatHistory, 
      {
        role: 'user',
        content: userQsn,
        title: currTitle
      },
      {
        role: response.role,
        content: response.content,
        title: currTitle 
      }]))
      
    }
  },[response, currTitle]);

  console.log("chatHistory >>", chatHistory);
  const uniqueTitle = Array.from(new Set(chatHistory.map((item) => item.title)));
  // setHistoryList(history);
  console.log("uniqueTitle", uniqueTitle);

  const currentChats = chatHistory.filter((chat) => {
    return chat.title === currTitle;
  });

  console.log("currentChats", currentChats);


  const getMessages = async () => {
    const options= {
      method:'POST',
      body: JSON.stringify({
        messages: userQsn
      }),
      headers:{
        'Content-Type':'application/json'
      }
    }
    try{
      const res = await fetch('http://localhost:8000/completions', options);
      const data = await res.json();
      setResponse(data.choices[0].message);
      
    }catch(error){
      console.error(error);
    }
  };
  const changeTitle = (title) => {
    console.log("changeTitle title`", title);
    setResponse({});
    setCurrTitle(title);
  }
  const handleNewchatButtonClick = (e) => {
    e.preventDefault();
    setCurrTitle('');
    setUsrQsn('');
    setResponse({});
  }
  return (
    <div className="app">
      <div className='sidebar'>
        <div className='history_container'>
          <div className='newChatBtn_container'>
          <button onClick={handleNewchatButtonClick} className='newchat_btn'>
            + New chat
          </button>
          </div>
          
          <div className='history_div'>
            {uniqueTitle.map((title, index) => {
              return(<p className='history' onClick={() => changeTitle(title)} key={index}>{title.length <= 20 ? title : title.substring(0,28)}</p>)
            })}
          </div>
        </div>
          <span className='user_info'>Abhiraj Kumar</span>
      </div>
      <div className='main'>
        <div className='top_div'>
          {/* <h1 className='heading'>Chit GPT</h1> */}
          {currentChats.map((chat, index) => {

            return(<div className={chat.role} key={index}>
              <p className='role'>{chat.role}</p>
              <p className='content'>{chat.content}</p>
            </div>)
          })}
        </div>
        <div className='bottom_div'>
          <div className='input_container'>
            <input type="text" placeholder='Send a message' value={userQsn} onChange={(e) => setUsrQsn(e.target.value)}/>
            <p className='submit_btn' onClick={getMessages}>⛳</p>
          </div>
          <p className='info'>Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT August 3 Version</p>
        </div>
      </div>
    </div>
  );
}

export default App;
