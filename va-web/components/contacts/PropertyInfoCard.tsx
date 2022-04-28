import { Grid, Typography } from '@mui/material';
import React from 'react';

const PropertyInfoCard = ({ propertyInfo }) => {

    const { id, address, type, state, zip, county } = propertyInfo;

    return (
        <Grid container direction='column' rowSpacing={2}>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body1" color="initial">ID</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{id}</Typography></Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body1" color="initial">Address</Typography></Grid>
                <Grid item xs={8}>{address}
                </Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body1" color="initial">State</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{state}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={4}>
                <Grid item xs={4}><Typography variant="body1" color="initial">County</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{county}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={4}>
                <Grid item xs={4}><Typography variant="body1" color="initial">Zip</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{zip}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={4}>
                <Grid item xs={4}><Typography variant="body1" color="initial">Type</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{type}</Typography></Grid>
            </Grid>

        </Grid>
    )
}

export default PropertyInfoCard