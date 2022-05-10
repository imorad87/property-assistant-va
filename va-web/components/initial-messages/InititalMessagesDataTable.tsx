import { useMutation } from '@apollo/client';
import { DeleteForeverOutlined } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridRowId, GridRowModel, GridValueSetterParams } from '@mui/x-data-grid';
import React from 'react';
import { REMOVE_INITIAL_MESSAGE, UPDATE_INITIAL_MESSAGE } from '../../lib/mutations';


export default function InititalMessagesDataTable({ initialMessages }) {

    const [loading, setLoading] = React.useState(false);

    const [removeMessage] = useMutation(REMOVE_INITIAL_MESSAGE);
    const [updateMessage] = useMutation(UPDATE_INITIAL_MESSAGE);


    const deleteMessage = React.useCallback(
        (id: GridRowId) => async () => {
            setLoading(true)
            await removeMessage({
                variables: {
                    id
                }
            })
            setLoading(false)
        },
        [removeMessage],
    );




    const processRowUpdate = async (params: GridCellEditCommitParams) => {
        // Make the HTTP request to save in the backend
        const response = await updateMessage({
            variables: {
                input: {
                    id: params.id,
                    message: params.value
                }
            }
        })
    }


    const columns = React.useMemo(() => [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'message',
            headerName: 'Message',
            flex: 1,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteForeverOutlined style={{ color: red[700] }} />}
                    label="View"
                    onClick={deleteMessage(params.id)}
                    key='action01'
                />
            ]
        }
    ], [deleteMessage]);
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={initialMessages}
                columns={columns}
                components={{
                    LoadingOverlay: LinearProgress,
                }}
                pagination
                disableSelectionOnClick
                loading={loading}
                onCellEditCommit={processRowUpdate}
            />
        </div>
    );
}
