import {do_post} from './request.jsx'

import React from 'react';

import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';

import {UserContext} from './App';

function Signin(props) {
    // Signin modal window and controlls
    const {getUser} = React.useContext(UserContext)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    
    const signin = (data) => {
        do_post(
            data,
            '/signin'
        ).then(data => {
            if (data.status == 'SUCCESS') {
                getUser();
                props.children.onSignIn();
            } else {
                // TODO: failure notice here
            }
        })
    }

    const submit = e => {
        e.preventDefault()
        signin({
            'username':username,
            'password':password
        })
    }

    return (
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header style={{background: "#d0d0d0"}}>
            <Modal.Title id="contained-modal-title-vcenter">
            Sign in
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{background: "#f0f0f0"}}>
            <Container
                id="main"
                className="d-grid h-100"
                style={{
                    "placeItems": "center center",
                    "display":"grid"
                }}
            >
            <Form 
                id="signin"
                onSubmit={submit}
                className="text-center p-3 w-100"
            >
                <Form.Group controlId="username">
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={
                            ({target:{value}}) => 
                            setUsername(value)
                        }
                        size="lg"
                        placeholder="User Name"
                        autoComplete="username"
                        className="position-relative mb-3"
                        />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={
                            ({target:{value}}) => 
                            setPassword(value)
                        }
                        size="lg"
                        placeholder="Password"
                        autoComplete="current-password"
                        className="position-relative mb-3"
                    />
                </Form.Group>
                <Form.Group
                    className="d-flex justify-content-center mb-4" 
                    controlId="remember"
                >
                    <Form.Check
                        label="Remember me"
                        className="mb-3"
                    />
                </Form.Group>
                <div className="d-grid">
                    <Button variant="primary" size="lg" type="submit">
                        Sign in
                    </Button>
                </div>
            </Form>
            </Container>
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
            } else {
                // TODO: failure notice here
            }
        })
    }
    return (
        <>
        {(!user.username) &&
        <>
        <Button
            variant="primary"
            onClick={() => setSigninShow(true)}>
            Signin
        </Button>
        <Signin
            show={signinShow}
            onHide={() => setSigninShow(false)}
        >
        {{'onSignIn': () => setSigninShow(false)}}
        </Signin>
        </>
        } {(!!user.username) &&
        <Button
            variant="primary"
            onClick={signout}>
            Signout
        </Button>
        }
        </>
    )
}

export default Auth
