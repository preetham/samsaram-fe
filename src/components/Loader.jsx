import React from 'react';

import { CircularProgress } from '@mui/material';

export const Loader = ({ showLoader }) => {
    return (
        <>
            {showLoader && <CircularProgress sx={{ position: 'absolute', top: '40%', left: '50%' }} />}
        </>
    );
};