import React, { useState, useEffect } from 'react';
import Greeting from './greeting'
//import './App.css';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
const UserContext = React.createContext()

// Base app
const App = () => {
    // Local reactive variables
    const [user, setUser] = useState({'name':'Not Logged In'});
    const [logs, setLogs] = useState({'hits':'...', 'times':'...'})

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
    
    // User and global persistence is demonstrated
    useEffect(
        () => {
            console.log(user.name != 'Not Logged In')
            console.log(user.name)
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
        <Card className="text-center">
            <Card.Header>
            React Flask Full Deploy
            </Card.Header>
            <Card.Body>
                <Card.Title>
                React⚛️+ Vite⚡+ Replit🌀 = Good👍
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
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
        )
    } else {
        return (
            <UserContext.Provider value={user}>
            <Card className="text-center">
                <Card.Header>
                    React Flask Full Deploy
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        React⚛️+Vite⚡+Flask🧪+Python🐍+Replit🌀=Awesome🤯
                    </Card.Title>
                    <Card.Text>
                        <Greeting logs={logs}/>
                    </Card.Text>
                    <Button variant="primary">
                        Go somewhere
                    </Button>
                </Card.Body>
            </Card>
            </UserContext.Provider>
        )
    }
};

// Used in child object (greeting) demonstrating context
export {UserContext};
// Imported by main.js
export default App;
