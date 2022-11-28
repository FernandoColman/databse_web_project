import {useState} from 'react';
import {Box} from '@mui/system';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import './css/Login.css';
import { useNavigate } from "react-router-dom";

function Login() {
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
        navigate("home")
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
    }

    return (
        <div>

            <div className='wrapper'>
                <div className='login'>

                    <Container align='center' maxWidth='lg'>
                        <Box
                            component='span'
                            sx={{
                                bgcolor: '#FFFFFF',
                                opacity: 0.9,
                                width: 600,
                                height: 400,
                                color: '#DCA563',
                                borderColor: '#DCA563',
                                border: 20,
                                borderRadius: '44px',
                                display: 'grid',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pt: 7.5,
                                pb: 7.5,
                            }}
                        >
                            <h2>Sign-In!</h2>
                            <TextField id='outlined-basic' label='Username' variant='outlined'
                                       value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <TextField id='password' label='Password' variant='outlined' type='password'
                                       value={pswrd} onChange={(e) => setPswrd(e.target.value)}/>



                            <ThemeProvider theme={theme}>
                                <Button color="primary" variant="contained" onClick={submit}>
                                    Login
                                </Button>
                            </ThemeProvider>
                        </Box>
                    </Container>
                </div>

            </div>
        </div>
    );
}

export default Login;