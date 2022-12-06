import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Select from 'react-select';
import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'

function Transfer() {

    const [fiat_bal, setFiat] = useState(0);
    const [eth_bal, setEth] = useState(0);
    const [addr, setAddr] = useState(null);
    const [addAmt1, setAddAmt1] = useState(0);
    const [addOpt1, setAddOpt1] = useState(null);
    const [addOpt2, setAddOpt2] = useState(null);
    const [addAmt2, setAddAmt2] = useState(0);
    const [reload, setReload] = useState(false);
    const [ethcomm,setethcomm]= useState(0);
    const [ethprice,setethprice]= useState(0);
    const [nftcomm,setnftcomm]= useState(0);
    const [nftprice,setnftprice]= useState(0);

    const options =[
        {value: 'fiat', label: "Fiat"},
        {value: 'eth', label: "Etherium"}
    ]

    const navigate = useNavigate()
    const fillWallet = (res) =>{
        if(res.message !== "Fail"){
            setFiat(res.fiat);
            setEth(res.eth);
            setAddr(res.addr);
        }
    }

    let ep, np, nc, ec;
    const setData = (res) =>{
        // console.log(localStorage.getItem('cethrate'))
        localStorage.setItem('seller_addr',res.eth_addr);
        //console.log("Seller set "+localStorage.getItem('seller_addr'));
        ep = res.price;
        np = ep*localStorage.getItem('cethrate');
        if(localStorage.getItem('lvl') === 1){
            nc=(0.2*np).toFixed(2);
            ec=(0.2*ep).toFixed(2);
            
        }
        else {
            nc=(0.1*np).toFixed(2);
            ec=(0.1*ep).toFixed(2);
        }
        setethprice(ep); setnftprice(np);setethcomm(ec);setnftcomm(nc);
        
    }
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

              fetch('/userbuynft',{
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'    // Send/Recieves JSON information
                  },
                  body:JSON.stringify({nftid: localStorage.getItem('nfttobuy')} )   // Send JSON-ified username
              })
              .then(res => res.json())    // Recieve data from server and set response hook
              .then(res => setData(res))
              .catch(error => console.log('error', error));                          
        }
    }, [reload]);

    let amt1=0,amt2=0;
    const amt_change = (event) =>{       
        console.log(event) 
        if(event === "fiat"){
            amt1=nftprice;
        }
        else {
            amt1=ethprice;            
        }
        setAddAmt1(amt1);
    }
    const comm_change = (event) =>{
        if(event === "fiat"){
            amt2=nftcomm;
        }
        else{ 
            amt2=ethcomm;
        }
        setAddAmt2(amt2);
    }


    let enough_balance_fiat=true;
    let enough_balance_eth=true;
    let total_fiat=0,total_eth=0;

    const nftbought = () =>{
        console.log("amount"+ addAmt1+ " "+ addAmt2)
        if(addOpt1 === "fiat" && addOpt2 === "fiat"){
            total_fiat=Number(addAmt1)+Number(addAmt2);
            console.log("inside fiat fiat "+total_fiat);
        }
        else if(addOpt1 === "eth" && addOpt2 === "eth"){
            total_eth=Number(addAmt1)+Number(addAmt2);
            console.log("inside eth fiat");
        }
        else if(addOpt1 === "fiat" && addOpt2 === "eth"){
            total_eth=Number(addAmt2); total_fiat=Number(addAmt1);
            console.log("inside fiat eth ");
        }
        else if(addOpt1 === "eth" && addOpt2 === "fiat"){
            total_eth=Number(addAmt1); total_fiat=Number(addAmt2);
            console.log("inside eth fiat ");
        }
        if(total_fiat>fiat_bal){
            enough_balance_fiat=false;
        }
        if(total_eth>eth_bal){
            enough_balance_eth=false;
        }
        console.log(enough_balance_eth +" "+enough_balance_fiat);
        if(enough_balance_eth === false){
            alert("You dont have enough eth amount");
            setReload(!reload);
        }
        else if(enough_balance_fiat === false){
            alert("You dont have enough fiat amount");
            setReload(!reload);
        }        
        else if(enough_balance_eth === true && enough_balance_fiat === true){
            fetch('/nfttrade',{
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'    // Send/Recieves JSON information
                  },
                  body:JSON.stringify({ cid: localStorage.getItem('tid'),
                                        addr: localStorage.getItem('addr'),
                                        seller_addr: localStorage.getItem('seller_addr'),
                                        trade_amt:addAmt1,trade_type:addOpt1,
                                        comm_amt:addAmt2, comm_type:addOpt2,
                                        nftid: localStorage.getItem('nfttobuy')
                                    } )   // Send JSON-ified username
              })
              .then(res => res.json())    // Recieve data from server and set response hook
              .then(res => addNFTtouser(res))
              .catch(error => console.log('error', error));
        }
    }

    const addNFTtouser = (res) =>{
        if(res.message === "Success"){
            alert("You have successfully bought the NFT!!");
            navigate('/wallet');
        }
        else{
            alert("There was some problem, please try again!");
            navigate('/home');
        }
    }
        
    
    return (
        <div className='home'>
                <div className='wrapper'>
                    <h1>Buying NFT {localStorage.getItem('nfttobuy')}</h1>
                    <p>Current Ethereum conversion rate : {localStorage.getItem('cethrate')}</p>
                    <div>
                        <h3><u>Fiat Amount:</u> {fiat_bal}</h3>
                        <h3><u>Ethereum Amount:</u> {eth_bal}</h3>
                    </div>
                    <div>
                        <p>Total ammount to be paid : {ethprice} ETH or {nftprice} USD</p>
                        <p>Total commission to be paid : {ethcomm} ETH or {nftcomm} USD</p>
                    </div>
                    <div className="select">
                        <p>Select trade currency
                        <Select class="select" options={options} onChange={(e)=> {setAddOpt1(e.value); amt_change(e.value)}} /></p>
                        <p>Please Enter Amount to Transfer: 
                        <p id='outlined-basic'/>{addAmt1}</p>
                        <br/>
                        <p>Select commission currency
                            <Select class="select" options={options} onChange={(e)=>{ setAddOpt2(e.value);comm_change(e.value)}} /></p>
                        <p>Please Enter Amount to Transfer:
                        <p id='outlined-basic'/>{addAmt2}</p>
                        <br/>
                        <button onClick={nftbought}>Click to update total amount to be paid</button>
                    </div>
                </div>
        </div>
    );
}

export default Transfer;