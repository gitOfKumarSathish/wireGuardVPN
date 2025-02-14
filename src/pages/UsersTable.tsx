import * as React from 'react';
import { alpha } from '@mui/material/styles';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton,
    Tooltip, Skeleton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from '@tanstack/react-query';
import { base_path } from '../api/api';
import { useAtom } from 'jotai';
import { userAtom } from '../jotai/userAtom';
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
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof User) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell> */}
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align="left">
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
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

interface EnhancedTableToolbarProps {
    numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;
    return (
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
            <Typography sx={{ flex: '1 1 100%' }} variant="h6">
                Users
            </Typography>
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

const EnhancedTable = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof User>('username');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Fetch Authentication Token


    // Fetch Users from API
    const { isLoading, data: users = [] } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const authToken = getAuthToken();
            console.log(authToken);
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



    // Sorting
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Select/Deselect
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(users.map((user) => user.id));
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = selectedIndex === -1 ? [...selected, id] : selected.filter((item) => item !== id);
        setSelected(newSelected);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }}>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={users.length}
                        />
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: rowsPerPage }).map((_, index) => (
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
                                    <TableRow key={user.id} hover onClick={(event) => handleClick(event, user.id)}>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.peers}</TableCell>
                                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default EnhancedTable;
