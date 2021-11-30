import {do_post} from './request.jsx'

import React from 'react';

import AuthForm from './authform'

import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import {UserContext} from './App';

function Signin(props) {
    // Signin modal window and controls
    const [signIn, setSignIn] = React.useState(true)

    return (
    <Modal {...props} aria-labelledby="modal">
        <Modal.Header>
            <Modal.Title id="modal">
                {(signIn) ? "Sign In" : "Sign Up"}
            </Modal.Title>
            <Button 
                variant={(signIn) ? "primary" : "secondary"}
                onClick={({target:{value}}) => setSignIn(!signIn)}
            >
                {(signIn) ? "Sign Up Instead" : "Sign In Instead"}
            </Button>
        </Modal.Header>
        <Modal.Body style={{background: "#f0f0f0"}}>
            <AuthForm
                onSignIn  = {props.children.onSignIn}
                signIn    = {signIn}
                setSignIn = {setSignIn}
            />
        </Modal.Body>
    </Modal>
    );
}

function Auth(props) {
    // Authorization buttons and controls
    const {user, setUser} = React.useContext(UserContext)
    const [signinShow, setSigninShow] = React.useState(false);

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
                <Button variant="primary" onClick={() => setSigninShow(true)}>
                    Sign In or Sign Up
                </Button>
                <Signin show={signinShow} onHide={() => setSigninShow(false)}>
                    {{'onSignIn' : () => setSigninShow(false)}}
                </Signin>
            </>
        } {(!!user.username) &&
            <Button variant="primary" onClick={signout}>
                Signout
            </Button>
        }
        </>
    )
}

export default Auth
