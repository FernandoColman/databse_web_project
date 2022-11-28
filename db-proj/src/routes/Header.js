import './css/Header.css'
import {Link, useNavigate} from "react-router-dom";


function Header(){
    useNavigate();
    return (
        <div>
            <div className="topnav">
                <Link to="/home">Home</Link>
                <Link to="/userinfo">User Info</Link>
                <Link to="/transactions">Transactions</Link>
                <Link to="/history">History</Link>
                <Link to="/transfer">Transfer</Link>
                <Link to="/logout">Logout</Link>
            </div>
        </div>
    )
}

export default Header;


