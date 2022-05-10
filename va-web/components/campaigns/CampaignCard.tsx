import { Grid, Tooltip, Typography } from '@mui/material'
import React from 'react'
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded';
import { grey } from '@mui/material/colors';

const CampaignInfoCard = ({ campaignInfo }) => {

    const { title, status, id } = campaignInfo;

    return (
        <Grid container direction='column' rowSpacing={2}>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{ color: grey[700] }}>ID</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{ color: grey[700] }}>{id}</Typography></Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{ color: grey[700] }}>Title</Typography></Grid>
                <Grid item xs={8}>{title}
                </Grid>
            </Grid>
           
        </Grid>
    )
}

export default CampaignInfoCard