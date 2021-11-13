import React, { useState, useEffect } from 'react';
import Greeting from './greeting'
import './App.css';

const UserContext = React.createContext()

// Base app
const App = () => {
    // User information is gathered
    const [user, setUser] = useState({'name':'Not Logged In'});
    
    useEffect(() => {
        fetch('/user')
            .then(res => res.json())
            .then(data => {
                setUser(data.message);
            });
        },
        []
    );
    
    // User and global persistence is demonstrated
    const [logs, setLogs] = useState('...');

    useEffect(() => {
        fetch('/log')
            .then(res => res.json())
            .then(data => {
                setLogs(data.message);
            });
        },
        []
    );

    // Login-conditional rendering
    if (user.name=='Not Logged In') {
        return (
        <main>
            React⚛️+ Vite⚡+ Replit🌀 = Good👍
            <br/>
            {user.name}. Log in to see more.
        </main>)
    } else {
        return (
        <UserContext.Provider value={user}>
            <main>
                React⚛️+ Vite⚡+ Flask🧪+ Python🐍+ Replit🌀+ Auth🔒 = Awesome🤯
                <br/>
                <Greeting logs={logs}/>
            </main>
        </UserContext.Provider>)
    }
};

// Used in child object (greeting) demonstrating context
export {UserContext};
// Imported by main.js
export default App;
