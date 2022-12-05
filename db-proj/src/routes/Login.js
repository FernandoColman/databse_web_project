import {useState} from 'react';
import {Box} from '@mui/system';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {createTheme, ThemeProvider} from '@mui/material/styles';
//import './css/Login.css';
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    localStorage.clear();

    const [username, setUsername] = useState('');
    const [pswrd, setPswrd] = useState('');

    const authUser = (res) => {
      if(res.message === "Fail"){
          alert("Please try again or create a new account!")
      }
      else if (res.message === 'Success'){
        localStorage.setItem('logged', 't')
        localStorage.setItem('tid', res.tid)
        localStorage.setItem('lvl', res.lvl)
        localStorage.setItem('addr', res.addr)
        navigate("/home")
      }
    }

    const submit = () => {
        fetch('/login', {
          'method': 'POST',
          headers: {
            'Content-Type': 'application/json'    // Send/Recieves JSON information
          },
          body:JSON.stringify({inputusername : username, inputpassword : pswrd} )   // Send JSON-ified username
        })
        .then(res => res.json())    // Recieve data from server and set response hook
        .then(res => authUser(res))
        .catch(error => console.log('error', error))
    };

    const register = () =>{
        navigate('/registration')
    };

    return (
            <div className='login'>
                <fieldset>
                    <br/>
                    <label htmlFor="user">Username: </label> <br/>
                    <input type="text" id="user" name="user" value={username} onChange={(e) => setUsername(e.target.value)}/> <br/>

                    <label htmlFor="pass">Password: </label> <br/>
                    <input type="password" id="pass" name="pass" value={pswrd} onChange={(e) => setPswrd(e.target.value)}/> <br/>

                    <br/>

                    <input className="subbtn" type="submit" value="Login" onClick={submit}/>
                    <input className="subbtn" type="submit" value="Register" onClick={register}/>

                    <br/>
                </fieldset>
            </div>            

    );
}

export default Login;