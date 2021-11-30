import {do_post} from './request.jsx'

import React from 'react';

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import {UserContext} from './App';

function AuthForm(props) {
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
    
    const valid_username = () => !!username
    const valid_password = () => password.length>=5
    const valid_confirm  = () => !!confirm && confirm==password
    const valid = () => valid_username() && valid_password() && valid_confirm()

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
        <Container>
        <Alert show={!!alerted} variant="danger" onClick={() => setAlerted('')}>
            <Alert.Heading>Error:</Alert.Heading>
            <p> {alerted} </p>
        </Alert>
        <Form ref={formRef} id="signin" noValidate onSubmit={submit}>
            
            <Form.Group controlId="username" className="mb-3">
                <Form.Control
                    type         = "text"
                    onChange     = {({target:{value}}) => setUsername(value)}
                    isInvalid    = {validated&&!valid_username()}
                    isValid      = {validated&& valid_username()}
                    placeholder  = "User Name"
                    autoComplete = "username"
                />
                <Form.Control.Feedback type="invalid">
                    User Name Required
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
                <Form.Control
                    type         = "password"
                    onChange     = {({target:{value}}) => setPassword(value)}
                    isInvalid    = {validated&&!valid_password()}
                    isValid      = {validated&& valid_password}
                    placeholder  = "Password (at least 5 Characters)"
                    autoComplete = "current-password"
                />
                <Form.Control.Feedback type="invalid">
                    Password of at Least 5 Characters Required
                </Form.Control.Feedback>
            </Form.Group>
            
            {(!signIn) &&
                <Form.Group controlId="confirm" className="mb-3">
                    <Form.Control
                        type         = "password"
                        onChange     = {({target:{value}}) => setConfirm(value)}
                        isInvalid    = {validated&&!valid_confirm()}
                        isValid      = {validated&& valid_confirm()}
                        placeholder  = "Confirm Password"
                        autoComplete = "current-password"
                    />
                    <Form.Control.Feedback type="invalid">
                        Passwords Must Match
                    </Form.Control.Feedback>
                </Form.Group>
            }

            <Form.Group controlId="remember" className="mb-4">
                <Form.Check
                    label    = "Remember me"
                    type     = "switch"
                    checked  = {remember}
                    onChange = {({target:{checked}}) => setRemember(checked)}
                />
            </Form.Group>
            <div className="d-grid">
                <Button variant="primary" type="submit">
                    {(signIn) ? "Sign In" : "Sign Up"}
                </Button>
            </div>
        </Form>
        </Container>
    );
}

export default AuthForm
