import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Modal, Button, Paper, Grid, IconButton, Divider, TextField, Select, OutlinedInput, MenuItem, Menu, } from '@material-ui/core';
import CloseIcon from '../icons/close';
import { Warning } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 400,
		// padding: theme.spacing(2),
		outline: 'none',
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`
	},
	actions: {
		paddingTop: theme.spacing(2)
	},
	padding: {
		padding: theme.spacing(2)
	},
	textfield: {
		backgroundColor: '#fff'
	},
	select: {
		backgroundColor: '#fff',
	},
	closeButton: {
		paddingTop: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingBottom: -12
	}
}));

export default function AdjustmentMemberLevel({ username, open, setOpen, strings, memberLevels, setMemberLevelsValue, memberLevelsValue }) {
	const classes = useStyles()

	const [tempMemberLevel, setTempMemberLevel] = useState(memberLevelsValue)

	function handleMemberLevelChange(event) {
		event.persist()
		setTempMemberLevel(event.target.value)
	}

	function submitMemberLevel() {
		setMemberLevelsValue(tempMemberLevel)
		setOpen(false)
	}

	if (open) {

		return <Modal
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
			open={open} >
			<Paper className={classes.paper}>
				<Grid className={classes.closeButton} container justify="flex-end" alignItems="center">
					<IconButton size="small" onClick={() => setOpen(false)}>
						<CloseIcon size="small" />
					</IconButton>
				</Grid>
				<Grid className={classes.padding} direction="row" container spacing={2} alignItems="center"  >				
					<Grid item xs={12} >
						<Grid container direction="column" spacing={1}>
							<Grid item container alignItems="center">								
								<Warning fontSize="large" style={{display: "inline-block", color: "#f57f17", marginRight: 12}} />
								<Typography style={{display: "inline-block"}}>{strings.adjustmentLevelText1 + username + strings.adjustmentLevelText2}</Typography>
							</Grid>
							<Grid item spacing={1}>
								<Typography style={{ marginBottom: 12 }}>{strings.pleaseSelectAnAdjustmentLevel}:</Typography>
								<Select
									fullWidth={true}
									margin="dense"
									className={classes.select}
									value={tempMemberLevel}
									onChange={handleMemberLevelChange}
									displayEmpty
									input={<OutlinedInput notched={false} name="selectStatus" />}
								>
									<MenuItem value={""}>...</MenuItem>
									{
										memberLevels ? memberLevels.map(o =>
											<MenuItem value={o.node.id} >{o.node.name}</MenuItem>
										)
											: null
									}
								</Select>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid style={{paddingTop: -24, marginTop: -24}} className={classes.padding} direction="row" container spacing={2} alignItems="center" justify="center">
					<Button onClick={submitMemberLevel} variant="contained" color="primary">
						<Typography>{strings.submit}</Typography>
					</Button>
				</Grid>
			</Paper>
		</Modal>
	} else {
		return null
	}
}
