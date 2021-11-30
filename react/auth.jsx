import {do_post} from './request.jsx'

import React from 'react';

import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import {UserContext} from './App';

function Signin(props) {
    // Signin modal window and controlls
    const {getUser} = React.useContext(UserContext)
    const [signIn,    setSignIn]    = React.useState(true)
    const [username,  setUsername]  = React.useState('')
    const [password,  setPassword]  = React.useState('')
    const [confirm,   setConfirm]   = React.useState('')
    const [remember,  setRemember]  = React.useState(true)
    const [validated, setValidated] = React.useState(false)
    const [alerted,   setAlerted]   = React.useState('')
    const formRef = React.useRef(null);

    const valid_username = () => !!username
    const valid_password = () => password.length>=5
    const valid_confirm  = () => !!confirm && confirm==password
    const valid = () => (
        valid_username() && valid_password() && valid_confirm
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
    <Modal {...props} aria-labelledby="modal">
        <Modal.Header>
            <Modal.Title id="modal">
                {(signIn)?"Sign In":"Sign Up"}
            </Modal.Title>
            <Button 
                variant={(signIn)?"primary":"secondary"}
                onClick={({target:{value}}) => setSignIn(!signIn)}
            >
                {(signIn)?"Sign Up Instead":"Sign In Instead"}
            </Button>
        </Modal.Header>
        <Modal.Body style={{background: "#f0f0f0"}}>
            <Container>
            <Alert show={!!alerted} variant="danger" onClick={() => setAlerted('')}>
                <Alert.Heading>Error:</Alert.Heading>
                <p> {alerted} </p>
            </Alert>
            <Form 
                ref={formRef}
                id="signin"
                noValidate
                onSubmit={submit}
            >
                <Form.Group controlId="username" className="mb-3">
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={({target:{value}}) => 
                            setUsername(value)
                        }
                        isInvalid = {validated&&!valid_username()}
                        isValid   = {validated&&valid_username()}
                        placeholder="User Name"
                        autoComplete="username"
                    />
                    <Form.Control.Feedback type="invalid">
                        User Name Required
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={({target:{value}}) => 
                            setPassword(value)
                        }
                        isInvalid = {validated&&!valid_password()}
                        isValid   = {validated&&valid_password}
                        placeholder="Password (at least 5 Characters)"
                        autoComplete="current-password"
                    />
                    <Form.Control.Feedback type="invalid">
                        Password of at Least 5 Characters Required
                    </Form.Control.Feedback>
                </Form.Group>
                {(!signIn) &&
                <Form.Group controlId="confirm" className="mb-3">
                    <Form.Control
                        type="password"
                        onChange={({target:{value}}) =>
                            setConfirm(value)
                        }
                        isInvalid = {validated && !valid_confirm()}
                        isValid   = {validated && valid_confirm()}
                        placeholder="Confirm Password"
                        autoComplete="current-password"
                    />
                    <Form.Control.Feedback type="invalid">
                        Passwords must match
                    </Form.Control.Feedback>
                </Form.Group>
                }
                <Form.Group className="mb-4" controlId="remember">
                    <Form.Check
                        label="Remember me"
                        value={remember}
                        onChange={({target:{value}}) =>
                            setRemember(value)
                        }
                    />
                </Form.Group>
                <div className="d-grid">
                    <Button 
                        variant="primary"
                        size="lg"
                        type="submit"
                    >
                        {(signIn) && "Sign In"}
                        {(!signIn) && "Sign Up"}
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
            Sign In or Sign Up
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
