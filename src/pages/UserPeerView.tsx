import { useNavigate, useParams } from 'react-router-dom';// Ensure this path is correct
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Box, Button, InputAdornment, Skeleton, Stack, TextField, Card,
    CardActionArea, CardContent, Typography, FormControlLabel, Switch,
    CircularProgress, IconButton, Menu, MenuItem,
    Tooltip
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base_path } from '../api/api';
import { AnimatedModal, AnimatedModalObject, ModalAnimation } from '@dorbus/react-animated-modal';
import { useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { userAtom } from '../jotai/userAtom';
import { getAuthToken } from '../api/getAuthToken';
import { useSnackbar } from 'notistack';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { formatDataSize, formatTimeAgo, peerStatus } from '../utils/Formater';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


const UserPeerView = () => {
    const user = useAtomValue(userAtom);
    const ref = useRef<AnimatedModalObject>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { id, username } = useParams();

    // State variables
    const [deviceName, setDeviceName] = useState("");
    const [ipAddress, setIpAddress] = useState("");
    const [isAutoIP, setIsAutoIP] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedPeer, setSelectedPeer] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // console.log(isDeleteModalOpen);

    // ✅ Open Modal - Reset fields before opening
    const configModal = (peer: any) => {
        console.log("peer found", peer);
        if (peer) {
            setDeviceName(peer.peer_name);
            setIpAddress(peer.assigned_ip);
            setIsAutoIP(peer.assigned_ip === "Auto Assigned");
            setSelectedPeer(peer);
            setIsEditMode(true);
        } else {
            setDeviceName("");
            setIpAddress("");
            setIsAutoIP(false);
            setIsEditMode(false);
        }
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

    // Fetch Peers List with polling every 10 seconds
    const { isLoading, data: peers = [] } = useQuery({
        queryKey: ["peers"],
        queryFn: async () => {
            const authToken = getAuthToken();

            const response = await fetch(`${base_path}/api/peers/users/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch peers.");
            }
            return response.json();
        },
        refetchInterval: 10000, // Poll every 10 seconds
    });

    // Mutation to Add Peer
    const mutation = useMutation({
        mutationFn: async (formData: any) => {
            const authToken = getAuthToken();
            const response = await fetch(`${base_path}/api/peers/${id}`, {
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
        if (isEditMode) {
            console.log(isEditMode);
            updatemutation.mutate({
                peer_name: deviceName,
                ip: isAutoIP ? "" : ipAddress,
            });
            return;
        }
        mutation.mutate({
            peer_name: deviceName,
            ip: isAutoIP ? "" : ipAddress,
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

    // Mutation to update Peer
    const updatemutation = useMutation({
        mutationFn: async (formData: any) => {
            const authToken = getAuthToken();
            const response = await fetch(`${base_path}/api/peers/${selectedPeer.id}`, {
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

    // Mutation to delete Peer
    const deleteMutation = useMutation({
        mutationFn: async (peerId) => {
            const authToken = getAuthToken();
            const response = await fetch(`${base_path}/api/peers/${peerId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to delete peer.");
            }
            return response.json();
        },
        onError: (error) => {
            enqueueSnackbar(error.message, { variant: "error", autoHideDuration: 2000 });
        },
        onSuccess: async () => {
            enqueueSnackbar("Peer Deleted Successfully!", { variant: "success", autoHideDuration: 2000 });

            // Refresh peers list
            await queryClient.invalidateQueries({ queryKey: ["peers"] });
        },
    });

    // Handle Delete Confirmation
    const handleDeleteConfirm = () => {
        deleteMutation.mutate(selectedPeer.id);
        setIsDeleteModalOpen(false);
        handleCloseMenu();
    };

    return (
        <div className='w-full'>
            {/* Header */}
            <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-md'>
                <h1 className='text-2xl font-medium capitalize'>{username}-Peers</h1>

                {/* Buttons & Search */}
                <Stack direction="row" spacing={2}>
                    <Button onClick={() => configModal("")} variant="contained" startIcon={<AddOutlinedIcon fontSize='small' />}>
                        Peer
                    </Button>
                    <Button variant="outlined" startIcon={<DownloadOutlinedIcon fontSize='medium' />}>
                        Download All
                    </Button>
                </Stack>
            </div>

            {/* Peers List */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4 gap-4'>
                {isLoading ? (
                    <Stack spacing={2} className="mt-10">
                        {[1, 2, 3, 4].map((index) => (
                            <Card key={index} sx={{ maxWidth: 600 }} className="shadow-md">
                                <CardContent>
                                    <Skeleton variant="text" width="80%" height={30} />
                                    <Skeleton variant="text" width="90%" height={20} />
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    peers.length > 0 && peers.map((peer: any) => (
                        <Card key={peer.id} sx={{ maxWidth: 500 }} className=" shadow-md cursor-pointer ">
                            {/* Ensure only clicking on CardContent navigates, not on the Kebab Menu */}
                            <CardActionArea
                                onClick={() => {
                                    if (!menuAnchor) {
                                        navigate(`/peers/${peer.id}`);
                                    }
                                }}
                            >
                                <CardContent className=''>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <div className="relative flex items-center">
                                                <span className={`absolute inline-flex h-full w-full rounded-full ${peerStatus(peer.latest_handshake) ? "bg-green-500" : "bg-red-500"} opacity-75 animate-ping`}></span>
                                                <Tooltip title="Status" arrow placement='top'>
                                                    <FiberManualRecordIcon fontSize="small" className={`${peerStatus(peer.latest_handshake) ? "text-green-500 " : "text-red-500"} relative`} />
                                                </Tooltip>
                                            </div>
                                        </div>


                                        <div className='flex items-center'>
                                            <Tooltip title="RX value" arrow placement='top'>
                                                <ArrowUpwardIcon fontSize="small" className="text-blue-500" />
                                            </Tooltip>
                                            <Typography className='text-xs'> {formatDataSize(peer?.rx)}</Typography>
                                        </div>
                                        <div className='flex items-center '>
                                            <Tooltip title="TX value" arrow placement='top'>
                                                <ArrowDownwardIcon fontSize="small" className="text-blue-500" />
                                            </Tooltip>
                                            <Typography className='text-xs'>{formatDataSize(peer?.tx)}</Typography>
                                        </div>

                                        <div className='flex items-center '>
                                            <Tooltip title="Last Handshake" arrow placement='top'>
                                                <AccessTimeIcon fontSize="small" className="text-blue-500" />
                                            </Tooltip>
                                            <Typography className='text-xs'>{formatTimeAgo(peer?.latest_handshake)}</Typography>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4 ">
                                        <Typography variant='h5' className='capitalize'>{peer?.peer_name}</Typography>
                                        {/* Kebab Menu Button */}
                                        <IconButton
                                            onClick={(event) => {
                                                event.stopPropagation(); // Prevents navigation
                                                handleMenuClick(event, peer);
                                            }}
                                            aria-label="settings"
                                        >
                                            <MoreVertIcon
                                                className="text-blue-500"

                                            />
                                        </IconButton>

                                        {/* Dropdown Menu */}
                                        <Menu
                                            anchorEl={menuAnchor}
                                            open={Boolean(menuAnchor && selectedPeer?.id === peer.id)}
                                            onClose={handleCloseMenu}
                                        >
                                            <MenuItem onClick={() => { handleCloseMenu(); configModal(peer); }}>Edit</MenuItem>
                                            <MenuItem onClick={() => { setIsDeleteModalOpen(true); }}>Delete</MenuItem>
                                        </Menu>
                                    </div>

                                    <Typography variant="body1">PublicKey</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                                        {peer.public_key}
                                    </Typography>


                                    <Typography variant="body1">IP Address</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                                        {peer.assigned_ip}
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

            {/* ✅ Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    handleOpen={isDeleteModalOpen}
                    handleClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default UserPeerView;