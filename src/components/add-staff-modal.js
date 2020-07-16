import React, {useState} from 'react';
import { Grid, Dialog, DialogContent, DialogTitle, TextField, Button, Divider, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Close } from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks'
import { BACKGROUND_USER_MANAGEMENT } from '../paths'; 
import { GrowItem } from './index';
import { ADD_MUTATE, EDIT_MUTATE } from '../queries-graphql/system-management/background-user-management'
import swal from 'sweetalert2';
import useLanguages from '../hooks/use-languages';

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

export default function NewStaffDialog({ open, setOpen, reload, setReload, editMode, title, staffData }) {
	const strings = useLanguages(BACKGROUND_USER_MANAGEMENT);
	const stringsError = useLanguages('error');
	const classes = useStyles();
	const [errorMessage, setErrorMessage] = useState("");
	const [values, setValues] = React.useState({
		name: '',
		username: ''
	});

	function handleChange(event) {
        event.persist()
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}));
	};

	const [addUser] = useMutation(ADD_MUTATE)
	const [editUser] = useMutation(EDIT_MUTATE)
	
	async function mutateHandle(event) {
        event.preventDefault(); 
        if(editMode == false){
            try {	
                const res = await addUser({
                    variables: {
                        name: values.name,
                        username: values.username
                    }
				}) 
				// let error = res.data.user.errors[0].messages[0].toString();
                if(res.data.user.errors.length == 0){
                    setReload(!reload)
                    setOpen(false)
                    swal.fire({
                        position: 'center',
                        type: 'success',
                        title: strings.addedNewEmployees,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if(res.data.user.errors[0].messages[0]){
					setOpen(false)
					if(res.data.user.errors[0] == "A user with that username already exists.") {
						
						swal.fire({
							position: 'center',
							type: 'error',
							title: strings.operationNotAllowed,
							html: stringsError.usernameAlreadyRegistered,
							showConfirmButton: true,
						})
					} else {
						swal.fire({
							position: 'center',
							type: 'error',
							title: strings.operationNotAllowed,
							html: strings.errorUsername,
							showConfirmButton: true,
						})
					}
                    
				}
				else{
                    setOpen(false)
                    swal.fire({
                        position: 'center',
                        type: 'error',
                        title: strings.operationNotAllowed,
                        html: strings.enterAValidUsername,
                        showConfirmButton: false,
                        timer: 3000
                    })
				}
				setValues({
					...values,
					username: '',
					name: ''
				})
				
            } catch (e) { 
            }
        }else{
            try {	
                const res = await editUser({
                    variables: {
                        id: staffData.id,
                        name: values.name == '' ? staffData.name : values.name,
                        username: values.username == '' ? staffData.username : values.username
                    }
                }) 
                if(res.data.user.errors.length == 0){
                    setReload(!reload)
                    setOpen(false)
                    swal.fire({
                        position: 'center',
                        type: 'success',
                        title: '人员数据已更改',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    setOpen(false)
                    swal.fire({
                        position: 'center',
                        type: 'error',
                        title: '不允许操作',
                        html: "输入有效的用户名。此值只能包含字母，数字和@ /。/ + /-/ _字符。",
                        showConfirmButton: false,
                        timer: 3000
                    })
				}
				setValues({
					...values,
					username: '',
					name: ''
				})

            } catch (e) { 
            }
        }
    }

    function handleClose(){
        setOpen(false)
    }

	return <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<form onSubmit={mutateHandle} autoComplete="off"  >
			<Grid container direction="column" style={{ minWidth: "50vh" }}>
				<Grid item container direction="row" alignItems="center">
					<DialogTitle id="form-dialog-title">
						{title}
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
								<TextField
									autoFocus
									margin="dense"
									name="name"
									required
									placeholder={strings.name}
                                    variant="outlined"
                                    defaultValue={editMode ? staffData.name : values.name}
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							<Grid item>
								<TextField
									autoFocus
									margin="dense"
									name="username"
									required
									placeholder={strings.userName}
                                    variant="outlined"
                                    defaultValue={editMode ? staffData.username : values.username}
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