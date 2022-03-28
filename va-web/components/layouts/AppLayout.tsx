import Navigation from "./Navigation";
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const AppLayout = ({ header, children}) => {

   

    return (
        <main className="max-w-7xl m-auto">
           
            <Navigation />
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {header}
                </div>
            </header>
            <div>
                {children}
            </div>
        </main >
    );
}

export default AppLayout;