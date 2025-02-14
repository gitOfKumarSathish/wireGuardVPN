import {
    Box, Button, InputAdornment, Stack, TextField, Typography, MenuItem,
    Select, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import React, { useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { AnimatedModal, AnimatedModalObject, ModalAnimation } from '@dorbus/react-animated-modal';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EnhancedTable from './UsersTable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base_path } from '../api/api';
import { useSnackbar } from 'notistack';
import { getAuthToken } from '../api/getAuthToken';

export const Users = () => {
    const ref = useRef<AnimatedModalObject>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Track modal state
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient(); // ✅ React Query Client for refetching data

    // ✅ Open Modal and update state
    const configModal = () => {
        setUser('');
        setPassword('');
        setRole('');
        setIsModalOpen(true);
        ref.current?.OpenModal(ModalAnimation.Unfold);
    };

    // ✅ Close Modal properly
    const handleCloseModal = () => {
        setIsModalOpen(false); // ✅ Update modal state
        setTimeout(() => {
            ref.current?.CloseModal(); // ✅ Close modal after ensuring state is updated
        }, 100); // Delay to ensure React state updates before closing modal
    };

    // Mutation to Add User
    const mutation = useMutation({
        mutationFn: async (formData: any) => {
            const authToken = getAuthToken();
            const response = await fetch(`${base_path}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw (data.detail);
            }
            return response.json();
        },
        onError: (error) => {
            setIsLoading(false);
            enqueueSnackbar({ message: `${error}`, variant: "error", autoHideDuration: 2000 });
        },
        onSuccess: async () => {
            enqueueSnackbar({ message: "User Added Successfully!", variant: "success", autoHideDuration: 2000 });

            // ✅ Wait for the user list to refetch **before closing the modal**
            await queryClient.invalidateQueries({ queryKey: ['users'] });

            setIsLoading(false);
            handleCloseModal(); // ✅ Close modal only after refetching completes
        },
    });

    // Handle Submit
    const handleSubmit = () => {
        setIsLoading(true);
        mutation.mutate({ username: user, password: password, role: role });
    };

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-md'>
                <h1 className='text-2xl font-medium'>Users</h1>

                {/* Buttons & Search */}
                <Stack direction="row" spacing={2}>
                    <Button
                        onClick={configModal}
                        variant="contained"
                        startIcon={<AddOutlinedIcon fontSize='small' />}
                    >
                        Add User
                    </Button>
                    <Button variant="outlined" startIcon={<DownloadOutlinedIcon fontSize='medium' />}>
                        Download All
                    </Button>

                    {/* Search Box */}
                    <TextField
                        variant="outlined"
                        placeholder="Search Users..."
                        size="small"
                        sx={{ width: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
            </div>

            <div className='mt-4'>
                <EnhancedTable />
            </div>

            {/* ✅ Show Modal only if it's open */}
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
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="maintainer">Maintainer</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Buttons */}
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
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
        </div>
    );
};
