import { useMutation } from '@apollo/client';
import DeleteForeverRounded from '@mui/icons-material/DeleteForeverRounded';
import PauseCircleFilledRounded from '@mui/icons-material/PauseCircleFilledRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Grid, LinearProgress } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams, GridRowId, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridValueSetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import React from 'react';

const ScheduledMessagesDataTable = ({ messages }) => {

    // const deleteContact = React.useCallback(
    //     (id: GridRowId) => () => {

    //     },
    //     [],
    // );

    // const pauseContact = React.useCallback(
    //     (id: GridRowId) => () => {
    //         deactivateContact({
    //             variables: {
    //                 input: {
    //                     id,
    //                     active: false
    //                 },
    //                 id
    //             }
    //         })
    //     },
    //     [],
    // );

    // const resumeContact = React.useCallback(

    //     (id: GridRowId) => () => {
    //         activateContact({
    //             variables: {
    //                 input: {
    //                     id,
    //                     active: true
    //                 },
    //                 id
    //             }
    //         })
    //     },
    //     [],
    // );


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
                        icon={params.row.active ? <PauseCircleFilledRounded style={{ color: 'orange' }} /> : <PlayArrowRounded style={{ color: 'green' }} />}
                        label={params.row.active ? 'Pause' : 'Resume'}
                        // onClick={params.row.active ? pauseContact(params.id) : resumeContact(params.id)}
                        showInMenu
                        key='action1'
                    />,
                    <GridActionsCellItem
                        icon={<DeleteForeverRounded style={{ color: 'red' }} />}
                        label="Delete"
                        // onClick={deleteContact(params.id)}
                        showInMenu
                        key='action2'
                    />,
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
                // loading={activateStatus.loading || deactivateStatus.loading ? true : false}
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