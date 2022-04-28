import { RemoveCircleOutlined } from '@mui/icons-material';
import { GridProps, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import React from 'react'



const Container = ({ children, ...props }: GridProps) => (<Grid container {...props}>{children}</Grid>);
const Item = ({ children, ...props }: GridProps) => (<Grid item {...props}>{children}</Grid>);



const CustomMessageView = ({ message, replaceMessage }) => {
    return (
        <Container display={message === '' ? 'none' : 'flex'} flexDirection='column' spacing={1} flexWrap='nowrap'>
            <Item sx={{ minWidth: 'fit-content' }}><Typography variant="body1" style={{ color: grey[700] }}>Campaign Message:</Typography></Item>
            <Item container flexDirection='row' flexWrap='nowrap' alignItems={'center'}>
                <Item style={{ flexGrow: 1 }}><Typography variant="body1" style={{ color: grey[700], maxWidth: '100%', whiteSpace: 'normal' }}>{message}</Typography></Item>
                <Item>
                    <IconButton onClick={replaceMessage}>
                        <Tooltip title='Remove'>
                            <RemoveCircleOutlined style={{ color: red[600] }} />
                        </Tooltip>
                    </IconButton>
                </Item>
            </Item>
        </Container>
    )
}

export default CustomMessageView