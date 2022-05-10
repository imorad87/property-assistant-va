import { Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';

const PropertyInfoCard = ({ propertyInfo }) => {

    const { id, address, type, state, zip, county } = propertyInfo;

    return (
        <Grid container direction='column' rowSpacing={2}>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{color:grey[700]}}>ID</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{color:grey[700]}}>{id}</Typography></Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{color:grey[700]}}>Address</Typography></Grid>
                <Grid item xs={8}>{address}
                </Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{color:grey[700]}}>State</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{color:grey[700]}}>{state}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={4}>
                <Grid item xs={4}><Typography variant="body2" style={{color:grey[700]}}>County</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{color:grey[700]}}>{county}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={4}>
                <Grid item xs={4}><Typography variant="body2" style={{color:grey[700]}}>Zip</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{color:grey[700]}}>{zip}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={4}>
                <Grid item xs={4}><Typography variant="body2" style={{color:grey[700]}}>Type</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{color:grey[700]}}>{type}</Typography></Grid>
            </Grid>

        </Grid>
    )
}

export default PropertyInfoCard