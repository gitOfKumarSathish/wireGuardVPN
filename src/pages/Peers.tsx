import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Box, Button, InputAdornment, Skeleton, Stack, TextField, Card,
    CardActionArea, CardContent, Typography, FormControlLabel, Switch,
    CircularProgress, IconButton, Menu, MenuItem
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base_path } from '../api/api';
import { AnimatedModal, AnimatedModalObject, ModalAnimation } from '@dorbus/react-animated-modal';
import { useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../jotai/userAtom';
import { getAuthToken } from '../api/getAuthToken';
import { useSnackbar } from 'notistack';

const Peers = () => {
    const [user] = useAtom(userAtom);
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
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedPeer, setSelectedPeer] = useState<any>(null);

    // ✅ Open Modal - Reset fields before opening
    const configModal = () => {
        setDeviceName("");
        setIpAddress("");
        setIsAutoIP(false);
        setIsModalOpen(true);
        setTimeout(() => ref.current?.OpenModal(ModalAnimation.Unfold), 100);
    };

    // ✅ Close Modal properly
    const handleCloseModal = () => {
        if (ref.current) {
            ref.current.CloseModal();
        }
        setTimeout(() => {
            setIsModalOpen(false);
            setDeviceName("");
            setIpAddress("");
            setIsAutoIP(false);
        }, 300); // Small delay to ensure modal animation
    };

    // Fetch Peers List
    const { isLoading, data: peers = [] } = useQuery({
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

            // ✅ Refresh peers before closing modal
            await queryClient.invalidateQueries({ queryKey: ["peers"] });
            setIsSubmitting(false);

            // ✅ Close modal smoothly
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

    // ✅ Handle Kebab Menu Click
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, peer: any) => {
        event.stopPropagation(); // Prevents card click navigation
        setMenuAnchor(event.currentTarget);
        setSelectedPeer(peer);
    };

    // ✅ Handle Menu Close
    const handleCloseMenu = () => {
        setMenuAnchor(null);
        setSelectedPeer(null);
    };

    return (
        <div className='w-full'>
            {/* Header */}
            <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-md'>
                <h1 className='text-2xl font-medium'>Peers</h1>

                {/* Buttons & Search */}
                <Stack direction="row" spacing={2}>
                    <Button onClick={configModal} variant="contained" startIcon={<AddOutlinedIcon fontSize='small' />}>
                        Peer
                    </Button>
                    <Button variant="outlined" startIcon={<DownloadOutlinedIcon fontSize='medium' />}>
                        Download All
                    </Button>
                </Stack>
            </div>

            {/* Peers List */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4'>
                {isLoading ? (
                    <Stack spacing={2} className="mt-10">
                        {[1, 2, 3, 4].map((index) => (
                            <Card key={index} sx={{ maxWidth: 400 }} className="shadow-md">
                                <CardContent>
                                    <Skeleton variant="text" width="80%" height={30} />
                                    <Skeleton variant="text" width="90%" height={20} />
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    peers.length > 0 && peers.map((peer: any) => (
                        <Card key={peer.id} sx={{ maxWidth: 400 }} className="mt-10 shadow-md">
                            <CardActionArea onClick={() => navigate(`/peers/${peer.id}`)}>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <Typography variant="h5">{peer.peer_name}</Typography>

                                        {/* Kebab Menu Button */}
                                        <IconButton onClick={(event) => handleMenuClick(event, peer)} aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>

                                        {/* Dropdown Menu */}
                                        <Menu
                                            anchorEl={menuAnchor}
                                            open={Boolean(menuAnchor)}
                                            onClose={handleCloseMenu}
                                        >
                                            <MenuItem onClick={handleCloseMenu}>Edit</MenuItem>
                                            <MenuItem onClick={handleCloseMenu}>Delete</MenuItem>
                                        </Menu>
                                    </div>

                                    <Typography variant="body1">Public Key</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                                        {peer.public_key}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                )}
            </div>

            {/* ✅ Modal Component */}
            {isModalOpen && (
                <AnimatedModal
                    ref={ref}
                    animation={ModalAnimation.Unfold}
                    closeOnBackgroundClick={true}
                    backgroundStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <Box sx={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", width: "400px", boxShadow: 3, textAlign: "center" }}>
                        <Typography variant="h6" fontWeight="bold">
                            Add Device Details
                        </Typography>

                        <Stack spacing={2} mt={2}>
                            <TextField label="Device Name" variant="outlined" fullWidth value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />


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

                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? <CircularProgress size={24} /> : "Save"}
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleCloseModal} disabled={isSubmitting}>
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

export default Peers;
