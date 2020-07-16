import React from 'react';
import {Grid, Divider} from '@material-ui/core';

export default function DividerGridItem(props) {
	return <Grid item style={{
		paddingTop: 0,
		paddingBottom: 0
		}}><Divider light={true} {...props}/>
	</Grid>
}