import React from 'react';
import { Paper, TableCell,  TableRow, Grid, Button, Typography, Divider  } from '@material-ui/core';
import { SimpleTable, Loading, AddStaffModal, DeleteStaff } from '../../../components';
import Title from '../../../components/title';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { BACKGROUND_USER_MANAGEMENT } from '../../../paths'; 
import AddIcon from '@material-ui/icons/Add';
import usePagination from '../../../hooks/use-pagination'
import {useShowstaffuserQuery, DELETE_MUTATE} from '../../../queries-graphql/system-management/background-user-management'

const useStyles = makeStyles(theme => ({
	root: {
      padding: theme.spacing(3, 2),
      '& > span': {
        margin: theme.spacing(2),
      },
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	dense: {
		marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    },
}));

export default function BackgroundUserManagement() {
    const classes = useStyles();
    const strings = useLanguages(BACKGROUND_USER_MANAGEMENT);
    const [reload, setReload] = React.useState(false)
	const [open, setOpen] = React.useState(false)
	const [openDelete, setOpenDelete] = React.useState(false)
	const [editMode, setEditMode] = React.useState(true)
	const [title, setTitle] = React.useState('')
    const [staffData, setStaffData] = React.useState([])

    const pagination = usePagination()

    function openModal(){
        setOpen(true)
        setEditMode(false)
        setTitle(strings.newStaff)
    }

    function editModal(datas){
        setOpen(true)
        setEditMode(true)
        setTitle(strings.editStaff)
        setStaffData(datas)
    }

    function deleteHandle(datas){
        setOpenDelete(true)
        setStaffData(datas)
    }

    const { rowsPerPage, cursor: {before, after} } = pagination;
	const { data, loading } = useShowstaffuserQuery({
        reload: reload, 
		rowsPerPage, before, after
	});
	if (loading) {
		return <Loading />;
    }

    return <Grid>

        <Title pageTitle={strings.backgroundUserManagement}/>

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Grid container>
                <Typography variant='h6'>{strings.backgroundUserManagement}</Typography>
            </Grid>
        
            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }}/>

            <Grid container alignItems="center" spacing={1}>

                    <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                        <Grid item>
                            <Button color="primary" variant="contained" onClick={openModal}> <AddIcon/> {strings.addABackgroundAccount}</Button>
                        </Grid>

                    </Grid>

            </Grid>

            <Grid item>
                <SimpleTable
					tableProps={{ size: "small" }}
                    hasPagination={true}
                    noBorder={true}
					pagination={pagination}
					pageInfo={data.users.pageInfo ? data.users.pageInfo : false}
					count={data.users.totalCount ? data.users.totalCount : 0}
                    columns={
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{strings.username}</TableCell>
                            <TableCell>{strings.userPermissionGroup}</TableCell>
                            <TableCell colSpan={2}>{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        data.users.edges.map((item, idx) => 
                            <TableRow>
                                <TableCell>{item.node.id}</TableCell>
                                <TableCell>{item.node.username}</TableCell>
                                <TableCell>{strings[item.node.groups.edges.length >= 1 ? item.node.groups.edges[0].node.name : '']}</TableCell>
                                <TableCell><Button onClick={() => editModal(item.node)} color="primary">{strings.modify}</Button></TableCell>
                                <TableCell><Button color="primary" onClick={() => deleteHandle(item.node)}>{strings.delete}</Button></TableCell>
                                {/* <TableCell><Button color="primary">{strings.unbindGoogleAuthenticator}</Button></TableCell> */}
                            </TableRow>
                        )
                    }
                />
            </Grid>

        </Paper>
        <AddStaffModal open={open} setOpen={setOpen} reload={reload} editMode={editMode} setReload={setReload} staffData={staffData} title={title}/>
        <DeleteStaff open={openDelete} setOpen={setOpenDelete} reload={reload} setReload={setReload} staffData={staffData} mutateQuery={DELETE_MUTATE}/>
    </Grid>
}