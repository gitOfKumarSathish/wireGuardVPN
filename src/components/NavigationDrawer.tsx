import * as React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function NavigationDrawer() {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const [selectedIndex, setSelectedIndex] = React.useState(location.pathname);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleListItemClick = (path: string) => {
        setSelectedIndex(path);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                <img src="https://placehold.co/400x200/000000/FFFFFF/png" alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
            <List>
                {['Dashboard', 'Peers', 'Settings', 'Help'].map((text, index) => {
                    const path = `/${text.toLowerCase()}`;
                    return (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={path}
                                selected={selectedIndex === path}
                                onClick={() => handleListItemClick(path)}
                            >
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <List>
                {['Logout'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}>
                <MenuIcon />
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>

            <Outlet />
        </div>
    );
}