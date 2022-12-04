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
                body:JSON.stringify({cid: localStorage.getItem('tid')} )   // Send JSON-ified username
            })
            .then(res => res.json())    // Recieve data from server and set response hook
            .then(res => setContacts(res))
            .catch(error => console.log('error', error))
        }
    }, [reload]);


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
                <fieldset>
                    <br/>
                    <legend>Your Information</legend>
                    <label htmlFor="fname">First Name: </label> <br/>
                    <input type="text" id="fname" name="fname" value={contacts.fname}/> <br/>

                    <label htmlFor="lname">Last Name: </label> <br/>
                    <input type="text" id="lname" name="lname" value={contacts.lname}/> <br/>

                    <br/>

                    <label htmlFor="hnum">Home Phone: </label> <br/>
                    <input type="number" id="hnum" name="hnum" value={contacts.hnum}/> <br/>

                    <label htmlFor="cnum">Cell Number: </label> <br/>
                    <input type="number" id="cnum" name="cnum" value={contacts.cnum}/> <br/>

                    <br/>

                    <label htmlFor="eaddr">Email Address: </label> <br/>
                    <input type="email" id="eaddr" name="eaddr" value={contacts.eaddr}/> <br/>

                    <label htmlFor="paddr">Physical Address: </label> <br/>
                    <input type="text" id="paddr" name="paddr" value={contacts.paddr}/> <br/>

                    <br/>

                    <input class="subbtn" type="submit" value="Submit"/>

                    <br/>
                </fieldset>
            </div>

        </div>
    );
}

export default UserInfo;