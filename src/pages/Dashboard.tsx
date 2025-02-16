import DataUsageIcon from '@mui/icons-material/DataUsage';
import FlightIcon from '@mui/icons-material/Flight';
import MediationIcon from '@mui/icons-material/Mediation';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import Charts from './Charts';
import { useQuery } from '@tanstack/react-query';
import { base_path } from '../api/api';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../jotai/userAtom';
import { motion } from 'framer-motion';
import { getAuthToken } from '../api/getAuthToken';

const shimmerAnimation = {
    initial: { opacity: 0.4 },
    animate: { opacity: [0.4, 1, 0.4] },
    transition: { duration: 1.5, repeat: Infinity }
};

const Dashboard = () => {


    const { isLoading, data } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const authToken = getAuthToken();
            if (!authToken) throw new Error("No auth token found");
            const response = await fetch(`${base_path}/api/users/me`, {
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

    return (
        <main>
            {/* Header with Skeleton */}
            <header className='header'>
                {isLoading ? (
                    <motion.div className="skeleton-circle" {...shimmerAnimation} />
                ) : (
                    <PersonPinCircleIcon className="resizer" />
                )}

                <div>
                    <Typography variant="h6" component="div">
                        Welcome!
                    </Typography>

                    {isLoading ? (
                        <motion.div className="skeleton-text" {...shimmerAnimation} />
                    ) : (
                        <Typography variant="h4" component="div">
                            {data?.username}
                        </Typography>
                    )}
                </div>
            </header>

            <Divider className='divider' />

            <section>
                <div className="cards topMenu">
                    {/* Skeleton Loading for Each Card */}
                    {["Connected Peers", "Total Usage", "Total Received", "Total Sent"].map((title, index) => (
                        <Card key={index} sx={{ minWidth: '24%' }}>
                            <CardContent>
                                <div className='card-content'>
                                    <div>
                                        <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                            {title}
                                        </Typography>

                                        {isLoading ? (
                                            <motion.div className="skeleton-text" {...shimmerAnimation} />
                                        ) : (
                                            <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 24 }}>
                                                {data ? data[title.toLowerCase().replace(/\s/g, '_')] || "0.0000 GB" : "0.0000 GB"}
                                            </Typography>
                                        )}
                                    </div>

                                    <Typography variant="h5" component="div">
                                        {index === 0 && <MediationIcon className="resizer" />}
                                        {index === 1 && <MultipleStopIcon className='rotates resizer' />}
                                        {index === 2 && <FlightIcon className="resizer manualUp" />}
                                        {index === 3 && <FlightIcon className="resizer manualDown" />}
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Divider className='divider' />

                <div className="cards topMenu">
                    {/* Charts with Skeleton */}
                    {["Peers Data Usage", "Real Time Received Data Usage", "Real Time Sent Data Usage"].map((title, index) => (
                        <Card key={index} sx={{ minWidth: index === 0 ? '49.5%' : '24%', minHeight: '400px', borderRadius: '10px' }}>
                            <CardContent>
                                <div>
                                    <div className='card-content'>
                                        <div>
                                            <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
                                                {title}
                                            </Typography>
                                        </div>
                                        <Typography variant="h5" component="div">
                                            {index === 0 && <DataUsageIcon className="resizer" />}
                                            {index === 1 && <FlightIcon className="resizer manualUp" />}
                                            {index === 2 && <FlightIcon className="resizer manualDown" />}
                                        </Typography>
                                    </div>

                                    {isLoading ? (
                                        <motion.div className="skeleton-rect" {...shimmerAnimation} />
                                    ) : (
                                        <Charts />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Dashboard;
