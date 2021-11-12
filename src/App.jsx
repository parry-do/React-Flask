import React, { useState, useEffect } from 'react';
import './App.css';

// Vanilla cookie search
var cookie = (name, defaulted='') => {
    try {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(name+'='))
            .split('=')[1];
    }
    catch(err){return defaulted}
}

// User context for entire app
const user = {
    'id'    : cookie('X-Replit-User-Id', 'Not Logged In'),
    'name'  : cookie('X-Replit-User-Name', 'Not Logged In'),
    'roles' : cookie('X-Replit-User-Roles')
};

const UserContext = React.createContext(user);

// Base app
const App = () => {

    const [working, setWorking] = useState('Not Working');

    useEffect(() => {
        fetch('/working')
            .then(res => res.json())
            .then(data => {
                setWorking(data.message);
            });
        },
        []
    );

    return (<UserContext.Provider value={user}>
        <main>
            React⚛️+ Vite⚡+ Flask🧪+ Python🐍+ Replit🌀+ Auth🔒 = Awesome🤯
            <br/>
            {user.id}
            <br/>
            {working}
        </main>
    </UserContext.Provider>)
};

export default App;