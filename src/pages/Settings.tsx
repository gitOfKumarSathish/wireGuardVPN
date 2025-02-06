import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import { Button, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea'; // Import CardActionArea
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Peers1 = () => {
    const navigate = useNavigate(); // Initialize navigation

    const handleCardClick = (publicKey: string) => {
        navigate(`/peers/${publicKey}`); // Navigate to the dynamic route
    };

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-md'>
                <h1 className='text-2xl font-medium'>Peers</h1>
                {/* Buttons */}
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" startIcon={<AddOutlinedIcon fontSize='small' />}>
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

            {/* Clickable Card with CardActionArea */}
            <Card sx={{ maxWidth: 400 }} className="mt-10 shadow-md">
                <CardActionArea onClick={() => handleCardClick("htnPHOOOOOOksbcksabcjnacjanchabsgcastfchjcbcnacb")}>
                    <CardContent>
                        <div className='flex justify-between items-center'>
                            <div className="relative flex items-center">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                <Tooltip title="Status" arrow placement='top'>
                                    <FiberManualRecordIcon fontSize="small" className="text-green-500 relative" />
                                </Tooltip>
                            </div>
                            <div className='flex gap-4'>
                                <div className='flex items-center'>
                                    <NorthOutlinedIcon fontSize='small' />
                                    <Typography variant="body1">0.00000 GB</Typography>
                                </div>
                                <div className='flex items-center'>
                                    <SouthOutlinedIcon fontSize='small' />
                                    <Typography variant="body1">0.00000 GB</Typography>
                                </div>
                                <Typography variant="body1">N/A Ago</Typography>
                            </div>
                        </div>

                        <div className='mt-4'>
                            <Typography variant="h5">hari's Avita</Typography>
                        </div>

                        <div className='mt-4'>
                            <Typography variant="body1">Public Key</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word'
                                }}
                            >
                                htnPHOOOOOOksbcksabcjnacjanchabsgcastfchjcbcnacb
                            </Typography>
                        </div>

                        <div className='mt-2'>
                            <Typography variant="body1">Allowed IP</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word'
                                }}
                            >
                                10.0.0.1/32
                            </Typography>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
};

export default Peers1;
