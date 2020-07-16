import React, { useState, Fragment } from 'react';
import useLanguages from '../../../hooks/use-languages';
import {
    Paper,
    Grid,
    Typography,
    Button,
    Divider,
    TextField,
    TableRow,
    TableCell
} from '@material-ui/core';
import { GrowItem, SimpleTable, Title, Loading, UserCard} from '../../../components';
import { makeStyles } from '@material-ui/styles';
import { useMutation } from 'react-apollo'
import { COPYWRITING_MANAGEMENT, COPYWRITING_MANAGEMENT_FORM, COPYWRITING_MANAGEMENT_VIEW } from '../../../paths';
import { useCopywritingManagement } from '../../../queries-graphql/announcement-management/copywriting-management/copywriting-management-query'
import { COPYWRITING_DELETE } from '../../../queries-graphql/announcement-management/copywriting-management/copywriting-management-mutation'
import usePagination from '../../../hooks/use-pagination'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        padding: theme.spacing(2)
    },
    textfield: {
        backgroundColor: '#ffffff',
    },
}));

export default function CopywritingManagement(props) {
    const classes = useStyles();
    const strings = useLanguages(COPYWRITING_MANAGEMENT);
    const [modalOpen, setModalOpen] = useState(false);
    
    const [mutateID, setMutateID] = useState(null);
    const [userBankName, setUserBankName] = useState(null);
    const [status, setStatus] = useState(false);
    const [mutate, setMutate] = useState(false)
    const [deleteCopy] = useMutation(COPYWRITING_DELETE)
    const [filterValues, setFilterValues] = useState({
        copyName: '',
    });
    const { history } = props
 
    function handleFilterChange(event) {
        event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    function mutateStatusQuery(variables) {
        deleteCopy({
          variables: variables,
        })
        setMutate(!mutate)
    }
    
    function onChangeClear() {
        setFilterValues(oldValues => ({
            ...oldValues,
            copyName: '',
        }));
    }

    const [filter, setFilter] = useState({
        copyName: '',
    })

    function search() {
        setFilter(oldValues => ({
            ...oldValues,
            copyName: filterValues.copyName
        }))
    }
    
    function handleDeleteItem(value) {
        setMutateID(value.id)
        setUserBankName(value.title)
        setModalOpen(true);
        setMutate(!mutate)
    }
    
    const pagination = usePagination()
    const { data, loading } = useCopywritingManagement({
        refresh: mutate,
        enabled: true,
        title_Icontains: filter.copyName
        // rowsPerPage,
        // before,
        // after,
        // page
    });

    if(loading) {
        return <Loading />
    }
        
    const copywritingManagement = data.systemDocs.edges;
    const pageInfo = data.systemDocs.pageInfo;
    // const count = data.systemDocs.totalCount;
    
    return <Paper elevation={1}>

        <Title pageTitle={strings.copywritingManagement} />
        <Grid container>
            <Grid item justify="space-between" alignItems="center">
                <Typography className={classes.paper} variant="h6">{strings.copywritingManagement}</Typography>
            </Grid>
            <GrowItem />
            <Grid item justify="space-between" alignItems="center" className={classes.paper}>
                <Button color="secondary" variant="contained" onClick={() => history.push(COPYWRITING_MANAGEMENT_FORM)}>{strings.addNew}</Button>
            </Grid>
        </Grid>
        <Divider light={true} />
        <Grid container className={classes.paper} alignItems="center" spacing={1}>
            <Grid item>
                <Typography>{strings.copyName}: </Typography>
            </Grid>
            <Grid item>
                <TextField
                    style={{ width: 130 }}
                    className={classes.textfield}
                    variant="outlined"
                    margin="dense"
                    placeholder={strings.pleaseEnter}
                    name="copyName"
                    onChange={handleFilterChange}
                    value={filterValues.copyName}
                />
            </Grid>
            <GrowItem />
            <Grid item>
                <Button color="primary" variant="text" onClick={onChangeClear} >{strings.clearAll}</Button>
            </Grid>
            <Grid item>
                <Button color="primary" variant="contained" onClick={search}>{strings.searchFor}</Button>
            </Grid>
        </Grid>

        <Grid className={classes.paper} item style={{ paddingTop: 0 }}>
            <SimpleTable
                tableProps={{size: "small"}}
                hasPagination={false}
                pagination={pagination}
                pageInfo={pageInfo}
                noBorder={true}
                // count={count}
                columns={
                    <TableRow>
                        <TableCell align="right" style={{ width: 100 }}>{strings.serialNumber}</TableCell>
                        <TableCell>{strings.copyName}</TableCell>
                        <TableCell>{strings.displayPosition}</TableCell>
                        <TableCell align="right">{strings.sortWeight}</TableCell>
                        <TableCell>{strings.founder}</TableCell>
                        <TableCell>{strings.modifier}</TableCell>
                        {/* <TableCell align="right">{strings.withdrawalAmount}</TableCell> */}
                        <TableCell>{strings.operating}</TableCell>
                    </TableRow>
                }
                rows={
                    copywritingManagement.length === 0 ? 
                    <TableRow>
                        <TableCell align="center" colSpan={8}>没有可用数据</TableCell>
                    </TableRow>
                    : 
                    copywritingManagement.map((o, index) => {
                        return (
                            <Fragment>
                                <TableRow key={index}>
                                    <TableCell align="right">{o.node.pk}</TableCell>
                                    <TableCell>{o.node.title ? o.node.title : "-"}</TableCell>
                                    <TableCell>{o.node.position ? o.node.position : "-"}</TableCell>
                                    <TableCell align="right">{o.node.weight ? o.node.weight : "-"}</TableCell>
                                    <TableCell>{o.node.createUser ? o.node.createUser.username : "-"}</TableCell>
                                    <TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.username : "-"}</TableCell>
                                    {/* <TableCell align="right">{o.withdrawalAmount}</TableCell> */}
                                    <TableCell>
                                        <Grid container spacing={1} direction="row" >
                                            <Grid item>
                                                <Button size="small" variant="outlined" onClick={ () => history.push(`${COPYWRITING_MANAGEMENT_VIEW}/${o.node.id}`)} color="primary">{strings.view}</Button>
                                            </Grid>
                                            <Grid item>
                                                <Button size="small" variant="contained" onClick={ () => history.push(`${COPYWRITING_MANAGEMENT_FORM}/update/${o.node.id}`)} color="primary">{strings.edit}</Button>
                                            </Grid>
                                            <Grid item>
                                                <Button size="small" onClick={() => handleDeleteItem(o.node)} >{strings.delete}</Button>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        )
                    })
                }
            />
        </Grid>
        <UserCard open={modalOpen} setOpen={setModalOpen} mutate={mutate} setMutate={setMutate} id={mutateID} setId={setMutateID} name={userBankName} setName={setUserBankName} status={status} setStatus={setStatus} title={strings.deleteModalTitle} mutateQuery={mutateStatusQuery} />

    </Paper>
}