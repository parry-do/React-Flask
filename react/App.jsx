// Basic Imports
import {do_get, do_post, do_put, do_delete} from './request'

//React Imports
import React, { useState, useEffect } from 'react';
import {createAuthProvider} from 'react-token-auth';
import Greeting from './greeting'
import Login from './login'

// React-Bootstrap Imports
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const UserContext = React.createContext()

// Base app
const App = () => {
    // Local reactive variables
    const [user, setUser] = useState({
        'username':null, 'hits':null
    });
    const [logs, setLogs] = useState({'hits':'...', 'times':'...'})
    const [loginShow, setLoginShow] = useState(false);

    const get_user = () => {
        do_get('/user').then(data => {
            if (data.status =='SUCCESS') {
                setUser(data.message);
            } else {
                setUser({
                    'username': null,
                    'hits': null
                });
            }                    
        });
    }

    const login = (data) => {
        do_post(
            data,
            '/signin'
        ).then(data => {
            console.log('In login with data:', data)
            if (data.status == 'SUCCESS') {
                get_user();
            } else {
                // TODO: failure notice here
            }
        })
    }

    // User information gathered
    useEffect(
        get_user,
        []
    );
    
    // User and global persistence with logging
    useEffect(
        () => {
            if (!!user.username) {
                do_get('/log').then(
                    data => {
                        setLogs(data.message)                 
                    }
                );
            }
        },
        [user]
    );

    // Login-conditional rendering
    if (user.username == null) {
        return (
        <UserContext.Provider value={{user, login}}>
        <Container fluid><Row><Col>
        <Card className="text-center">
            <Card.Header>
            React Flask Full Deploy
            </Card.Header>
            <Card.Body>
                <Card.Title>
                React⚛️+Vite⚡+Replit🌀=Good👍
                </Card.Title>
                <Card.Text>
                    <a href="." 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Log in using another tab to see more.
                    </a>
                </Card.Text>
                <Button
                    variant="primary"
                    onClick={() => setLoginShow(true)}>
                    Signin
                </Button>

                <Login
                    show={loginShow}
                    onHide={() => setLoginShow(false)}
                />
            </Card.Body>
        </Card>
        </Col></Row></Container>
        </UserContext.Provider>
        )
    } else {
        return (
            <UserContext.Provider value={{user, login}}>
            <Container fluid><Row className="m-3"><Col xs>
            <Card className="text-center">
                <Card.Header>
                    React Flask Full Deploy
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        React⚛️+Vite⚡+Flask🧪+Auth🔐+MongoDB🍃+Replit🌀=Awesome🤯
                    </Card.Title>
                    <Card.Text>
                        <Greeting logs={logs}/>
                    </Card.Text>
                </Card.Body>
            </Card>
            </Col></Row></Container>
            </UserContext.Provider>
        )
    }
};

// Used in child object (greeting) demonstrating context
export {UserContext};
// Imported by main.js
export default App;
