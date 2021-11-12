import React, { useState, useEffect } from 'react';
import './App.css';

const UserContext = React.createContext({'name':'Not Logged In'})

// Base app
const App = () => {
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

    if (user.name=='Not Logged In') {
        return (
        <main>
            React⚛️+ Vite⚡+ Replit🌀 = Good👍
            <br/>
            {user.name}. Log in to see more.
        </main>)
    } else {
        return (
        <main>
            React⚛️+ Vite⚡+ Flask🧪+ Python🐍+ Replit🌀+ Auth🔒 = Awesome🤯
            <br/>
            Welcome {user.name}
            <br/>
            You've logged in {logs.hits} time(s), total {logs.total} times ever.
        </main>)
    }
};

// Used in child objects for user context state
// TODO: demonstrate this
export {UserContext};
// App imported by main.js
export default App;
