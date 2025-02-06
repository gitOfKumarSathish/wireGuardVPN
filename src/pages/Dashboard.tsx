import DataUsageIcon from '@mui/icons-material/DataUsage';
import FlightIcon from '@mui/icons-material/Flight';
import MediationIcon from '@mui/icons-material/Mediation';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { Card, CardContent, Divider, Typography } from '@mui/material';

import Charts from './Charts';

const Dashboard = () => {
    return (
        <main>
            <header className='header'>

                <PersonPinCircleIcon className="resizer" />
                <div>
                    <Typography variant="h6" component="div">
                        Welcome!
                    </Typography>
                    <Typography variant="h4" component="div">
                        Username
                    </Typography>
                </div>

            </header>
            <Divider className='divider' />
            <section>
                <div className="cards topMenu">
                    <Card sx={{ minWidth: '24%' }}>
                        <CardContent>
                            <div className='card-content'>
                                <div>
                                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                        Connected Peers
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>0 / 1</Typography>
                                </div>
                                <Typography variant="h5" component="div">
                                    <MediationIcon className="resizer" />
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
        </main>

    );
};

export default Dashboard;
