
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Modal, Button, Paper, Grid, IconButton} from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import CloseIcon from '../icons/close';
import QuestionIcon from '../icons/question';
import { BACKGROUND_USER_MANAGEMENT } from '../paths'; 
import { useMutation } from 'react-apollo'
import swal from 'sweetalert2';

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

export default function SimpleModal({open, setOpen, reload, setReload, staffData, mutateQuery}) {	
    const strings = useLanguages(BACKGROUND_USER_MANAGEMENT);

    const [remove] = useMutation(mutateQuery)
	
	async function mutateQueryBtn() {
        const res = await remove({variables:{id: staffData.id, name: staffData.name, username: staffData.username}})

        if(res.data.user.errors.length === 0){
            swal.fire({
                position: 'center',
                type: 'success',
                title: '员工已删除',
                showConfirmButton: false,
                timer: 1500
            })
        }
        setOpen(false)
        setReload(!reload)
	} 

	const handleClose = () => {	
		setOpen(false)
	};

	const classes = useStyles();
	
	return (
		<Modal
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
						{strings.warning1}
					</Typography>
					{/* <Typography variant="body2" id="simple-modal-description">
						{description}
					</Typography> */}
				</Grid>
			</Grid>
			<Grid container justify="flex-end" spacing={1} className={classes.actions}>
				<Grid item><Button variant="outlined" onClick={handleClose} >{strings.cancel}</Button></Grid>
				<Grid item><Button variant="contained" onClick={mutateQueryBtn} color="primary">{strings.determine}</Button></Grid>
			</Grid>
			{/* </Box> */}
		</Paper>
		</Modal>
	);
}
