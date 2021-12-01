import {do_get} from './request';
import React from 'react';

import Greeting from './greeting'

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
        <>
        <span>Sign in to see more.</span>
        <hr/>
        <span>Username: admin, Password: admin</span>
        <br/>
        <span>or</span>
        <br/>
        <span>Username: user, Password: useruser</span>
        </>
        } {(!!user.username) &&
        <Greeting logs={logs}/>
        }
        </>
    )
}

export default Message
