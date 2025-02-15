import * as React from 'react';
import { alpha } from '@mui/material/styles';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TableSortLabel, Toolbar, Typography, Paper, IconButton, Tooltip, Skeleton, Menu, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from '@tanstack/react-query';
import { base_path } from '../api/api';
import { getAuthToken } from '../api/getAuthToken';

// Define user structure based on API response
interface User {
    id: string;
    username: string;
    role: string;
    peers: string;
    created_at: string;
}

// Sorting types
type Order = 'asc' | 'desc';

// Sorting helper functions
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Table header columns
const headCells = [
    { id: 'username', label: 'Username' },
    { id: 'role', label: 'Role' },
    { id: 'peers', label: 'Peers' },
    { id: 'created_at', label: 'Created At' },
    { id: 'actions', label: 'Actions' }, // Added Actions column
];

const EnhancedTableHead: React.FC<{ order: Order, orderBy: keyof User, onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void; }> = ({ order, orderBy, onRequestSort }) => {
    const createSortHandler = (property: keyof User) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align="left">
                        {headCell.id !== 'actions' ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id as keyof User)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            headCell.label
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const EnhancedTable = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof User>('username');
    const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

    const { isLoading, data: users = [] } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const authToken = getAuthToken();
            if (!authToken) throw new Error("No auth token found");

            const response = await fetch(`${base_path}/api/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData.detail;
            }

            return response.json();
        }
    });

    // Sorting handler
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle Menu Click (Open)
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
        setSelectedUser(userId);
        setMenuAnchor(event.currentTarget);
    };

    // Handle Menu Close
    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedUser(null);
    };

    // Handle Edit Action
    const handleEdit = () => {
        alert(`Edit user: ${selectedUser}`);
        handleMenuClose();
    };

    // Handle Delete Action
    const handleDelete = () => {
        alert(`Delete user: ${selectedUser}`);
        handleMenuClose();
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }}>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        {headCells.map((_, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                <Skeleton variant="text" width="100%" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.peers}</TableCell>
                                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={(event) => handleMenuOpen(event, user.id)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Kebab Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" /> Delete
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default EnhancedTable;
