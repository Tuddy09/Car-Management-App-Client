import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';

function LoginDialog({onLogin, onRegister}) {
    const [action, setAction] = React.useState('Sign in');

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const username = form.username.value.trim();
        const password = form.password.value.trim();
        if (username === "" || password === "") {
            alert("Both fields are required.");
            return;
        }
        if (action === 'Sign in') {
            onLogin(username, password);
        } else {
            onRegister(username, password);
            alert("User registered successfully, please login");
            setAction('Sign in')
        }

    };

    const defaultTheme = createTheme();
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {action}
                    </Typography>
                    <Box component="form" sx={{mt: 1, width: 300}} onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            {action}
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                                if (action === 'Sign in') {
                                    setAction('Register');
                                } else {
                                    setAction('Sign in');
                                }
                            }}
                        >
                            {action === 'Sign in' ? 'Register' : 'Sign in'}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default LoginDialog;