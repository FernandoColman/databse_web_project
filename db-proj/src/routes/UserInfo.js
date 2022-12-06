import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../routes/css/UserInfo.css'

function UserInfo(){

    const [contacts, setContacts] = useState([]);
    const [reload, setReload] = useState(true);
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
            .then((res) => {setContacts(res)})
            .catch(error => console.log('error', error))
        }
    }, [reload]);


    let levelInfo;
    if(localStorage.getItem("lvl") === '1')
        levelInfo = "Silver"
    else if (localStorage.getItem("lvl") === '2')
        levelInfo = "Gold"
    else if (localStorage.getItem("lvl") === '3')
        levelInfo = "Manager"

    return (
        <div className='main_div'>
            <h1>Hey {contacts.fname}!</h1>
            <h3><u>Client ID:</u> {localStorage.getItem('tid')}</h3>
            <h3><u>ETH Address:</u> {localStorage.getItem('addr')}</h3>
            <h3><u>Trading Level:</u> {levelInfo}</h3>


            <div className='info'>
                <div>
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
                    <input type="text" id="street" name="street" value={contacts.street} readOnly/> <br/>

                    <label htmlFor="city">City: </label> <br/>
                    <input type="text" id="city" name="city" value={contacts.city} readOnly/> <br/>

                    <label htmlFor="state">State: </label> <br/>
                    <input type="text" id="state" name="state" value={contacts.state} readOnly/> <br/>

                    <label htmlFor="zip">Zip Code: </label> <br/>
                    <input type="number" id="zip" name="zip" value={contacts.zip} readOnly/> <br/>




                    <br/>
                </fieldset>
            </div>
        </div>
        </div>
    );
}

export default UserInfo;