import React, {useState} from "react";
import "./css/Home.css";
import data from "../Nft_Data.json";

const Home = () => {

    const [contacts, setContacts] = useState(data);
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
                {contacts.map((NFT_info) =>(
                    <tr>
                    <td>{NFT_info.NFT}</td>
                    <td>{NFT_info.Total_Volume}</td>
                    <td>{NFT_info.Floor_Price}</td>
                </tr>
                ))}    
            </tbody>
        </div>
    )
};

export default Home;