import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Header from './routes/Header';
import Home from './routes/Home';
import UserInfo from './routes/UserInfo';
import History from "./routes/History";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Wallet from './routes/Wallet';
import Registration from './routes/Registration';
import Transfer from './routes/Transfer';




export default function App() {
    return (
        <div>
            <BrowserRouter>
                <Header />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/registration" element={<Registration />}/>
                        <Route path="/home" element={<Home />} />
                        <Route path="/userinfo" element={<UserInfo />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/transfer" element={<Transfer />} />
                    </Routes>

            </BrowserRouter>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


