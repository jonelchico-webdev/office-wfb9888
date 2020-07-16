
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Modal, Button, Paper, Grid, IconButton} from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import CloseIcon from '../icons/close';
import QuestionIcon from '../icons/question';
import {COMMON} from '../paths';
import { useMutation } from '@apollo/react-hooks'
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

export default function RiskStatusChangeModal({ mutate, setMutate, idMutate, mutateQuery, passWarning, passStatus, open, setOpen}) {
    const strings = useLanguages(COMMON);
	const handleClose = () => {
		setOpen(false);
	};
    const classes = useStyles();
	const [operation] = useMutation(mutateQuery)
	const [setError] = React.useState(null);

    async function operateMutate() {
		if(idMutate == null){
			setOpen(false)
			let timerInterval
			swal.fire({
			title: '不允许操作',
			html: '先通过第一次提款审核',
			timer: 3000,
			onBeforeOpen: () => {
				swal.showLoading()
				timerInterval = setInterval(() => {
					swal.getContent().querySelector('b')
					.textContent = swal.getTimerLeft()
				}, 100)
			},
			onClose: () => {
				clearInterval(timerInterval)
			}
			}).then((result) => {
			if (
				/* Read more about handling dismissals below */
				result.dismiss === swal.DismissReason.timer
			) {
				console.log('I was closed by the timer')
			}
			})
		}else{
			try{
				const res = await operation({
					variables: { id: idMutate, status: passStatus}
				})
				if (res.data) {
					setOpen(false)
					setMutate(!mutate)
					swal.fire({
						position: 'center',
						type: 'success',
						title: '操作成功',
						showConfirmButton: false,
						timer: 1500
					})
				} else {
					setError(JSON.stringify(res.errors, Object.getOwnPropertyNames(res.errors)))
					// console.log(res)
				}
			} catch (e){
				setError(e)
			}
		}
		// window.location.reload(true);
    }

	// END

	return (<Modal
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
			open={open}
			onClose={handleClose}
		>
		<Paper  className={classes.paper}>
			<Grid container justify="flex-end" alignItems="flex-end">
				<IconButton size="small" onClick={handleClose}>
					<CloseIcon style={{fontSize: 8}}/>
				</IconButton>
			</Grid>
			<Grid container spacing={1} alignItems="flex-start">
				<Grid item><QuestionIcon htmlColor="#FAAD14" style={{fontSize: 22}}/></Grid>
				<Grid item>
					<Typography variant="subtitle1" id="modal-title">
						{/* {title} */}
					</Typography>
					<Typography variant="body2" id="simple-modal-description">
						{passWarning}
					</Typography>
				</Grid>
			</Grid>
			<Grid container justify="flex-end" spacing={1} className={classes.actions}>
				<Grid item><Button variant="contained" onClick={handleClose} color="primary">{strings.cancel}</Button></Grid>
                <Grid item><Button variant="outlined" onClick={operateMutate}>{strings.continue}</Button></Grid>
			</Grid>
		</Paper>
		</Modal>
	);
}
