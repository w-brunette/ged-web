import { Alert, Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

const SnackBarContext = createContext({});

const SnackBarProvider = ({ children }) => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('');
    const [typeColor, setTypeColor] = useState('info');

    const showSnackBar = (text, color) => {
        setMessage(text);
        setTypeColor(color);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTypeColor('info');
    };

    return (
        <SnackBarContext.Provider value={{ showSnackBar }}>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity={typeColor}>
                    {message}
                </Alert>
            </Snackbar>
            {children}
        </SnackBarContext.Provider>
    );
};

const useSnackBar = () => {
    const context = useContext(SnackBarContext);

    if (!context) {
        throw new Error('useSnackBar must be used within an SnackBarProvider');
    }

    return context;
};

export { SnackBarProvider, useSnackBar };
