
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Modal, Button, Paper, Grid, IconButton} from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import CloseIcon from '../icons/close';
import QuestionIcon from '../icons/question';
import {COMMON} from '../paths';

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		padding: theme.spacing(2),
		outline: 'none',
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`
	},
	actions: {
		paddingTop: theme.spacing(2)
	}
}));

export default function SimpleModal({open, setOpen, imgSrc, setPreviewImg}) {	

	const strings = useLanguages(COMMON);
	const handleClose = () => {	
        setOpen(false)
        setPreviewImg(null)
	};

	const classes = useStyles();
	
	return (
		<Modal
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
			open={open}
			onClose={handleClose}
		>
		<Paper className={classes.paper}>
			<Grid container direction="column" justify="flex-end" alignItems="flex-end">
				<Grid item>
                    <IconButton size="small" onClick={handleClose}>
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                </Grid>

                <Grid item>
					{
						imgSrc !== null ?
						<img 
							src={
								imgSrc ? 
								typeof imgSrc === "string" ?
								imgSrc
								:
								URL.createObjectURL(imgSrc) 
								: 
								null
							}
							style={{
								maxHeight: 600,
								paddingTop: '1rem'
							}}
						/>
						:
						<Typography variant="h3" style={{ paddingTop: '1rem' }}>{strings.noImage}</Typography>
					}
                </Grid>

			</Grid>
            
		</Paper>
		</Modal>
	);
}
