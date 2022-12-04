import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../routes/css/UserInfo.css'

function UserInfo(){

    const [contacts, setContacts] = useState([]);
    const [reload, setReload] = useState(true);

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
                body:JSON.stringify({cid: localStorage.getItem('tid')} )   // Send JSON-ified username
            })
            .then(res => res.json())    // Recieve data from server and set response hook
            .then(res => setContacts(res))
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


    let goldLevel = false;
    if(localStorage.getItem("lvl") !== 1){
        goldLevel = true;
    }

    let clientID = localStorage.getItem("client_id");
    let ethAddr = localStorage.getItem("eth_addr");

    return (
        <div className='main_div'>
            <h1>Hey {contacts.fname}!</h1>
            <h3><u>Client ID:</u> {localStorage.getItem('tid')}</h3>
            <h3><u>ETH Address:</u> {localStorage.getItem('addr')}</h3>
            <h3><u>Trading Level:</u> {goldLevel ? "Gold" : "Silver"}</h3>


            <div className='contact_info'>
                <fieldset className="fields">
                    <br/>
                    <legend>Your Information</legend>
                    <label htmlFor="fname">First Name: </label> <br/>
                    <input type="text" id="fname" name="fname" value={contacts.fname} readOnly/> <br/>

                    <label htmlFor="lname">Last Name: </label> <br/>
                    <input type="text" id="lname" name="lname" value={contacts.lname} readOnly/> <br/>

                    <br/>

                    <label htmlFor="hnum">Home Phone: </label> <br/>
                    <input type="number" id="hnum" name="hnum" value={contacts.hnum} readOnly/> <br/>

                    <label htmlFor="cnum">Cell Number: </label> <br/>
                    <input type="number" id="cnum" name="cnum" value={contacts.cnum} readOnly/> <br/>

                    <br/>

                    <label htmlFor="eaddr">Email Address: </label> <br/>
                    <input type="email" id="eaddr" name="eaddr" value={contacts.eaddr} readOnly/> <br/>

                    <label htmlFor="street">Street Address: </label> <br/>
                    <input type="text" id="street" name="street" value={street} readOnly/> <br/>

                    <label htmlFor="city">City: </label> <br/>
                    <input type="text" id="city" name="city" value={city} readOnly/> <br/>

                    <label htmlFor="state">State: </label> <br/>
                    <input type="text" id="state" name="state" value={state} readOnly/> <br/>

                    <label htmlFor="zip">Zip Code: </label> <br/>
                    <input type="number" id="zip" name="zip" value={zip} readOnly/> <br/>




                    <br/>
                </fieldset>
            </div>

        </div>
    );
}

export default UserInfo;