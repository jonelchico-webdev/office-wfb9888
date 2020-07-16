
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
		width: 400,

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

export default function UserCard({title, description, mutateQuery, mutate, setMutate, open, setOpen,  index, id, status, setStatus, name, setName, setId, setStatusId,x}) {	
	function mutateQueryBtn() {
		if(id) {
			mutateQuery({id: id, status: status})
			setStatus(null)
			setName(null)
            setOpen(false)
            setMutate(!mutate)
		} else {
			mutateQuery()
            setOpen(false)
            setMutate(!mutate)
		}
	}

	

	const strings = useLanguages(COMMON);
	const handleClose = () => {	
		if(id) {
			setOpen(false)
			setId(null)
			setName(null)
		} else {
			setOpen(false)
		}
	};

	const classes = useStyles();
	
	return (
		<Modal
			id={index}
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
			open={open}
			onClose={handleClose}
		>
		<Paper  className={classes.paper}>
			{/* <Box> */}

			<Grid container justify="flex-end" alignItems="flex-end">
				<IconButton size="small" onClick={handleClose}>
					<CloseIcon fontSize="inherit"/>
				</IconButton>
			</Grid>
			<Grid container spacing={1} alignItems="flex-start">
				<Grid item><QuestionIcon htmlColor="#FAAD14" style={{fontSize: 22}}/></Grid>
				<Grid item>
					<Typography variant="subtitle1" id="modal-title">
						{title}&nbsp;{name} <br/>
						{x}
					</Typography>
					<Typography variant="body2" id="simple-modal-description">
						{description}
					</Typography>
				</Grid>
			</Grid>
			<Grid container justify="flex-end" spacing={1} className={classes.actions}>
				<Grid item><Button variant="outlined" onClick={handleClose} >{strings.cancel}</Button></Grid>
				<Grid item><Button variant="contained" onClick={mutateQueryBtn} color="primary">{strings.continue}</Button></Grid>
			</Grid>
			{/* </Box> */}
		</Paper>
		</Modal>
	);
}
