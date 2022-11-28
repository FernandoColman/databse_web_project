import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./css/Home.css";
//import data from "../Nft_Data.json";

function Home(){

    const [nfts, setNfts] = useState([]);
    const [reload, setReload] = useState(true); //reload page if there is ever a change in information on client side

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
        }
    }, [reload]);

    return(
        <div className="container">
            <table>
                <thead>
                    <th>  NFT </th>
                    <th>Volume</th>
                    <th>Floor_Price</th>
                </thead>
            </table>
            <tbody>
                {nfts.map((NFT_info) =>(
                    <tr>
                    <td>{NFT_info.NFT}</td>
                    <td>{NFT_info.Total_Volume}</td>
                    <td>{NFT_info.Floor_Price}</td>
                </tr>
                ))}    
            </tbody>
        </div>
    )
}

export default Home;