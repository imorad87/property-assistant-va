import React from 'react'
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid';

const LeadsDataTable = () => {
    const rows: GridRowsProp = [
        { id: 1, col1: 'Islam Morad', col2: '150' },
        { id: 2, col1: 'DataGridPro', col2: '10' },
        { id: 3, col1: 'MUI', col2: '8' },
        { id: 4, col1: 'MUI', col2: '8' },
        { id: 5, col1: 'MUI', col2: '8' },
        { id: 6, col1: 'MUI', col2: '8' },
        { id: 7, col1: 'MUI', col2: '8' },

    ];

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Name', width: 150 },
        { field: 'col2', headerName: 'Numbers', width: 150 },
        { field: 'col3', headerName: 'Status', width: 150 },
        { field: 'col4', headerName: 'Actions', width: 150 },

    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <div style={{ height: 350, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} components={{ Toolbar: GridToolbar }} pagination
                    checkboxSelection={true} />
            </div>
        </div>
    );
}

export default LeadsDataTable