import { PauseCircleFilledRounded, PlayArrowRounded } from '@mui/icons-material';
import DeleteForeverRounded from '@mui/icons-material/DeleteForeverRounded';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';

const PhoneNumberInfoPanel = ({ numberInfo }) => {

    const [status, setStatus] = React.useState(numberInfo.active);


    return (
        <Grid container direction='column' rowSpacing={2} width='100%'>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={3}><Typography variant="body1" color="initial">ID</Typography></Grid>
                <Grid item xs={9}><Typography variant="body1" color="initial">{numberInfo.id}</Typography></Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={3}><Typography variant="body1" color="initial">Status</Typography></Grid>
                <Grid item xs={9}>
                    {
                        status ? <PlayArrowRounded style={{ color: 'green' }} />
                            : <PauseCircleFilledRounded style={{ color: 'orange' }} />
                    }
                </Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={3}><Typography variant="body1" color="initial">#</Typography></Grid>
                <Grid item xs={9}><Typography variant="body1" color="initial">{numberInfo.number}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={12} justifyContent='flex-end' alignContent='center'>
                <Grid item>
                    <Tooltip title='Delete Number'>
                        <IconButton>
                            <DeleteForeverRounded style={{ color: 'red' }} />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <IconButton>
                        {status ?
                            <Tooltip title='Pause Number'>
                                <PauseCircleFilledRounded style={{ color: 'orange' }} />
                            </Tooltip> :
                            <Tooltip title='Resume Number'>
                                <PlayArrowRounded style={{ color: 'green' }} />
                            </Tooltip>
                        }
                    </IconButton>
                </Grid>
            </Grid>

        </Grid>
    );
}

export default PhoneNumberInfoPanel