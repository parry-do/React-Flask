import {do_get} from './request';
import React from 'react';

import Greeting from './greeting'

import {Grid, Typography} from '@mui/material'

import {UserContext} from './App';

const Message = (props) => {
    const {user} = React.useContext(UserContext)
    const [logs, setLogs] = React.useState(
        {'hits':'...', 'times':'...'}
    )

    // User and global persistence with logging
    React.useEffect(
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

    return (
        <>
        {(!user.username) &&
        <Grid container spacing={2}>      
            <Grid item xs={12}>
                <Typography component='h1' variant='h5' >
                    Sign in to see more.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption">
                    Username: admin, Password: admin
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption">or</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption">
                    Username: user, Password: useruser
                </Typography>
            </Grid>
        </Grid>
        } {(!!user.username) &&
        <Greeting logs={logs}/>
        }
        </>
    )
}

export default Message
