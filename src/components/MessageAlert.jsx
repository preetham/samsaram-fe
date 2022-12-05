import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export const MessageAlert = ({ duration, message, severity , openSnackBar, handleSnackBarClose }) => {
    return (
        <Snackbar open={openSnackBar} autoHideDuration={duration} onClose={handleSnackBarClose}>
            <Alert onClose={handleSnackBarClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};