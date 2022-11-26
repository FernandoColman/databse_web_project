import './Header.css'
import {Outlet, Link } from "react-router-dom";


const Header = () => {
    return (
        <>
            <div className="topnav">
                <Link to={`/`}>Home</Link>
                <Link to={`userInfo`}>User Info</Link>
                <Link to={`Transactions`}>Transactions</Link>
                <Link to={`History`}>History</Link>
                <Link to={`Transfer`}>Transfer</Link>


            </div>

            <Outlet/>
        </>
    )
}

export default Header;


