// Basic Imports
import {do_get} from './request';
import React from 'react';

// Custom React Components
import Auth from './auth';
import Message from './message';

// React-Bootstrap Imports
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Base app
const UserContext = React.createContext();
const App = () => {
    // Local reactive variables
    const [user, setUser] = React.useState({
        'username':null, 'hits':null
    });

    const getUser = () => {
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

    // User information gathered on load
    React.useEffect(
        getUser,
        []
    );

    return (
        <UserContext.Provider value={{user, setUser, getUser}}>
        <Container fluid><Row><Col>
        <Card className="text-center">
            <Card.Header>
            React+Flask Full Deploy
            </Card.Header>
            <Card.Body>
                <Card.Title>
                {(!user.username) && 
                    <>React⚛️+Vite⚡+Replit🌀=Good👍</>
                } {(!!user.username) && 
                    <>React⚛️+Vite⚡+Flask🧪+Auth🔐+MongoDB🍃+Replit🌀=Awesome🤯</>
                }
                </Card.Title>
                <Card.Text>
                    <Message/>
                </Card.Text>
                <Auth />
            </Card.Body>
        </Card>
        </Col></Row></Container>
        </UserContext.Provider>
        )

};

// Used in child object (greeting) demonstrating context
export {UserContext};
// Imported by main.js
export default App;
