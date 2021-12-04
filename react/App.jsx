// Basic Imports
import {do_get} from './request';
import React from 'react';

// Custom React Components
import Auth from './auth';
import Message from './message';

import {
    Button, CardActions, CardContent,
    CardHeader, Grid, Paper, Typography 
} from '@mui/material'

// Global User context
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
    <Paper elevation={24} sx={{margin:'2.5%', textAlign:'center'}}>
        <CardHeader
            sx={{text:'center'}}
            title={<Typography component='h1' variant='h4'>
                    React+Flask Full Deploy
                </Typography>
            }
        />
        <CardContent>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography component='h1' variant='h5'>
                {(!user.username) && 
                <Grid item xs={12}>
                React⚛️ + Vite⚡ + Replit🌀 = Good👍
                </Grid>
                } {(!!user.username) && 
                <Grid item xs={12}>
                React⚛️ + Vite⚡ + Flask🧪 + Auth🔐 + MongoDB🍃 + Replit🌀 = Awesome🤯
                </Grid>
                }
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Message/>
            </Grid>
            <Grid item xs={12}>
                <Auth />
            </Grid>
            
            </Grid>
        </CardContent>
    </Paper>
    </UserContext.Provider>
    )
};

// Used in child object (greeting) demonstrating context
export {UserContext};
// Imported by main.js
export default App;
