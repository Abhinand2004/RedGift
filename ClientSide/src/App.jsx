import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from './components/Login';
import { Register } from './components/Register';
import { HomePage } from './pages/HomePage';
import {ChatList} from './components/ChatList';
import {ChatPage} from './components/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Main Dashboard */}
        <Route path='/' element={<HomePage />} />

        {/* Chat Routes */}
        <Route path='/chats' element={<ChatList />} />
        <Route path='/chat/:id' element={<ChatPage />} />  {/* ✅ This line fixes your issue */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
