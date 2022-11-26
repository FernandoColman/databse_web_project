

const UserInfo = () => {

    // CONTACT INFO
    const fName = 'Fernando'
    const lName = 'Colman'
    const homePhone = '888-888-8888'
    const cellPhone = '777-777-7777'
    const email = 'fcolman@email.com'
    const address = '123 Main Street, Houston, TX, 77494'

    // TRADER INFO
    const clientID = '123456'
    const ethAddress = 'abcdef'
    const goldLevel = false
    return (
        <div className='main_div'>
            <h1>Hey {fName} !</h1>
            <h3>Client ID: {clientID}</h3>
            <h3>Ethereum Address: {ethAddress}</h3>
            <h3>Trading Level: {goldLevel ? "Gold" : "Silver"}</h3>


            <div className='contact_info'>
                <h2>Your Information: </h2>
                <p>Name: {fName + " " + lName}</p>
                <p>Home Phone: {homePhone}</p>
                <p>Cell Phone: {cellPhone}</p>
                <p>Email : {email}</p>
                <p>Address: {address}</p>
            </div>

        </div>
    );
};

export default UserInfo;