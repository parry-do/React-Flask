import React, { useState, useEffect } from 'react';
import Greeting from './greeting'
import Login from './login'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const UserContext = React.createContext()

// Base app
const App = () => {
    // Local reactive variables
    const [user, setUser] = useState({'name':'Not Logged In'});
    const [logs, setLogs] = useState({'hits':'...', 'times':'...'})
    const [loginShow, setLoginShow] = useState(false);
    
    // User information is gathered
    useEffect(
        () => {
            fetch('/user')
                .then(res => res.json())
                .then(data => {
                    setUser(data.message);
                });
        },
        []
    );
    
    // User and global persistence demonstrated with logging
    useEffect(
        () => {
            if (user.name != 'Not Logged In') {
                fetch('/log')
                .then(res => res.json())
                .then(data => {
                    setLogs(data.message);
                });
            }
        },
        [user]
    );

    // Login-conditional rendering
    if (user.name=='Not Logged In') {
        return (
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
                    {user.name}.{' '}
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
                    Login
                </Button>

                <Login
                    show={loginShow}
                    onHide={() => setLoginShow(false)}
                />
            </Card.Body>
        </Card>
        </Col></Row></Container>
        )
    } else {
        return (
            <UserContext.Provider value={user}>
            <Container fluid><Row className="m-3"><Col xs>
            <Card className="text-center">
                <Card.Header>
                    React Flask Full Deploy
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        React⚛️+Vite⚡+Flask🧪+Replit🌀=Awesome🤯
                    </Card.Title>
                    <Card.Text>
                        <Greeting logs={logs}/>
                    </Card.Text>
                    <Button variant="primary">
                        Logout
                    </Button>
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
