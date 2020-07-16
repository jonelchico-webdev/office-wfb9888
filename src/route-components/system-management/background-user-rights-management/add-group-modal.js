import React from 'react';
import { Grid, Dialog, DialogContent, DialogTitle, TextField, Button, Divider, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Close } from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks'
import { BACKGROUND_USER_RIGHTS_MANAGEMENT } from '../../../paths'; 
import { GrowItem } from '../../../components'; 
import { ADD_SYSTEM_GROUP_MUTATION } from '../../../queries-graphql/system-management/background-user-rights-management/background-user-rights-management-mutation'
import swal from 'sweetalert2';
import useLanguages from '../../../hooks/use-languages';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative'
	},
	padding: {
		padding: theme.spacing(2),
		'& div + div': {
			marginTop: theme.spacing(1)
		}
	},
	closeIcon: {
		position: 'absolute',
		top: 8,
		right: 8
	}
}));

export default function NewGroupDialog({ open, setOpen, setRefresh, refresh }) {
    const strings = useLanguages(BACKGROUND_USER_RIGHTS_MANAGEMENT);
	const classes = useStyles();
	const [values, setValues] = React.useState({
		name: ''
	});

	function handleChange(event) {
        event.persist()
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}));
	};

	const [addGroup] = useMutation(ADD_SYSTEM_GROUP_MUTATION)
	
	async function mutateAddPermissionGroup(event) {
		event.preventDefault();
        const res = await addGroup({
            variables: {
                name: values.name,
            }
        }) 

        if(res.data) {
            setRefresh(!refresh)
			swal.fire({
				position: 'center',
				type: 'success',
				title: '添加了新的权限组!',
				showConfirmButton: false,
                timer: 1500,
                onClose: setOpen(false)
            })
        }
    }

    function handleClose(){
        setOpen(false)
    }

	return <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<form onSubmit={mutateAddPermissionGroup} autoComplete="off"  >
			<Grid container direction="column" style={{ minWidth: "50vh" }}>
				<Grid item container direction="row" alignItems="center">
					<DialogTitle id="form-dialog-title">
						{strings.createNewPermissionGroup}
					</DialogTitle>
					<GrowItem />
					<IconButton size="small" onClick={handleClose} style={{ marginRight: 20 }}>
						<Close />
					</IconButton>
				</Grid>

				<Grid item>
					<Divider />
				</Grid>

				<Grid item>
					<DialogContent>
						<Grid container direction="column">
                            <Grid item>
                                <Typography>{strings.privilegeGroupName}:</Typography>
                            </Grid>
							<Grid item>
								<TextField
									autoFocus
									margin="dense"
									name="name"
									required
									placeholder={strings.name}
                                    variant="outlined"
                                    value={values.name}
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
						</Grid>
					</DialogContent>
				</Grid>

				<Grid item container direction="column"  className={classes.padding}>
					<Grid item>
						<Button type="submit" variant="contained" color="primary" fullWidth>
							{strings.determine}
						</Button>
					</Grid>
					<Grid item>
						<Button onClick={handleClose} fullWidth>
							{strings.cancel}
						</Button>
					</Grid>
				</Grid>


			</Grid>
		</form>
	</Dialog>
}