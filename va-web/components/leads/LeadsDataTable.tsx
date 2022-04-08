import React from 'react'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams, GridRowsProp, GridToolbar } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import ContactActionsDropdown from './ContactActionsDropdown';
import DeleteForeverRounded from '@mui/icons-material/DeleteForeverRounded';
import { useRouter } from 'next/router';

const LeadsDataTable = ({ contacts }) => {


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

        },
        [],
    );


    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'active', headerName: 'Comms Status', width: 150 },
        { field: 'status', headerName: 'Contact Status', width: 150 },

        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteForeverRounded />}
                    label="View"
                    onClick={viewContact(params.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteForeverRounded />}
                    label="Pause"
                    onClick={pauseContact(params.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteForeverRounded />}
                    label="Delete"
                    onClick={deleteContact(params.id)}
                    showInMenu
                />,
            ],
        },

    ];

    return (
        <div style={{ height: 700, width: '100%' }}>
            <div style={{ height: 700, width: '100%' }}>
                <DataGrid rows={contacts} columns={columns} components={{ Toolbar: GridToolbar }} pagination
                    checkboxSelection={true} />
            </div>
        </div>
    );
}

export default LeadsDataTable