import { useMutation, useQuery } from '@apollo/client'
import { Create } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import React from 'react'
import InititalMessagesDataTable from '../../components/initial-messages/InititalMessagesDataTable'
import AppLayout from '../../components/layouts/AppLayout'
import { CREATE_INTIAL_MESSAGE_MUTATION } from '../../lib/mutations'
import { INITIAL_MESSAGES_PAGE } from '../../lib/queries'

const InitialMessages = () => {

    const [message, setMessage] = React.useState('');
    const [validationError, setValidationError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValidationError('')
        setMessage(e.currentTarget.value);
    }

    const [newMessage] = useMutation(CREATE_INTIAL_MESSAGE_MUTATION);

    const createMessage = async (e: React.SyntheticEvent) => {
        try {
            await newMessage({
                variables: {
                    input: {
                        message
                    }
                }
            })
        } catch (error: any) {
            setValidationError(error.message)
        }
    }

    const { loading, error, data } = useQuery(INITIAL_MESSAGES_PAGE, {
        pollInterval: 1000,
    });

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    return (
        <AppLayout header='Initial Messages'>
            <div className="py-12 w-full">
                <div className="w-full mx-auto">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="flex flex-col gap-3 justify-around p-6 my-10 bg-white border-gray-200">
                            <div className='flex gap-3 justify-center items-center'>
                                <TextField
                                    id="message"
                                    variant='outlined'
                                    label="Initial Message"
                                    value={message}
                                    onChange={handleChange}
                                    className='flex-1'
                                    error={validationError !== ''}
                                    helperText={validationError && validationError}
                                />
                                <IconButton onClick={createMessage}>
                                    <Create />
                                </IconButton>
                            </div>
                            <InititalMessagesDataTable initialMessages={data.getAllInitialMessage} />
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}

export default InitialMessages;