import React from 'react';

import {do_post} from './request.jsx'
import {UserContext} from './App';

/*
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
/**/
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function AuthForm(props) {
    // Signin modal window and controls
    const {getUser} = React.useContext(UserContext)
    const formRef   = React.useRef(null);
    const signIn    = props.signIn;
    const setSignIn = props.setSignIn;
    const [username,  setUsername]  = React.useState('')
    const [password,  setPassword]  = React.useState('')
    const [confirm,   setConfirm]   = React.useState('')
    const [remember,  setRemember]  = React.useState(true)
    const [validated, setValidated] = React.useState(false)
    const [alerted,   setAlerted]   = React.useState('')
    
    const username_err = () => (
        !username && 'User Name is Required'
    )
    const password_err = () => (
        password.length<5 && 'Password of at Least 5 Characters Required'
    )
    const confirm_err  = () => (
        (!confirm || confirm!=password) && 'Passwords Must Match'
    )
    const valid = () => !(
        username_error() || password_error() || confirm_err()
    )

    const submit = e => {
        e.preventDefault()
        setValidated(true)
        if (!valid()) {
            setAlerted("Invalid username or password")
        }
        else {do_post(
                {
                    'username':username,
                    'password':password,
                    'remember':remember
                },
                (signIn) ? '/signin' : '/signup'
            ).then(data => {
                if (data.status == 'SUCCESS') {
                    getUser();
                    props.children.onSignIn();
                } else {
                    setAlerted(data.message)
                }
            }
        )}
    }

    return (
    <ThemeProvider theme={theme}>
    <Container component="main">
    <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            <Avatar sx={{ 
                    m: 1, 
                    bgcolor: signIn?'secondary.main':'primary.main'
                }}
            >
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                {signIn ? 'Sign In' : 'Sign Up'} 
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={submit}
            >
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        sx={{m:1}}
                        id="username"
                        label="User Name"
                        name="username"
                        autoComplete="username"
                        onChange={({target:{value}}) => setUsername(value)}
                        error={validated && username_err()}
                        helperText={validated?username_err():'*Required'}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        sx={{m:1}}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete={signIn?'current-password':"new-password"}
                        onChange={({target:{value}}) => setPassword(value)}
                        error={validated && password_err()}
                        helperText={validated?password_err():'*Required'}
                    />
                </Grid>
                {(!signIn) &&
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        sx={{m:1}}
                        name="confirm"
                        label="Confirm Password"
                        type="password"
                        id="confirm"
                        autoComplete="new-password"
                        onChange={({target:{value}}) => setConfirm(value)}
                        error={validated && confirm_err()}
                        helperText={validated?confirm_err():'*Required'}
                    />
                </Grid>
                }
                <Grid item xs={12}>
                    <FormControlLabel
                    control={
                        <Checkbox value="remember" color="primary" />
                    }
                    label="Remember Me"
                    />
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                        mt: 3,
                        mb: 2,
                        bgcolor:signIn?'primary.main':'secondary.main' 
                    }}
                >
                    {signIn?"Sign In":"Sign Up"}
                </Button>
            </Box>
        </Box>
    </Container>
    </ThemeProvider>
    );
}
