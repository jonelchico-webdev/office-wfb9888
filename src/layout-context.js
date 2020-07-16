import React from 'react';

export const drawerWidth = 255;

export const LayoutContext = React.createContext({
	isDrawerMolibeOpen: false,
	isDrawerDesktopOpen: true,
	handleDesktopDrawerToggle: () => {},
	handleMobileDrawerToggle: () => {}
});