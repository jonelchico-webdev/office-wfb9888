import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

export default function Loading() {
	return <Grid container direction="column" justify="center" alignItems="center" style={{ height: "80vh", minWidth: 500 }} >
		<CircularProgress
			disableShrink
			color="#eaeef4"
		/>
	</Grid>
}