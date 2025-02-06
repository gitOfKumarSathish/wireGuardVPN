import ParticlesBackground from '../utils/ParticleBackground';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const Home = () => {
    return (
        <div className="w-[100%] h-[90vh] relative">
            <ParticlesBackground />
            <div className="flex justify-center flex-col items-center h-full absolute top-0 left-0 w-full text-center px-4">
                <h1 className='text-4xl text-white mb-4 font-bold'>Welcome to VPN SERVER</h1>
                <p className='text-white text-xl font-medium max-w-4xl mb-4'>
                    Our VPN server ensures your internet connection is secure and private. It encrypts your data, hides your IP address, and allows you to access content safely from anywhere in the world.
                </p>
                <Stack spacing={2} direction="row">
                    <Button variant="contained">Get Started</Button>
                </Stack>
            </div>
        </div>
    );
};

export default Home;