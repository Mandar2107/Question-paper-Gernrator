import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent">
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate('/add-unit')}>
          <ListItemText primary="Add Unit" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
