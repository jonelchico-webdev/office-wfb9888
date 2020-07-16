import React, { useState, Fragment } from 'react';
import useLanguages from '../../../hooks/use-languages';
import { SYSTEM_NOTIFICATION, SYSTEM_NOTIFICATION_VIEW, SYSTEM_NOTIFICATION_UPDATE, SYSTEM_NOTIFICATION_ADD } from '../../../paths';
import { makeStyles } from '@material-ui/styles';
import {
    Paper,
    Grid,
    Typography,
    Button,
    Divider,
    TextField,
    TableRow,
    TableCell,
} from '@material-ui/core';
import { GrowItem, Loading, SimpleTable, DeleteMutateModal, AppDateRangePicker, Title } from '../../../components';
import useSystemNotif from '../../../queries-graphql/announcement-management/announcement-query';
import { DELETE_ANNOUNCE_MUTATE } from '../../../queries-graphql/announcement-management/announcement-mutation';
import usePagination from '../../../hooks/use-pagination' 
import moment from 'moment'

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


export default function SystemNotification(props) { 
    const classes = useStyles();
    const strings = useLanguages(SYSTEM_NOTIFICATION);
    const [filterValues, setFilterValues] = useState({
        title: '',
        startDate: null,
        endDate: null,
    });
    const [searchValue, setSearchValue] = useState(filterValues)

    const [focusedInput, setFocusedInput] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    //Checkbox
    const selected = [];
    const isSelected = index => selected.indexOf(index) !== -1;

    const { history } = props
    


    function onFocusChange(f) {
        setFocusedInput(f);
    }

    function handleFilterChange(event) {
        event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    function onChangeClear() {
        setFilterValues({ 
            title: '',
            startDate: null,
            endDate: null,
        });
    }

    function onDatesChange({ startDate, endDate }) {
        setFilterValues(oldValues => ({
            ...oldValues,
            startDate,
            endDate
        }));
    } 
   
    function searchFor() { 
        setSearchValue(filterValues)
    } 


    const [id, setID] = useState({id: ''});

	// const dataCursor = useData()
	 
    function handleDeleteItem(announceId) {
        setModalOpen(true);
        setID({
			id: announceId
		});
    }

    // mutate delete
    const [mutate, setMutate] = React.useState(false)
    
    //end mutate delete

    //Checkbox
    // function handleChangeCheckbox(event, index) {
    //     const selectedIndex = selected.indexOf(index);
    //     let newSelected = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, index);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1),
    //         );
    //     }
    //     setSelected(newSelected);
    // }

    const pagination = usePagination();
    const { rowsPerPage, cursor: { before, after }, page } = pagination;
    const { data, loading } = useSystemNotif({ 
        title: searchValue.title ? searchValue.title : "", 
        startat: searchValue.startDate && searchValue.startDate ? searchValue.startDate.format("YYYY-MM-DD").toString() : "2000-01-01",
        endat: searchValue.endDate && searchValue.endDate ? searchValue.endDate.format("YYYY-MM-DD").toString() : "",
        rowsPerPage,
        before,
        after,
        page,
        mutate
    });

    if (loading) {
        return <Loading />;
    }


    const announcementsData = data.announcements.edges;
    const count = data.announcements.totalCount;

    // Select All Checkbox
    // function handleSelectAllClick(event) {

    //     // if (event.target.checked) { 
    //     //     let valueArr = []
    //     //     systemNotification.map((o, index) => {
    //     //         valueArr.push(index)
    //     //     });
    //     //     setSelected(valueArr);
    //     //     return;
    //     // }
    //     setSelected([]);
    // }

    return <Paper elevation={1}>
        <Title pageTitle={strings.systemNotification} />
        <Grid container className={classes.paper} direction="row" justify="space-between" alignItems="center">
            <Typography  variant="h6">{strings.systemNotification}</Typography>

            <Button color="secondary" variant="contained" onClick={() => history.push(SYSTEM_NOTIFICATION_ADD)}>{strings.addNew}</Button>
            
        </Grid>
        <Divider light={true} />
        <Grid container className={classes.paper} alignItems="center" spacing={1}>
            <Grid item>
                <Typography>{strings.title}: </Typography>
            </Grid>
            <Grid item>
                <TextField
                    style={{ width: 130 }}
                    className={classes.textfield}
                    variant="outlined"
                    margin="dense"
                    placeholder={strings.pleaseEnter}
                    name="title"
                    onChange={handleFilterChange}
                    value={filterValues.title}
                />
            </Grid>
            <Grid item>
                <Typography>{strings.date} :</Typography>
            </Grid>
            <Grid item>
                <AppDateRangePicker
                    focusedInput={focusedInput}
                    onFocusChange={onFocusChange}
                    onDatesChange={onDatesChange}
                    focused={focusedInput}
                    startDate={filterValues.startDate}
                    endDate={filterValues.endDate}
                    stratDateId="startDate"
                    endDateId="endDate"
                    startDatePlaceholderText={strings.startDate}
                    endDatePlaceholderText={strings.endDate}
                    inputIconPosition="after"
                    showDefaultInputIcon
                    small
                    isOutsideRange={() => false}
                />
            </Grid>
            <GrowItem />
            <Grid item>
                <Button color="primary" variant="text" onClick={onChangeClear} >{strings.clearAll}</Button>
            </Grid>
            <Grid item>
                <Button color="primary" onClick={() => searchFor()} variant="contained">{strings.searchFor}</Button>
            </Grid>
        </Grid>

        <Grid className={classes.paper} item style={{ paddingTop: 0 }}>
            <SimpleTable
                tableProps={{ size: "small" }}
                hasPagination={true}
                pagination={pagination}
                pageInfo={false}
                count={count}
                noBorder={true}
                columns={
                    <TableRow>
                        {/* <TableCell align="inherit" style={{ padding: 0 }}>
                            <Checkbox
                                onChange={handleSelectAllClick}
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                            {strings.selectAll}
                        </TableCell> */}
                        <TableCell align="right">{strings.serialNumber}</TableCell>
                        <TableCell>{strings.announcementTitle}</TableCell>
                        <TableCell>{strings.displayForm}</TableCell>
                        <TableCell>{strings.announcementStartTime}</TableCell>
                        <TableCell>{strings.announcementEndTime}</TableCell>
                        <TableCell align="right">{strings.sortWeight}</TableCell>
                        <TableCell>{strings.addPerson}</TableCell>
                        <TableCell>{strings.operating}</TableCell>
                    </TableRow>
                }
                rows={
                    announcementsData.length === 0 ?
                        <TableRow>
                            <TableCell align="center" colSpan={9}>没有可用数据</TableCell>
                        </TableRow>
                        :
                        announcementsData.map((o, index) => {
                            const isItemSelected = isSelected(index);
                            return (
                                <Fragment>
                                    <TableRow key={index}>
                                        {/* <TableCell>
                                    <Checkbox
                                        checked={isItemSelected}
                                        onClick={event => handleChangeCheckbox(event, index)}
                                        value={index}
                                        inputProps={{
                                            'aria-label': 'primary checkbox',
                                        }}
                                    />
                                </TableCell> */}
                                        <TableCell align="right">{o.node.pk}</TableCell>
                                        <TableCell>{o.node.title ? o.node.title : "-"}</TableCell>
                                        <TableCell>
                                            {
                                                o.node.showType === "scrolling" ?
                                                strings.scrolling 
                                                :
                                                o.node.showType === "banner" ?
                                                strings.banner
                                                :
                                                o.node.showType === "popout" ?
                                                strings.popout
                                                : 
                                                "-"
                                            }
                                        </TableCell>
                                        <TableCell>{o.node.startAt ? moment(o.node.startAt).format("YYYY-MM-DD HH:MM") : "-"}</TableCell>
                                        <TableCell>{o.node.endAt ? moment(o.node.endAt).format("YYYY-MM-DD HH:MM") : "-"}</TableCell>
                                        <TableCell align="right">{o.node.weight ? o.node.weight : "-"}</TableCell>
                                        <TableCell>{o.node.createdBy ? o.node.createdBy.username : "-"}</TableCell>
                                        <TableCell style={{ width: 300 }}>
                                            <Grid container spacing={1} direction="row" >
                                                <Grid item>
                                                    <Button size="small" onClick={() => history.push(`${SYSTEM_NOTIFICATION_VIEW}/${o.node.id}`)} variant="contained" color="primary">{strings.view}</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button size="small" onClick={() => history.push(`${SYSTEM_NOTIFICATION_UPDATE}/${o.node.id}`)} variant="contained" color="primary">{strings.update}</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button size="small" onClick={() => handleDeleteItem(o.node.id)} >{strings.delete}</Button>
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
        {/* <ContinueCancelModal open={modalOpen} setOpen={setModalOpen} title={strings.deleteModalTitle} /> */} 
        <DeleteMutateModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={DELETE_ANNOUNCE_MUTATE} open={modalOpen} setOpen={setModalOpen} title={strings.deleteModalTitle}/>
    </Paper>

}