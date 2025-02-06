import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FlightIcon from '@mui/icons-material/Flight';
import HomeIcon from '@mui/icons-material/Home';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import { Card, CardContent, Divider, IconButton, Tooltip, Typography } from '@mui/material';

import Charts from './Charts';

const PeerDetails = () => {
    const { publicKey } = useParams(); // Get the public key from the URL
    const [copied, setCopied] = useState(false);
    const ipAddressRef = useRef<HTMLSpanElement>(null); // Reference to the IP text

    // Function to copy only the text
    const handleCopy = () => {
        if (ipAddressRef.current) {
            const ipText = ipAddressRef.current.innerText; // Get the text content
            navigator.clipboard.writeText(ipText); // Copy text to clipboard

            setCopied(true); // Show copied tooltip
            setTimeout(() => setCopied(false), 1500); // Reset after 1.5 sec
        }
    };

    return (
        <div className="w-full h-screen">
            <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-md'>
                <div>
                    <h1 className='text-2xl font-medium'>hari's avita</h1>
                </div>
                <div className='flex items-center gap-4'>
                    <Tooltip title="QR Code" arrow placement='top'>
                        <QrCodeScannerIcon />
                    </Tooltip>
                    <Tooltip title="Share" arrow placement='top'>
                        <ShareOutlinedIcon />
                    </Tooltip>
                    <Tooltip title="Download" arrow placement='top'>
                        <FileDownloadOutlinedIcon />
                    </Tooltip>
                    <Tooltip title="Peer-Configuration" arrow placement='top'>
                        <TuneIcon />
                    </Tooltip>
                    <Tooltip title="Delete" arrow placement='top'>
                        <DeleteOutlineIcon />
                    </Tooltip>

                    {/* Pulsing dot effect */}
                    <div className="relative flex items-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                        <Tooltip title="Status" arrow placement='top'>
                            <FiberManualRecordIcon fontSize="small" className="text-red-500 relative" />
                        </Tooltip>
                    </div>
                </div>
            </div>

            <Divider className='divider' />
            <section>
                <div className="cards topMenu">
                    <Card sx={{ minWidth: '24%' }}>
                        <CardContent>
                            <div className='card-content'>
                                <div>
                                    <div className='card-content'>
                                        <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                            IP Address
                                        </Typography>

                                        <Tooltip title={copied ? "Copied!" : "Copy IP"} arrow>
                                            <IconButton onClick={handleCopy} size="small">
                                                <ContentCopyOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>
                                        <span ref={ipAddressRef}>172.0.0.1</span>
                                    </Typography>
                                </div>
                                <Typography variant="h5" component="div">
                                    <HomeIcon className="resizer" />
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>

                    <Card sx={{ minWidth: '24%' }}>
                        <CardContent>
                            <div className='card-content'>
                                <div>
                                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                        Total Usage
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>0.0000 GB
                                    </Typography>
                                </div>
                                <Typography variant="h5" component="div">
                                    <MultipleStopIcon className='rotates resizer' />
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>

                    <Card sx={{ minWidth: '24%' }}>
                        <CardContent>
                            <div className='card-content'>
                                <div>
                                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                        Total Received
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>0.0000 GB
                                    </Typography>
                                </div>
                                <Typography variant="h5" component="div">
                                    <FlightIcon className="resizer manualUp" />
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>

                    <Card sx={{ minWidth: '24%' }}>
                        <CardContent>
                            <div className='card-content'>
                                <div>
                                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                        Total Sent
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>0.0000 GB
                                    </Typography>
                                </div>
                                <Typography variant="h5" component="div">
                                    <FlightIcon className="resizer manualDown" />
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Divider className='divider' />
                <div className="cards topMenu">
                    <Card sx={{ minWidth: '49.5%', minHeight: '400px', borderRadius: '10px' }}>
                        <CardContent>
                            <div>
                                <div className='card-content'>
                                    <div>
                                        <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                            Peers Data Usage
                                        </Typography>
                                        {/* <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>0 / 1</Typography> */}
                                    </div>
                                    <Typography variant="h5" component="div">
                                        <DataUsageIcon className="resizer" />
                                    </Typography>
                                </div>

                                {/* <Typography variant="h4" component="div" className='comingSoon'>Coming Soon...</Typography> */}
                                <Charts />
                            </div>
                        </CardContent>
                    </Card>

                    <Card sx={{ minWidth: '24%', minHeight: '400px', borderRadius: '10px' }}>
                        <CardContent>
                            <div>
                                <div className='card-content'>
                                    <div>
                                        <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                            Real Time Received Data Usage

                                        </Typography>
                                        {/* <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>0.0000 GB
                                        </Typography> */}
                                    </div>
                                    <Typography variant="h5" component="div">
                                        <FlightIcon className="resizer manualUp" />
                                    </Typography>
                                </div>
                                {/* <Typography variant="h4" component="div" className='comingSoon'>Coming Soon...</Typography> */}
                                <Charts />
                            </div>
                        </CardContent>
                    </Card>

                    <Card sx={{ minWidth: '24%', minHeight: '400px', borderRadius: '10px' }}>
                        <CardContent>
                            <div>
                                <div className='card-content'>
                                    <div>
                                        <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                            Real Time Sent Data Usage
                                        </Typography>
                                        {/* <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>0.0000 GB
                                        </Typography> */}
                                    </div>
                                    <Typography variant="h5" component="div">
                                        <FlightIcon className="resizer manualDown" />
                                    </Typography>
                                </div>
                                {/* <Typography variant="h4" component="div" className='comingSoon'>Coming Soon...</Typography> */}
                                <Charts />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default PeerDetails;
