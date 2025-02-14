import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box, Container } from '@mui/material';

const NotFound = () => {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Image */}
            <Box mb={4}>
                <img
                    src="https://i.imgur.com/7zZ8ZqW.png" // Replace with your own image URL
                    alt="404 Error"
                    style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
                />
            </Box>

            {/* Title */}
            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                404
            </Typography>

            {/* Message */}
            <Typography variant="h5" component="p" color="textSecondary" gutterBottom>
                Oops! The page you're looking for doesn't exist.
            </Typography>

            {/* Link to Home */}
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
                sx={{ mt: 2, padding: '10px 20px', fontSize: '1rem' }}
            >
                Go back to Home
            </Button>
        </Container>
    );
};

export default NotFound;