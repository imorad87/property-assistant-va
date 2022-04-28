import { useMutation } from '@apollo/client';
import DeleteForeverRounded from '@mui/icons-material/DeleteForeverRounded';
import PauseCircleFilledRounded from '@mui/icons-material/PauseCircleFilledRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams, GridRowId, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridValueSetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import React from 'react';
import { ACTIVATE_CONTACT, DEACTIVATE_CONTACT } from '../../lib/mutations';
import Button from '../Button';

const LeadsDataTable = ({ contacts }) => {


    React.useState()

    const [activateContact, activateStatus] = useMutation(ACTIVATE_CONTACT);

    const [deactivateContact, deactivateStatus] = useMutation(DEACTIVATE_CONTACT);

    const router = useRouter();

    const viewContact = React.useCallback(
        (id: GridRowId) => () => {
            router.push(`/contacts/${id}`)
        },
        [],
    );

    const deleteContact = React.useCallback(
        (id: GridRowId) => () => {

        },
        [],
    );

    const pauseContact = React.useCallback(
        (id: GridRowId) => () => {
            deactivateContact({
                variables: {
                    input: {
                        id,
                        active: false
                    },
                    id
                }
            })
        },
        [],
    );

    const resumeContact = React.useCallback(

        (id: GridRowId) => () => {
            activateContact({
                variables: {
                    input: {
                        id,
                        active: true
                    },
                    id
                }
            })
        },
        [],
    );


    const columns = React.useMemo(
        () => [
            { field: 'id', headerName: 'ID', width: 150 },
            { field: 'first_name', headerName: 'First Name', width: 150 },
            { field: 'last_name', headerName: 'last Name', width: 150 },
            {
                field: 'active',
                headerName: 'Status',
                width: 150,
                renderCell: (params: GridRenderCellParams<Boolean>) => {
                    if (params.value) {
                        return <PlayArrowRounded style={{ color: 'green' }} />
                    }
                    return <PauseCircleFilledRounded style={{ color: 'orange' }} />
                },
            },
            { field: 'status', headerName: 'Contact Status', width: 150 },

            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<VisibilityOutlinedIcon color='primary' />}
                        label="View"
                        onClick={viewContact(params.id)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={params.row.active ? <PauseCircleFilledRounded style={{ color: 'orange' }} /> : <PlayArrowRounded style={{ color: 'green' }} />}
                        label={params.row.active ? 'Pause' : 'Resume'}
                        onClick={params.row.active ? pauseContact(params.id) : resumeContact(params.id)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<DeleteForeverRounded style={{ color: 'red' }} />}
                        label="Delete"
                        onClick={deleteContact(params.id)}
                        showInMenu
                    />,
                ],
            },

        ],
        [viewContact, deleteContact, pauseContact, resumeContact]
    );

    if (activateStatus.error) return <div>Submission error! {activateStatus.error.message}</div>;
    if (deactivateStatus.error) return <div>Submission error! {deactivateStatus.error.message}</div>;

    return (
        <div style={{ height: 700, width: '100%' }}>
            <div style={{ height: 700, width: '100%' }}>
                <DataGrid
                    rows={contacts}
                    columns={columns}
                    components={{
                        Toolbar: GridToolbar,
                        LoadingOverlay: LinearProgress,
                    }}
                    loading={activateStatus.loading || deactivateStatus.loading ? true : false}
                    pagination
                    checkboxSelection={true} />
            </div>
        </div>
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

export default LeadsDataTable