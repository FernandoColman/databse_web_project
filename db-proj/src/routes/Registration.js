import {useState} from 'react';
import {Box} from '@mui/system';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import './css/Login.css';
import { useNavigate } from "react-router-dom";

function Registration() {
    const navigate = useNavigate();
    const theme = createTheme({
        palette: {
            primary: {
                main: '#DCA563',
                contrastText: '#FFFFFF',
            },
            secondary: {
                main: '#DCA563',
                contrastText: '#FFFFFF',
            },
        },
    });

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [homephone, setHomephone] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [pswrd, setPswrd] = useState('');

    const addUser = (res) => {
        if(res.message === "Fail"){
            alert("Please fill up all the fields!")
        }
        else if (res.message === 'Success'){
          navigate("/")
        }
      }

    const register = () => {
        fetch('/registration', {
            'method': 'POST',
            headers: {
              'Content-Type': 'application/json'    // Send/Recieves JSON information
            },
            body:JSON.stringify({inputusername : username, inputpassword : pswrd, 
                                 ifirstname : firstname,ilastname : lastname,
                                 ihomephone : homephone, icellphone : cellphone, iemail : email
                                } )   // Send JSON-ified username
          })
          .then(res => res.json())    // Recieve data from server and set response hook
          .then(res => addUser(res))
          .catch(error => console.log('error', error))
    }

    return (
        <div className='register'>

            <Container align='center' maxWidth='lg'>
                <div><h1>Your Information</h1></div>
                <Box
                    component='span'
                    sx={{
                        bgcolor: 'white',
                        opacity: 0.9,
                        width: 700,
                        height: 700, 
                        color: '#DCA563',
                        borderColor: '#DCA563',
                        border: 20,
                        borderRadius: '44px',
                        display: 'grid',
                        alignItems: 'center',
                        pl:7.5,
                    }}
                >       
                    <TextField id='outlined-basic' label='Firstname' required
                                value={firstname} onChange={(e) => setFirstname(e.target.value)}/>

                    <TextField id='outlined-basic' label='Lastname' required
                                value={lastname} onChange={(e) => setLastname(e.target.value)}/>

                    <TextField id='outlined-basic' label='Home Contact' required
                                value={homephone} onChange={(e) => setHomephone(e.target.value)}/>

                    <TextField id='outlined-basic' label='Cellphone' required
                                value={cellphone} onChange={(e) => setCellphone(e.target.value)}/>

                    <TextField id='outlined-basic' label='Email' required
                                value={email} onChange={(e) => setEmail(e.target.value)}/> 

                    <TextField id='outlined-basic' label='Username' required
                                value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <TextField id='outlined-basic' label='Password' variant='outlined' required type='password'
                                value={pswrd} onChange={(e) => setPswrd(e.target.value)}/>
                    <ThemeProvider theme={theme}>
                        <Button color="primary" variant="contained" onClick={register}>Click here to register</Button>
                    </ThemeProvider>
                        
                </Box>
            </Container>
        </div>
);
}

export default Registration;