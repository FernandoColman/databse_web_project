import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../routes/css/UserInfo.css'

function UserInfo(){

    const [contacts, setContacts] = useState([]);
    const [reload, setReload] = useState(true);
    const [nfts, setNfts] = useState([]);
    const [street, setStreet] = useState([]);
    const [city, setCity] = useState([]);
    const [state, setState] = useState([]);
    const [zip, setZip] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("logged") === null){

            alert("You are not logged in!")
            navigate("/")
        }
        if(localStorage.getItem("logged")){
            fetch('/userinfo', {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'    // Send/Recieves JSON information
                },
                body:JSON.stringify({cid: localStorage.getItem('tid'),addr:localStorage.getItem('addr')} )   // Send JSON-ified username
            })
            .then(res => res.json())    // Recieve data from server and set response hook
            .then((res) => {setContacts(res.res1); setNfts(res.res2)})
            .catch(error => console.log('error', error))
        }
    }, [reload]);


    // const updateAddress = () => {
    //     fetch('/userInfoUpdate', {
    //         'method': 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'    // Send/Recieves JSON information
    //         },
    //         body: JSON.stringify({cid: localStorage.getItem('tid')} )   // Send JSON-ified username
    //     })
    //         .then(res => res.json())    // Recieve data from server and set response hook
    //         .then(res => setAddress(res))
    //         .catch(error => console.log('error', error))
    // };

    const sellnft = (id) =>{
        console.log(id.currentTarget.id)
        fetch('/usersellnft',{
            'method' : 'POST',
            headers: {
                'Content-Type': 'application/json'    // Send/Recieves JSON information
            },
            body: JSON.stringify({cid: localStorage.getItem('tid'),nftid:id.currentTarget.id} )   // Send JSON-ified username
            })
            .then(res => res.json())    // Recieve data from server and set response hook
            .then(res => addnft(res))
            .catch(error => console.log('error', error))
    };

    const addnft = (res) =>{
        if(res.message === "Success"){
            alert("NFT up for sale!")
            navigate("/home")
        }
    }

    let levelInfo;
    if(localStorage.getItem("lvl") === '1')
        levelInfo = "Silver"
    else if (localStorage.getItem("lvl") === '2')
        levelInfo = "Gold"
    else if (localStorage.getItem("lvl") === '3')
        levelInfo = "Manager"


    return (
        <div className='main_div'>
            <h1>Hey {contacts[0]}!</h1>
            <h3><u>Client ID:</u> {localStorage.getItem('tid')}</h3>
            <h3><u>ETH Address:</u> {localStorage.getItem('addr')}</h3>
            <h3><u>Trading Level:</u>{levelInfo}</h3>


            <div className='info'>
                <div>
                <fieldset className="fields">
                    <br/>
                    <legend>Your Information</legend>
                    <label htmlFor="fname">First Name: </label> <br/>
                    <input type="text" id="fname" name="fname" value={contacts[0]} readOnly/> <br/>

                    <label htmlFor="lname">Last Name: </label> <br/>
                    <input type="text" id="lname" name="lname" value={contacts[1]} readOnly/> <br/>

                    <br/>

                    <label htmlFor="hnum">Home Phone: </label> <br/>
                    <input type="number" id="hnum" name="hnum" value={contacts[2]} readOnly/> <br/>

                    <label htmlFor="cnum">Cell Number: </label> <br/>
                    <input type="number" id="cnum" name="cnum" value={contacts[3]} readOnly/> <br/>

                    <br/>

                    <label htmlFor="eaddr">Email Address: </label> <br/>
                    <input type="email" id="eaddr" name="eaddr" value={contacts[4]} readOnly/> <br/>

                    <label htmlFor="street">Street Address: </label> <br/>
                    <input type="text" id="street" name="street" value={contacts[5]} readOnly/> <br/>

                    <label htmlFor="city">City: </label> <br/>
                    <input type="text" id="city" name="city" value={contacts[6]} readOnly/> <br/>

                    <label htmlFor="state">State: </label> <br/>
                    <input type="text" id="state" name="state" value={contacts[7]} readOnly/> <br/>

                    <label htmlFor="zip">Zip Code: </label> <br/>
                    <input type="number" id="zip" name="zip" value={contacts[8]} readOnly/> <br/>




                    <br/>
                </fieldset>
            </div>
            <div>
            <table>
                <thead>
                    <th>NFT</th>
                    <th>Name</th>
                    <th>Floor_Price</th>
                </thead>            
                <tbody>
                    {nfts.map((NFT_info) =>(
                        <tr>
                        <td>{NFT_info.Token_ID}</td>
                        <td>{NFT_info.Name}</td>
                        <td>{NFT_info.ETH_Price}</td>
                        <td><button id={NFT_info.Token_ID} onClick={sellnft}>Click to sell</button></td>
                    </tr>
                    ))}    
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
}

export default UserInfo;