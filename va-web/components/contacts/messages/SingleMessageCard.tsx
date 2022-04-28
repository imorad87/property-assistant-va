import { Chip, Grid, Typography } from '@mui/material';
import { blue, grey, green } from '@mui/material/colors';
import moment from 'moment';
import React from 'react';

const SingleMessageCard = ({ message }) => {
    return (
        <Grid container flexDirection='column' border={1} borderRadius={3} borderColor='gray' sx={{ width: '50%' }} padding={1} boxShadow={3}>
            <Grid item container justifyContent='space-between' alignItems='center' >
                <Typography variant='caption' style={{ color: grey[700] }}>{moment(message.created_at).format('MMM, DD YY')}</Typography>
                {message.type === 'incoming' ? <Chip label="Incoming" style={{ fontSize: '0.70em', color: blue[700] }} size="small" />
                    : <Chip label="Outgoing" style={{ fontSize: '0.70em', color: green[700] }} size="small" />
                }
                <Chip label={message.status} style={{ fontSize: '0.70em', color: green[700] }} size="small" />
                {message.classification  && <Chip label={message.classification} style={{ fontSize: '0.70em', color: green[700] }} size="small" />}
            </Grid>
            <Grid item container justifyContent='space-between' wrap='nowrap' columnSpacing={1} alignItems='center' >
                <Grid item flexGrow={1}>
                    <Typography variant="caption" style={{ color: grey[700] }} sx={{ maxWidth: '100%', whiteSpace: 'normal' }}>
                        {message.body}
                    </Typography>
                </Grid>
                <Grid item alignSelf='self-end'>
                    <Typography variant='caption' style={{ color: grey[700] }}>
                        {moment(message.created_at).format('HH:mm:ss')}
                    </Typography>
                </Grid>

            </Grid>
        </Grid>
    )
}

export default SingleMessageCard