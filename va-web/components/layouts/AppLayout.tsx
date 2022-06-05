import { Grid } from "@mui/material";
import Head from "next/head";
import React from 'react';
import Navigation from "./Navigation";

const AppLayout = ({ header, children }) => {
    return (
        <>
            <Head>
                <title>Property VA</title>
            </Head>
            <Grid container sx={{ width: '95%' }} flexDirection='column' marginX='auto'>

                <Navigation />
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
                <div>
                    {children}
                </div>
            </Grid >
        </>
    );
}

export default AppLayout;