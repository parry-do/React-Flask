import React, {useContext, useEffect} from 'react';
import {UserContext} from './App';

import {Grid, Typography} from '@mui/material';

// Demonstrates UserContext
const Greeting = ({logs}) => {
    const {user} = useContext(UserContext)
 
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>Welcome {user.username}</Grid>
            <Grid item xs={12} sm={6}>
                You've visited this page{' '} 
                {logs.hits} time{(logs.hits>1)?'s':''}.
            </Grid>
            <Grid item xs={12} sm={6}>
                Total visits: {logs.total} time{(logs.total>1)?'s ':' '}
                by everyone ever.
            </Grid>
        </Grid>
    )
};

export default Greeting;
