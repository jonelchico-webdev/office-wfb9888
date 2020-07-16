import React, { useState } from 'react';
import { Paper, TableCell,  TableRow, Grid, Button, Typography, Divider } from '@material-ui/core';
import { SimpleTable, Loading } from '../../../components'; 
import Title from '../../../components/title';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { BACKGROUND_USER_RIGHTS_MANAGEMENT } from '../../../paths'; 
import AddIcon from '@material-ui/icons/Add';
import usePagination from '../../../hooks/use-pagination'
import { useBackgroundUserRightsManagement } from '../../../queries-graphql/system-management/background-user-rights-management/background-user-rights-management-query'
import AddGroupModal from './add-group-modal'
import PermissionModal from './permission-modal'

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

export default function BackgroundUserRightsManagement(props) {
    const classes = useStyles();
    const strings = useLanguages(BACKGROUND_USER_RIGHTS_MANAGEMENT);
    // console.log(strings._language, 'language')
    const { history } = props
    const [refresh, setRefresh] = useState(false)
    const [open, setOpen] = React.useState(false)
    const [openPermission, setOpenPermission] = useState(false)
    const [permissionID, setPermissionID] = useState("")

    function openModal(){
        setOpen(true)
    }

    function openPermissionModal(id){
        console.log(id, 'jericoooo')
        setPermissionID(id)
        setOpenPermission(true)
    }

    const pagination = usePagination()
    const { rowsPerPage, cursor: {before, after}, page } = pagination;

    const {data, loading} = useBackgroundUserRightsManagement({
        refresh: refresh,
        rowsPerPage,
        before,
        after,
        page
    });

    if(loading) {
        return <Loading />
    }
    
    const systemGroups = data.systemGroup.edges;
    const pageInfo = data.systemGroup.pageInfo;
    const count = data.systemGroup.totalCount;

    return <Grid>

        <Title pageTitle={strings.backgroundUserRightsManagement}/>

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Grid container>
                <Typography variant='h6'>{strings.backgroundUserRightsManagement}</Typography>
            </Grid>
        
            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }}/>

            <Grid container alignItems="center" spacing={1}>
                <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>
                    <Grid item>
                        <Button color="primary" variant="contained" onClick={openModal}> <AddIcon/> {strings.addPermissionGroup}</Button>
                    </Grid>
                </Grid>
            </Grid>
            
            <Grid item>
                <SimpleTable
                    tableProps={{size: "small"}}
                    hasPagination={true}
                    pageInfo={pageInfo}
                    count={count}
                    noBorder={true}
                    pagination={pagination}
                    columns={
                        <TableRow>
                            <TableCell align="right" style={{width:70}}>ID</TableCell>
                            <TableCell>{strings.privilegeGroupName}</TableCell>
                            <TableCell>{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        systemGroups.length == 0 ? 
                        <TableRow>
                            <TableCell align="center" colSpan={3}>没有可用数据</TableCell>
                        </TableRow>
                        : 
                        systemGroups.map((o, idx) => 
                        <TableRow>
                            <TableCell align="right">{o.node.pk}</TableCell>
                            <TableCell>{o.node.name}</TableCell>
                            <TableCell>
                                <Button color="primary" onClick={() => openPermissionModal(o.node.id)}>{strings.rightsProfile}</Button>
                                {/* <Button color="primary">{strings.modify}</Button> */}
                                {/* <Button color="primary">{strings.delete}</Button> */}
                            </TableCell>
                        </TableRow>
                        )
                    }
                />
            </Grid>
        </Paper>
        <AddGroupModal 
                open={open} 
                setOpen={setOpen} 
                setRefresh={setRefresh}
                refresh={refresh}
            />
        {
            (permissionID !== "") ?
            <PermissionModal 
                open={openPermission} 
                setOpen={setOpenPermission} 
                setRefresh={setRefresh}
                refresh={refresh}
                id={permissionID}
                setPermissionID={setPermissionID}
            />
            :
            null
        }
    </Grid>
}