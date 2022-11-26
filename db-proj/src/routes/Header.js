import './css/Header.css'
import {Link, Outlet} from "react-router-dom";


const Header = () => {
    return (
        <>
            <div className="topnav">
                <Link to={`home`}>Home</Link>
                <Link to={`userInfo`}>User Info</Link>
                <Link to={`transactions`}>Transactions</Link>
                <Link to={`history`}>History</Link>
                <Link to={`transfer`}>Transfer</Link>
                <Link to={`/`}>Log Out</Link>
            </div>

            <Outlet/>
        </>
    )
}

export default Header;


