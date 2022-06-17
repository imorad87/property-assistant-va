import MessageOutlined from '@mui/icons-material/MessageOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { throttle, debounce } from 'lodash';
import React from 'react';


const apiUrl = process.env.NEXT_PUBLIC_API_URL!;


export default function InitialMessagesAutoComplete({ setMessage }) {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const initOptions: Array<any> = [];
    const [options, setOptions] = React.useState(initOptions);


    // const fetch = React.useMemo(() => {

    // }, []);


    const graphqlQuery = {
        "operationName": "SearchInitialMessages",
        "query": `query SearchInitialMessages($body: String!) {
            searchInitialMessages(body: $body) {
              id
              message
              created_at
              updated_at
            }
          }
          `,
        "variables": {
            "body": inputValue
        }
    };


    const fetch = React.useCallback(debounce(async () => {

        const res = await axios({
            url: `${apiUrl}graphql`,
            method: 'post',
            data: graphqlQuery
        });

        const data = res.data;

        if (data) {
            setOptions(data.data.searchInitialMessages);
        }
    }, 500)
        , [inputValue]);


    React.useEffect(() => {
        fetch();

    }, [inputValue, fetch]);

    return (
        <Autocomplete
            id="initial-messages-autocomplete"

            getOptionLabel={(option) =>
                option.message
            }

            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            isOptionEqualToValue={(option, value) => option.message === value.message}
            onChange={(event: any, newValue: any | null) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                setMessage(newValue.message);
            }}

            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);

            }}

            renderInput={(params) => (
                <TextField {...params} label="Choose Initial Message" fullWidth />
            )}

            renderOption={(props, option) => {

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box
                                    component={MessageOutlined}
                                    sx={{ color: 'text.secondary', mr: 2 }}
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body2" color="text.secondary">
                                    {option.message}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
}
