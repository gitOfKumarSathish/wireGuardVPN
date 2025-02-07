import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { base_path } from "../api/api";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [isloading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        mutation.mutate(formData);

    };

    // Mutations
    const mutation = useMutation({
        mutationFn: async (formData: any) => {
            const response = await fetch(`${base_path}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            // An error happened!
            setIsLoading(false);
            console.log(`Error: ${error}`);
            enqueueSnackbar({ message: `${error}`, variant: "error", autoHideDuration: 2000, });
        },

        onSuccess: (data) => {
            console.log("Login success:", data);
            document.cookie = `authToken=${data.access_token}; path=/;`;
            setIsLoading(false);
            enqueueSnackbar({ message: "Succesfully LoggedIn", variant: "success", autoHideDuration: 2000, });
            navigate("/dashboard");
        },
    });

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    p: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h5" mb={2}>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button disabled={isloading} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        {isloading ? "loading....." : "Login"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default LoginForm;
