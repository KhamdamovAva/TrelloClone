import { useState } from 'react';
import './App.css';
import Main from './components/Main';
import { BoardContext } from './context/BoardContext';

function App() {
  const boardData = {
    active: 0,
    boards: [
      {
        name: 'My Trello Board',
        bgcolor: '#2d5a79',
        list: [
          { id: "1", title: "To do", items: [{ id: "cdrFt", title: "Project  1" }] },
          { id: "2", title: "To do", items: [{ id: "cdrFv", title: "Project  2" }] },
          { id: "3", title: "To do", items: [{ id: "cdrFb", title: "Project  3" }] }
        ]
      }
    ]
  }
  const [allboard, setAllBoard] = useState(boardData);

  return (
    <>
      <BoardContext.Provider value={{ allboard, setAllBoard }}>
        <div className='content flex h-[100vh]'>
          <Main></Main>
        </div>
      </BoardContext.Provider>
    </>
  );
}

export default App;
