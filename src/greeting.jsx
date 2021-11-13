import React, { useContext} from 'react';
import {UserContext} from './App';

// Demonstrates user context sharing from App's UserContext
// as well as typical prop arguments
const Greeting = ({logs}) => {
    const user = useContext(UserContext)
    return (
        <p>
            Welcome {user.name}
            <br/>
            You've visited this page {logs.hits} time{(logs.hits>1)?'s':''}, total {logs.total} time{(logs.total>1)?'s':''} by everyone ever.
        </p>
    )
};

export default Greeting;