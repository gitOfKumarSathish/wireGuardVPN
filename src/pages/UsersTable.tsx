import * as React from 'react';
import { alpha } from '@mui/material/styles';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TableSortLabel, Toolbar, Typography, Paper, IconButton, Tooltip, Skeleton, Menu, MenuItem,
    FormControl,
    TextField,
    InputLabel,
    Select,
    Stack,
    Button,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { visuallyHidden } from '@mui/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base_path } from '../api/api';
import { getAuthToken } from '../api/getAuthToken';
import { enqueueSnackbar } from 'notistack';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { AnimatedModal, AnimatedModalObject, ModalAnimation } from '@dorbus/react-animated-modal';


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
    const ref = React.useRef<AnimatedModalObject>(null);

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof User>('username');
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false); // ✅ Track modal state
    const queryClient = useQueryClient();
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('');


    const configModal = () => {
        setUser(selectedUser.username);
        setPassword("");
        setRole(selectedUser.role_id);
        setIsModalOpen(true);
        ref.current?.OpenModal(ModalAnimation.Unfold);
    };

    React.useEffect(() => {
        if (isModalOpen) {
            ref.current?.OpenModal(ModalAnimation.Unfold);
        }
    }, [isModalOpen]);

    // ✅ Close Modal properly
    const handleCloseModal = () => {
        setIsModalOpen(false); // ✅ Update modal state
        setTimeout(() => {
            ref.current?.CloseModal(); // ✅ Close modal after ensuring state is updated
        }, 100); // Delay to ensure React state updates before closing modal
    };

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


    // api for users roles
    const { data: roleData } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const authToken = getAuthToken();
            if (!authToken) throw new Error("No auth token found");
            const response = await fetch(`${base_path}/api/roles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData.detail;
            }

            return response.json();
        },

    });
    console.log(roleData);

    // api call delete
    const deleteMutation = useMutation({
        mutationFn: async (formData: any) => {
            const authToken = getAuthToken();
            const response = await fetch(`${base_path}/api/users/${selectedUser.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to add peer.");
            }
            return response.json();
        },
    });
    console.log(selectedUser);



    // Sorting handler
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle Menu Click (Open)
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: any) => {
        setSelectedUser(user);
        setMenuAnchor(event.currentTarget);
    };

    // Handle Menu Close
    const handleMenuClose = () => {
        setMenuAnchor(null);
        setIsDeleteModalOpen(false);
    };

    // Handle Delete Action
    const handleDelete = () => {
        deleteMutation.mutate("", {
            onSuccess: async (data: any) => {
                enqueueSnackbar({ message: `${data.message}`, variant: "success", autoHideDuration: 2000, });
                handleMenuClose();
                await queryClient.invalidateQueries({ queryKey: ['users'] });

            },
            onError: (error: any) => {
                enqueueSnackbar({ message: `${error}`, variant: "error", autoHideDuration: 2000, });
                handleMenuClose();
            }
        });
    };


    // api call delete
    const editMutation = useMutation({
        mutationFn: async (formData: any) => {
            const authToken = getAuthToken();
            const response = await fetch(`${base_path}/api/users/${selectedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to add peer.");
            }
            return response.json();
        },
    });
    console.log(selectedUser);

    // Handle Submit
    const handleEdit = () => {
        if (!selectedUser) {
            enqueueSnackbar({ message: "No user selected", variant: "error", autoHideDuration: 2000 });
            return;
        }
        console.log("i am in");
        editMutation.mutate({ username: user, password: password, role_id: role },
            {
                onSuccess: async (data: any) => {
                    enqueueSnackbar({ message: `${data.message}`, variant: "success", autoHideDuration: 2000, });
                    handleMenuClose();
                    setIsModalOpen(false);
                    await queryClient.invalidateQueries({ queryKey: ['users'] });

                },
                onError: (error: any) => {
                    enqueueSnackbar({ message: `${error}`, variant: "error", autoHideDuration: 2000, });
                    handleMenuClose();
                }
            }
        );
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
                                users.map((user: any) => (
                                    <TableRow key={user?.id} hover>
                                        <TableCell>{user?.username}</TableCell>
                                        <TableCell>{user?.role?.role}</TableCell>
                                        <TableCell>{user?.peer_count}</TableCell>
                                        <TableCell>{new Date(user?.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={(event) => handleMenuOpen(event, user)}>
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
                <MenuItem onClick={() => { handleMenuClose(); configModal(); }}>
                    <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); setIsDeleteModalOpen(true); }}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" /> Delete
                </MenuItem>
            </Menu>



            {isModalOpen && (
                <AnimatedModal
                    ref={ref}
                    animation={ModalAnimation.Unfold}
                    closeOnBackgroundClick={true}
                    backgroundStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            padding: "24px",
                            borderRadius: "8px",
                            width: "400px",
                            boxShadow: 3,
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Add User Details
                        </Typography>

                        <Stack spacing={2} mt={2}>
                            {/* User Name Input */}
                            <TextField
                                label="User Name"
                                variant="outlined"
                                fullWidth
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />

                            {/* Password Input */}
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {/* Role Dropdown */}
                            <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    label="Role"
                                >
                                    {roleData?.map((role: any) => (
                                        <MenuItem key={role.id} value={role.id}>{role.role}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Buttons */}
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEdit}
                                    disabled={isLoading} // ✅ Disable while loading
                                >
                                    {isLoading ? <CircularProgress size={24} /> : "Save"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleCloseModal} // ✅ Now closes properly
                                    disabled={isLoading} // ✅ Prevent closing when loading
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </AnimatedModal>
            )}

            {/* ✅ Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    handleOpen={isDeleteModalOpen}
                    handleClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </Box>


    );
};

export default EnhancedTable;
