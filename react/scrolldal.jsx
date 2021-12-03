import React from 'react';

import {Modal} from '@mui/material'

function Scrolldal(props) {
    return (
    <Modal {...props} 
        sx={{margin:'5%', marginBottom:0, overflow:'auto'}}
    >
    </Modal>
    );
}

export default Scrolldal
