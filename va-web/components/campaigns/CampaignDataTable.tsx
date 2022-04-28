import PauseCircleFilledRounded from '@mui/icons-material/PauseCircleFilledRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import React from 'react';

const CampaignsDataTable = ({ campaigns }) => {

    const columns = React.useMemo(
        () => [
            {
                field: 'id',
                headerName: 'ID'
            },
            {
                field: 'title',
                headerName: 'Title',
                width: 250
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 150
                // renderCell: (params: GridRenderCellParams<Boolean>) => {
                //     if (params.row. === 'all-active') {
                //         return <PlayArrowRounded style={{ color: 'green' }} />
                //     }
                //     return <PauseCircleFilledRounded style={{ color: 'orange' }} />
                // },
            },
            {
                field: 'parsing_status',
                headerName: 'Parsing Status',
                width: 150
            },
            {
                field: 'total_records',
                headerName: 'Total'
            },
            {
                field: 'duplicates_count',
                headerName: 'Duplicates'
            },
            {
                field: 'success_count',
                headerName: 'Uploaded'
            },
            {
                field: 'failed_count',
                headerName: 'Failed'
            },
            {
                field: 'created_at',
                headerName: 'Created',
                valueGetter: (params) => moment(params.value).fromNow()

            },
        ],
        []
    );



    return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid
                rows={campaigns}
                columns={columns}
                components={{
                    Toolbar: GridToolbar,
                    LoadingOverlay: LinearProgress,
                }}
                pagination

            />
        </div>
    );
}




export default CampaignsDataTable