import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./css/Home.css";
//import data from "../Nft_Data.json";

function Home(){

    const [nfts, setNfts] = useState([]);
    const [reload, setReload] = useState(true); //reload page if there is ever a change in information on client side
    const [eth_rate, setEthrate] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("logged") === null){
            alert("You are not logged in!")
            navigate("/")
        }
        if(localStorage.getItem("logged")){
            fetch('/home', {
                'method': 'POST',
                headers: {
                  'Content-Type': 'application/json'    // Send/Recieves JSON information
                },
                body:JSON.stringify({cid: localStorage.getItem('tid')} )   // Send JSON-ified username
              })
              .then(res => res.json())    // Recieve data from server and set response hook
              .then(res => setNfts(res))
              .catch(error => console.log('error', error))

            fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
            .then((res)=>res.json())
            .then((data)=> {setEthrate(data.USD)})
            //setEthrate(JSON.stringify(JSON.parse(body),null,4)))
            .catch((err)=>{
                console.log(err.message);
            })
        }
    }, [reload]);

    const buynft = (buttonid) =>{
        console.log(buttonid.currentTarget.id)
        fetch('/userbuynft', {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'    // Send/Recieves JSON information
              },
              body:JSON.stringify({nftid : buttonid.currentTarget.id, cid: localStorage.getItem('tid')} )   // Send JSON-ified username
            })
            .then(res => res.json())    // Recieve data from server and set response hook
            .then(res => addnft(res))
            .catch(error => console.log('error', error))
    }

    const addnft = (res) =>{
        if(res.message === "Success"){
            navigate("/transfer")
        }
    }

    return(
        <div className="container">
            <h2>Current ETH Rate in USD: ${eth_rate}</h2>
            <table>
                <thead>
                    <th>NFT Number</th>
                    <th>NFT_Name</th>
                    <th>NFT</th>
                    <th>Name</th>
                    <th>Floor_Price</th>
                </thead>            
                <tbody>
                    {nfts.map((NFT_info) =>(
                        <tr>
                        <td >{NFT_info.Token_ID}</td>
                        <td >{NFT_info.Name}</td>
                        <td >{NFT_info.ETH_Price}</td>
                        <td ><button id={NFT_info.Token_ID} onClick={buynft}>Click to buy</button></td>
                    </tr>
                    ))}    
                </tbody>
            </table>
        </div>
    )
}

export default Home;