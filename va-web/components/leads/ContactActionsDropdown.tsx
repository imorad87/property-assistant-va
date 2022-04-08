import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';

const options = [
    'Open',
    'Pause',
    'Delete',
];

const ITEM_HEIGHT = 48;

export default function ContactActionsDropdown({ active, id }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >

                <MenuItem key='1'  >
                    <Link href={`contacts/${id}`}>
                        Open
                    </Link>
                </MenuItem>
                <MenuItem key={2} onClick={handleClose}>
                    {active ? 'Pause' : 'Resume'}
                </MenuItem>
                <MenuItem key={3} onClick={handleClose}>
                    Delete
                </MenuItem>

            </Menu>
        </div>
    );
}
