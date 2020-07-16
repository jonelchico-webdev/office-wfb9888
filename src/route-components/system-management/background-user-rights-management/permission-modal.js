import React, { useState, Fragment } from 'react';
import { Paper, Checkbox, Grid, Dialog, DialogContent, DialogTitle, TextField, Button, Divider, FormControlLabel, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Close } from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks'
import { BACKGROUND_USER_RIGHTS_MANAGEMENT } from '../../../paths'; 
import { GrowItem } from '../../../components'; 
import { UPDATE_SYSTEM_GROUP_MUTATION } from '../../../queries-graphql/system-management/background-user-rights-management/background-user-rights-management-mutation'
import swal from 'sweetalert2';
import useLanguages from '../../../hooks/use-languages';
import { useSystemPermissionQuery, useBackgroundUserRightsIDManagement } from '../../../queries-graphql/system-management/background-user-rights-management/background-user-rights-management-query'


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

function SystemPermission() {
    const { data, loading } = useSystemPermissionQuery({
        refresh: true
    })

    if(loading) {
        return []
    }

    var systemPermission = data.systemPermission.edges

    return systemPermission
}

export default function NewGroupDialog({ open, setOpen, setRefresh, refresh, id, setPermissionID }) {
    const strings = useLanguages(BACKGROUND_USER_RIGHTS_MANAGEMENT);
    const classes = useStyles();
    const systemPermissions = SystemPermission()
    
	const [values, setValues] = React.useState({
		name: ''
    });
    
    const [permissionArray, setPermissionArray] = useState([])

	function handleChange(event) {
        event.persist()
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}));
    };
    
    function handleCheckBoxChange(event) {
        event.persist()
        var pk = event.target.value

        if(!permissionArray.includes(pk)) {
            permissionArray.push(pk)
        } else {
            let index = permissionArray.indexOf(pk)
            if (index > -1) {
                permissionArray.splice(index, 1)
            }
        }
        setRefresh(!refresh)
    }

	const [updateGroupRights] = useMutation(UPDATE_SYSTEM_GROUP_MUTATION)
	
	async function mutateUpdatePermissionGroup(event) {
		event.preventDefault();
        const res = await updateGroupRights({
            variables: {
                id: id,
                name: values.name !== '' ? values.name : systemGroupDetail.name,
                permissions: permissionArray
            }
        }) 

        if(res.data.systemGroup.errors.length === 0) {
            setRefresh(!refresh)
			swal.fire({
				position: 'center',
				type: 'success',
				title: '添加了新的权限组!',
				showConfirmButton: false,
                timer: 1500,
                onClose: handleClose()
            })
        } else {
            swal.fire({
				position: 'center',
				type: 'error',
				title: res.data.systemGroup.errors[0].messages[0],
				showConfirmButton: true,
                timer: 1500,
                customClass: {
                    container: 'my-swal'
                }
            })
        }
    }

    function handleClose(){
        setPermissionArray([])
        setPermissionID("")
        setOpen(false)
    }

    const { data, loading } = useBackgroundUserRightsIDManagement({
        id: id
    })

    if(loading) {
        return null
    }

    const systemGroupDetail = data.systemGroup.edges[0].node
    const systemGroupPermissions = data.systemGroup.edges[0].node.permissions.edges

    if(systemGroupPermissions && permissionArray.length === 0) {
        systemGroupPermissions.map((o) => {
            setPermissionArray(oldValues =>
                [
                    ...oldValues,
                    o.node.pk.toString()
                ]
            )
        })
    }   

	return <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<form onSubmit={mutateUpdatePermissionGroup} autoComplete="off"  >
			<Grid container direction="column" style={{ minWidth: "50vh" }}>
				<Grid item container direction="row" alignItems="center">
					<DialogTitle id="form-dialog-title">
						{strings.rightsProfileUpdate}
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
                                    defaultValue={systemGroupDetail.name}
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
						</Grid>
                        <Grid container>
                            <Grid item id="editor-scroll" style={{ width: 500, height: 300, overflowX: "auto" }}>
                                <Paper>
                                    {
                                        systemPermissions.map((o, idx) => <Fragment>
                                            <Grid container alignItems="center">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox 
                                                            checked={
                                                                // permissionArray.length > 0 ? 
                                                                Boolean(permissionArray.find((x) => x === o.node.pk.toString())) 
                                                                // : 
                                                                // false
                                                            } 
                                                            onChange={handleCheckBoxChange} 
                                                            value={o.node.pk}
                                                        />
                                                    }
                                                    label={
                                                        strings._language === 'zh' ?
                                                        o.node.descCn
                                                        :
                                                        o.node.codename
                                                    }
                                                />
                                            </Grid>
                                        </Fragment>
                                        )
                                    }
                                </Paper>
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