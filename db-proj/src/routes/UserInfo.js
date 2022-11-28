import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

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
    // // CONTACT INFO
    // const fName = 'Fernando'
    // const lName = 'Colman'
    // const homePhone = '888-888-8888'
    // const cellPhone = '777-777-7777'
    // const email = 'fcolman@email.com'
    // const address = '123 Main Street, Houston, TX, 77494'

    // // TRADER INFO
    // const clientID = '123456'
    // const ethAddress = 'abcdef'
    // const goldLevel = false
    var goldLevel = false;
    if(localStorage.getItem("lvl") === 1){
        goldLevel = true;
    }

    return (
        <div className='main_div'>
            <h1>Hey {contacts.fname}!</h1>
            {/* <h3>Ethereum Address: {ethAddress}</h3> */}
            <h3>Trading Level: {goldLevel ? "Gold" : "Silver"}</h3>


            <div className='contact_info'>
                <h2>Your Information: </h2>
                <p>Name: {contacts.fname + " " + contacts.lname}</p>
                <p>Home Phone: {contacts.hnum}</p>
                <p>Cell Phone: {contacts.cnum}</p>
                <p>Email : {contacts.eaddr}</p>
                {/* <p>Address: {address}</p> */}
            </div>

        </div>
    );
}

export default UserInfo;