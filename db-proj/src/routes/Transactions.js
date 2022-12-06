import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

// const Transactions = () => {
//     return <h1>Transactions</h1>;
// };

function Transaction(){
    const [hist, setHist] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("logged") === null){
            alert("You are not logged in!")
            navigate("/")
        }
        if(localStorage.getItem("logged")){
            fetch('/history', {
                'method': 'POST',
                headers: {
                  'Content-Type': 'application/json'    // Send/Recieves JSON information
                },
                body:JSON.stringify({tid: localStorage.getItem('tid')} )   // Send JSON-ified username
              })
              .then(res => res.json())    // Recieve data from server and set response hook
              .then(res => setHist(res.logs))
              .catch(error => console.log('error', error))
        }
    }, []);

    return(
        <div>
            <h1>Transaction</h1>
                <table>
                    <thead>
                        <th> Transaction_ID </th>
                        <th> Token ID </th>
                        <th> Trade Type</th>
                        <th> Trade Time </th>
                        <th> Seller Addr </th>
                        <th> Buyer Addr </th>
                        <th> </th>
                    </thead>
                    <tbody>

                        

                </tbody>
                </table>
        </div>
    );
};

export default Transaction;