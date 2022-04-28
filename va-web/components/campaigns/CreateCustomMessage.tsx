import { Button, FormControlLabel, Grid, GridProps, Switch, TextField } from '@mui/material';
import { green } from '@mui/material/colors';
import React from 'react';
import InitialMessagesAutoComplete from './InitialMessagesAutoComplete';


const Container = ({ children, ...props }: GridProps) => (<Grid container {...props}>{children}</Grid>);
const Item = ({ children, ...props }: GridProps) => (<Grid item {...props}>{children}</Grid>);



const CreateCustomMessage = ({ setMessage }) => {

    const [customMessage, setCustomMessage] = React.useState('');
    const [error, setError] = React.useState(null);

    const [isNew, setIsNew] = React.useState(false);

    const handleCustomMessageChange = (e) => {
        const value = e.currentTarget.value;
        setCustomMessage(value);
    };

    const handleCustomMessageMethodChange = () => {
        setIsNew(!isNew);
    };


    const save = () => {
        setMessage(customMessage);
    }

    return (


        <Container flexDirection='column'>
            <Item container justifyContent='end'>
                <FormControlLabel
                    control={
                        <Switch checked={isNew} onChange={handleCustomMessageMethodChange} name='imSwitch' />
                    }
                    label={isNew ? 'New' : 'Search'}
                />
            </Item>
            <Item>
                {
                    isNew ?
                        <Container
                            alignItems='center'
                            spacing={1}
                        >
                            <Item
                                flexGrow={1}>
                                <TextField
                                    id="message"
                                    label="New Message"
                                    value={customMessage}
                                    onChange={handleCustomMessageChange}
                                    fullWidth
                                    error={error != null}
                                    helperText={error}
                                    required
                                />
                            </Item>
                            <Item>
                                <Button
                                    size='large'
                                    variant='outlined'
                                    style={{ color: green[800] }}
                                    onClick={save}
                                >
                                    Save
                                </Button>
                            </Item>
                        </Container> :

                        <InitialMessagesAutoComplete setMessage={setMessage} />
                }
            </Item >
        </Container >
    )

}

export default CreateCustomMessage