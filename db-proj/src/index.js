import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Header from './routes/Header'
import Home from './routes/Home';
import UserInfo from './routes/UserInfo'
import Transactions from "./routes/Transactions";
import History from "./routes/History";
import Transfer from "./routes/Transfer.js"


import reportWebVitals from './reportWebVitals';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route index element={<Home />} />
                    <Route path="userInfo" element={<UserInfo />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="history" element={<History />} />
                    <Route path="transfer" element={<Transfer />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


reportWebVitals();
