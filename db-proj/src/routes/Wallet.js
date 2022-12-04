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
    const [addAddr, setAddAddr] = useState('');

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
            alert("You are not logged in!");
            navigate("/");
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
              .catch(error => console.log('error', error));
        }
    }, [reload]);

    const refreshWallet = (res) => {
        alert(res.message);
        setReload(!reload);
    }

    const isNumeric = str => /^-?\d+$/.test(str);
    const isAlphaNumeric = str => /^[a-z0-9]+$/gi.test(str);
    const updateAmt = () =>{
        if(isNumeric(addAmt) && addOpt !== null && isAlphaNumeric(addAddr)){
            //alert(addOpt)
            fetch('/walletUpdate', {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'    // Send/Recieves JSON information
                },
                body:JSON.stringify({tid: localStorage.getItem('tid'), addr: localStorage.getItem('addr'), type: addOpt, amt: addAmt, addAddr: addAddr})
            })
            .then(res => res.json())
            .then(res => refreshWallet(res))
        }
        else{
            alert("Please select a Transfer type, enter a valid transfer amount, and enter the corresponding address");
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
                <div>Please enter the amount you would like to transfer</div>
                <TextField id='outlined-basic' value={addAmt} onChange={(e) => setAddAmt(e.target.value)}/>
                <div>Please enter your Ethereum address if you are transfering Ethereum or Bank Accout Number if you are transfering fiat currency</div>
                <TextField id='outlined-basic' value={addAddr} onChange={(e) => setAddAddr(e.target.value)} />
                <div>
                    <Button color="primary" variant="contained" onClick={updateAmt}>Transfer</Button>    
                </div>
            </div>
        </div>
    )

};

export default Wallet;