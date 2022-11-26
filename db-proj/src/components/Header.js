import './Header.css'

const Header = () => {
    return (

        <div className="topnav">
            <a className="active" href="#home">Home</a>
            <a href="#UserInfo">User Info</a>
            <a href="#Transactions">Transactions</a>
            <a href="#History">History</a>
            <a href="#Transfers">Transfers</a>
        </div>

    )
}

export default Header


