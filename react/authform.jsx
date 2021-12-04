import React from 'react';

import {do_post} from './request.jsx'
import {UserContext} from './App';

import {
    Avatar, Box, Button, Checkbox, Container, CssBaseline,
    FormControlLabel, Grid, Switch, TextField
} from '@mui/material'

import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme();

export default function AuthForm(props) {
    // Signin modal window and controls
    const {getUser}     = React.useContext(UserContext)
    const formRef       = React.useRef(null);
    const signIn        = props.signIn;
    const setSignIn     = props.setSignIn;
    const setSignInShow = props.setsigninshow;
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
        !signIn && (!confirm || confirm!=password) && 'Passwords Must Match'
    )
    const valid = () => !(
        username_err() || password_err() || confirm_err()
    )

    const submit = e => {
        e.preventDefault()
        setValidated(true)
        if (!valid()) {
            setAlerted("Invalid username or password")
        }
        else {
            do_post({
                    'username':username,
                    'password':password,
                    'remember':remember
                },
                (signIn) ? '/signin' : '/signup'
            ).then(data => {
                if (data.status == 'SUCCESS') {
                    getUser();
                    setSignInShow(false)
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
        component="form"
        noValidate
        onSubmit={submit}
    >
    <Grid container spacing={2}>
        <Grid item xs={6} md={12}>
            <TextField
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="username"
                onChange={({target:{value}}) => setUsername(value)}
                error={validated && username_err()}
                helperText={validated?username_err():'*Required'}
            />
        </Grid>
        <Grid item xs={6} md={12}>
            <TextField
                required
                fullWidth
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
        <Grid item xs={6} md={6}>
            <FormControlLabel
                control={<Switch 
                    color={signIn?'primary':'secondary'}
                    checked={remember}
                    onChange={({target:{checked}}) =>   setRemember(checked)}
                />}
                label="Remember Me"
            />
        </Grid>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
                bgcolor:signIn?'primary.main':'secondary.main' 
            }}
        >
            {signIn?"Sign In":"Sign Up"}
        </Button>
    </Grid>
    </Box>
    </Container>
    </ThemeProvider>
    );
}
