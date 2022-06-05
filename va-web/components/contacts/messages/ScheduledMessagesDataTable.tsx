import { useMutation } from '@apollo/client';
import { DeleteForever, RestartAltRounded } from '@mui/icons-material';
import { Grid, LinearProgress } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import React from 'react';
import { DELETE_SMS, UPDATE_SMS } from '../../../lib/mutations';

const ScheduledMessagesDataTable = ({ messages }) => {



    const [retryMessage] = useMutation(UPDATE_SMS);
    const [deleteMessage] = useMutation(DELETE_SMS);
    const [loading, setLoading] = React.useState(false);

    const reschedule = React.useCallback(
        (id: GridRowId) => async () => {
            setLoading(true)
            await retryMessage({
                variables: {
                    input: {
                        id,
                        active: true,
                        status: 'scheduled',
                        status_message: 'To be sent'
                    }
                }
            })
            setLoading(false)
        },
        [],
    );

    const deleteSms = React.useCallback(
        (id: GridRowId) => async () => {
            setLoading(true)
            await deleteMessage({
                variables: {
                    id
                }
            })
            setLoading(false)
        },
        [],
    );

    const columns = React.useMemo(
        () => [
            { field: 'id', headerName: 'ID', width: 100 },
            { field: 'body', headerName: 'Body', width: 300 },
            { field: 'status', headerName: 'Status', width: 100 },
            { field: 'status_message', headerName: 'Note', width: 150 },

            { field: 'active', headerName: 'Can Send?', width: 90 },

            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<RestartAltRounded />}
                        label='Retry'
                        onClick={reschedule(params.row.id)}
                        key='action1'
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<DeleteForever color='error' />}
                        label='Delete'
                        onClick={deleteSms(params.row.id)}
                        key='action2'
                        showInMenu
                    />
                ],
            },

        ],
        []
    );



    return (

        <>
            < Grid container sx={{ minWidth: '100%' }
            }>
                <DataGrid
                    rows={messages}
                    columns={columns}
                    components={{
                        LoadingOverlay: LinearProgress,
                    }}
                    pagination
                    loading={loading}
                />
            </Grid >
        </>
    );
}



// function CustomToolbar() {
//     return (
//         <GridToolbarContainer>
//             <GridToolbarColumnsButton />
//             <GridToolbarFilterButton />
//             <GridToolbarExport />
//             <Button className='{}'>
//                 Actions
//             </Button>
//         </GridToolbarContainer>
//     );
// }

export default ScheduledMessagesDataTable