import React from 'react';

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Tooltip,
    IconButton,
    Avatar,
    MenuItem,
    Menu,
} from '@mui/material';

export const TitleBar = ({
    title,
    login,
    loading,
    user,
    anchorElUser,
    handleOpenUserMenu,
    handleCloseUserMenu,
    handleLogout
}) => {
    return (
        <AppBar component="nav">
            <Toolbar>
                <Typography
                    variant="h5"
                    color="white"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: "non", sm: "block" } }}
                >
                    {title}
                </Typography>
                {!user && (
                    <Button
                        disabled={loading}
                        sx={{ color: "#ffffff" }}
                        variant="text"
                        onClick={login}
                    >
                        Login
                    </Button>
                )}
                {user && user.first_name && user.last_name && user.picture && 
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Profile picture" src={user.picture} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem key="profileName">{`${user.first_name} ${user.last_name}`}</MenuItem>
                            <MenuItem key="logout" onClick={handleLogout}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                }
            </Toolbar>
        </AppBar> 
    ); 
};