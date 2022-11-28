import {useNavigate} from 'react-router-dom'
import {useEffect} from "react";

function Logout() {

    const navigate = useNavigate()

    useEffect(() => {
        localStorage.clear()
        navigate('/')
    });

    return (
        <div className='home'>
                <div className='wrapper'>
                    <h1>You are signed out</h1>
                </div>
        </div>
    )
}

export default Logout