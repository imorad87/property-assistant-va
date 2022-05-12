import { useMutation } from '@apollo/client';
import { RestartAltRounded } from '@mui/icons-material';
import { Grid, LinearProgress } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import React from 'react';
import { UPDATE_SMS } from '../../../lib/mutations';

const ScheduledMessagesDataTable = ({ messages }) => {


    const [retryMessage] = useMutation(UPDATE_SMS);

    const reschedule = React.useCallback(
        (id: GridRowId) => async () => {
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
                    />
                ],
            },

        ],
        []
    );



    return (
        <Grid container sx={{ minWidth: '100%' }}>
            <DataGrid
                rows={messages}
                columns={columns}
                components={{
                    LoadingOverlay: LinearProgress,
                }}
                pagination
            />
        </Grid>

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