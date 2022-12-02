import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Select from 'react-select';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Wallet(){

    const [fiat, setFiat] = useState(0);
    const [eth, setEth] = useState(0);
    const [addr, setAddr] = useState(null);
    const [reload, setReload] = useState(false);

    const [addAmt, setAddAmt] = useState(0);
    const [addOpt, setAddOpt] = useState(null);

    const navigate = useNavigate();

    const fillWallet = (res) =>{
        if(res.message !== "Fail"){
            setFiat(res.fiat);
            setEth(res.eth);
            setAddr(res.addr);
        }
    }

    const options =[
        {value: 'fiat', label: "Fiat"},
        {value: 'eth', label: "Etherium"}
    ]

    useEffect(() => {
        if(localStorage.getItem("logged") === null){
            alert("You are not logged in!")
            navigate("/")
        }
        if(localStorage.getItem("logged")){
            fetch('/wallet', {
                'method': 'POST',
                headers: {
                  'Content-Type': 'application/json'    // Send/Recieves JSON information
                },
                body:JSON.stringify({addr: localStorage.getItem('addr')} )   // Send JSON-ified username
              })
              .then(res => res.json())    // Recieve data from server and set response hook
              .then(res => fillWallet(res))
              .catch(error => console.log('error', error))
        }
    }, [reload]);

    const isNumeric = str => /^-?\d+$/.test(str);
    const updateAmt = () =>{
        if(isNumeric(addAmt) && addOpt !== null){
            alert(addOpt)
            // fetch('/walletUpdate', {
            //     'method': 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'    // Send/Recieves JSON information
            //     },
            //     body:JSON.stringify({addr: localStorage.getItem('addr'), type: addOpt, amt: addAmt})
            // })
        }
    }

    return (
        <div className='main_div'>
            <h1>Wallet</h1>
            <h3><u>ETH Address:</u> {addr}</h3>

            <div>
                <h3><u>Fiat Amount:</u> {fiat}</h3>
                <h3><u>Ethereum Amount:</u> {eth}</h3>
            </div>

            <div>
                <Select options={options} onChange={(e) => setAddOpt(e.value)} />
                <TextField id='outlined-basic' value={addAmt} onChange={(e) => setAddAmt(e.target.value)}/>
                <Button color="primary" variant="contained" onClick={updateAmt}>Add Currency</Button>    
            </div>
        </div>
    )

};

export default Wallet;