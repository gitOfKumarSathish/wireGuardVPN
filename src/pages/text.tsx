import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import {
    Avatar, Box, Button, InputAdornment, Skeleton, Stack, TextField, Tooltip, Card,
    CardActionArea, CardContent, Typography,
    FormControlLabel,
    Switch,
    CircularProgress
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base_path } from '../api/api';
import { AnimatedModal, AnimatedModalObject, ModalAnimation } from '@dorbus/react-animated-modal';
import { useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { userAtom } from '../jotai/userAtom';
import { getAuthToken } from '../api/getAuthToken';
import { useSnackbar } from 'notistack';



const Peers = () => {
    const user = useAtomValue(userAtom);
    const ref = useRef<AnimatedModalObject>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    // State variables
    const [deviceName, setDeviceName] = useState("");
    const [ipAddress, setIpAddress] = useState("");
    const [isAutoIP, setIsAutoIP] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // ✅ Open Modal - Reset fields before opening
    const configModal = (p0: string) => {
        setDeviceName("");
        setIpAddress("");
        setIsAutoIP(false);
        setIsModalOpen(true);
        setTimeout(() => {
            if (ref.current) {
                ref.current.OpenModal(ModalAnimation.Unfold);
            }
        }, 100);
    };

    // ✅ Close Modal - Ensures proper cleanup
    const handleCloseModal = () => {
        setIsModalOpen(false); // ✅ Update modal state
        setDeviceName(""); // ✅ Reset fields on close
        setIpAddress("");
        setIsAutoIP(false);

        if (ref.current) {
            ref.current.CloseModal();
        }
    };
    // Fetch Peers List
    const { isError, data: peers = [], error } = useQuery({
        queryKey: ["peers"],
        queryFn: async () => {
            const response = await fetch(`${base_path}/api/peers`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch peers.");
            }
            return response.json();
        },
    });

    // Mutation to Add Peer
    const mutation = useMutation({
        mutationFn: async (formData: any) => {
            const authToken = getAuthToken();
            const response = await fetch(`${base_path}/api/peers/${user.id}`, {
                method: "POST",
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
        onError: (error) => {
            setIsSubmitting(false);
            enqueueSnackbar(error.message, { variant: "error", autoHideDuration: 2000 });
        },
        onSuccess: async () => {
            enqueueSnackbar("Peer Added Successfully!", { variant: "success", autoHideDuration: 2000 });

            // ✅ Wait for refetch before closing modal
            await queryClient.invalidateQueries({ queryKey: ["peers"] });
            setIsSubmitting(false);
            handleCloseModal();
        },
    });

    // Handle Form Submission
    const handleSubmit = () => {
        if (!deviceName.trim()) {
            enqueueSnackbar("Device Name is required.", { variant: "warning", autoHideDuration: 2000 });
            return;
        }
        setIsSubmitting(true);
        mutation.mutate({
            peer_name: deviceName,
            ipAddress: isAutoIP ? "Auto Assigned" : ipAddress,
        });
    };

    return (
        <div className='w-full'>
            {/* Header */}
            <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-md'>
                <h1 className='text-2xl font-medium'>Peers</h1>

                {/* Buttons & Search */}
                <Stack direction="row" spacing={2}>
                    <Button onClick={() => configModal('Peer-Configuration Content')} variant="contained" startIcon={<AddOutlinedIcon fontSize='small' />}>
                        Peer
                    </Button>
                    <Button variant="outlined" startIcon={<DownloadOutlinedIcon fontSize='medium' />}>
                        Download All
                    </Button>

                    {/* Search Box */}
                    <TextField
                        variant="outlined"
                        placeholder="Search Peers..."
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

            {/* Skeleton Loading for Peers */}
            {isLoading ? (
                // Display skeletons when loading
                <Stack spacing={2} className="mt-10">
                    {[1, 2, 3, 4].map((index) => (
                        <Card key={index} sx={{ maxWidth: 400 }} className="shadow-md">
                            <CardActionArea>
                                <CardContent>
                                    {/* Status Icon Skeleton */}
                                    <Skeleton variant="circular" width={24} height={24} />

                                    {/* Peer Name Skeleton */}
                                    <Skeleton variant="text" width="80%" height={30} />

                                    {/* Public Key Skeleton */}
                                    <Skeleton variant="text" width="90%" height={20} />

                                    {/* Allowed IP Skeleton */}
                                    <Skeleton variant="text" width="60%" height={20} />

                                    {/* Traffic Stats Skeleton */}
                                    <Stack direction="row" spacing={2} className="mt-4">
                                        <Skeleton variant="rectangular" width={60} height={20} />
                                        <Skeleton variant="rectangular" width={60} height={20} />
                                        <Skeleton variant="rectangular" width={80} height={20} />
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Stack>
            ) : (
                // Render actual data when not loading
                peers?.length > 0 && peers?.map((peer: any) => (
                    <Card key={peer.id} sx={{ maxWidth: 400 }} className="mt-10 shadow-md">
                        <CardActionArea onClick={() => navigate(`/peers/${peer.id}`)}>
                            <CardContent>
                                {/* Peer Status */}
                                <div className='flex justify-between items-center'>
                                    <Box sx={{ margin: 1, width: '100%' }}>
                                        <Tooltip title="Status" arrow placement='top'>
                                            <FiberManualRecordIcon fontSize="small" className="text-green-500" />
                                        </Tooltip>
                                    </Box>
                                    <div className='flex gap-4'>
                                        <div className='flex items-center'>
                                            <NorthOutlinedIcon fontSize='small' />
                                            <Typography variant="body1">{peer.upload || "0.00000"} GB</Typography>
                                        </div>
                                        <div className='flex items-center'>
                                            <SouthOutlinedIcon fontSize='small' />
                                            <Typography variant="body1">{peer.download || "0.00000"} GB</Typography>
                                        </div>
                                        <Typography variant="body1">{peer.last_seen || "N/A Ago"}</Typography>
                                    </div>
                                </div>

                                {/* Peer Details */}
                                <Typography variant="h5">{peer.peer_name}</Typography>
                                <Typography variant="body1">Public Key</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                                    {peer.public_key}
                                </Typography>
                                <Typography variant="body1">Allowed IP</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                                    {peer.assigned_ip}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))
            )}

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
                        Add Device Details
                    </Typography>

                    <Stack spacing={2} mt={2}>
                        {/* Device Name Input */}
                        <TextField
                            label="Device Name"
                            variant="outlined"
                            fullWidth
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                        />

                        {/* ✅ Toggle for Auto IP Assignment */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isAutoIP}
                                    onChange={(e) => setIsAutoIP(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Auto Assign IP"
                        />

                        {/* ✅ IP Address Input - Disabled if Switch is ON */}
                        <TextField
                            label="IP Address"
                            variant="outlined"
                            fullWidth
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            disabled={isAutoIP} // ✅ Disables input when switch is ON
                        />

                        {/* Buttons */}
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={isLoading} // ✅ Disable while loading
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : "Save"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleCloseModal} // ✅ Now closes properly
                                disabled={isSubmitting} // ✅ Prevent closing when loading
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </AnimatedModal>
        </div>
    );
};

export default Peers;
