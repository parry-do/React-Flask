import React from 'react';

import {do_post} from './request'
import AuthForm from './authform'
import Scrolldal from './scrolldal'
import {UserContext} from './App';

import {
    Avatar, Button, Card, CardActions, CardActionArea, 
    CardContent, CardHeader, Typography 
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme();

function Signin(props) {
    // Signin modal window and controls
    const [signIn, setSignIn] = React.useState(true)

    return (
    <Scrolldal {...props} 
        sx={{margin:'5%', marginBottom:0, overflow:'auto'}}
    ><Card>
    <CardHeader
        avatar={<Avatar sx={{ 
                    m: 1, 
                    bgcolor: signIn?'primary.main':'secondary.main'
                }}
            >
                <LockOutlinedIcon />
            </Avatar>
        }
        action={<Button 
                sx={{'bgcolor':(signIn) ? "primary" : "secondary"}}
                onClick={({target:{value}}) => setSignIn(!signIn)}
            >
                {(signIn) ? "Sign Up Instead" : "Sign In Instead"}
            </Button>
        }
        title={<Typography component="h1" variant="h5">
                {signIn ? 'Sign In' : 'Sign Up'} 
            </Typography>
        }
    />
    <CardContent>
        <AuthForm
            signIn        = {signIn}
            setSignIn     = {setSignIn}
            setsigninshow = {props.children.setsigninshow}
        />
    </CardContent>
    </Card></Scrolldal>
    );
}

function Auth(props) {
    // Authorization buttons and controls
    const {user, setUser} = React.useContext(UserContext)
    const [signInShow, setSignInShow] = React.useState(false);

    const signout = () => {
        do_post(
            {},
            '/signout'
        ).then(data => {
            if (data.status == 'SUCCESS') {
                setUser({
                    'username':null, 'hits':null
                })
            }
        })
    }
    return (
        <>
            {(!user.username) &&
            <>
                <Button 
                    fullWidth
                    variant='contained'
                    bgcolor='primary'
                    onClick={() => setSignInShow(true)}
                >
                    Sign In or Sign Up
                </Button>
                <Signin open={signInShow}>{{setsigninshow:setSignInShow}}</Signin>
            </>
        } {(!!user.username) &&
            <Button 
                fullWidth
                variant='contained'
                bgcolor='primary'
                onClick={() => setSignInShow(true)}
                onClick={signout}
            >
                Signout
            </Button>
        }
        </>
    )
}

export default Auth
