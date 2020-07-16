import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles';
import {SimpleTable, GrowItem, AppDateRangePicker, Title, Loading} from '../../../components';   
import useLanguages from '../../../hooks/use-languages';
import { EVENTS_LIST, ADD_EVENT, MODIFY_EVENT, ACTIVITY_REPORT } from '../../../paths';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import useGameEventListQuery from '../../../queries-graphql/activity-management/event-list/query/event-list-query';
import usePagination from '../../../hooks/use-pagination'
import moment from 'moment'
import { GAME_EVENT_STATUS_MUTATION, GAME_EVENT_DELETE_MUTATION } from '../../../queries-graphql/activity-management/event-list/mutation/add-game-event-mutation'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

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
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

export default function EventList(props) {
    const classes = useStyles();
    const strings = useLanguages(EVENTS_LIST);
    const {history} = props

    const [filterValues, setFilterValues] = React.useState({
        startDate: null,
        endDate: null,
        eventName: "",
        founder: "",
        typeOfActivity: "",
        status: "",
        company: ""
    });
    
    const [refresh, setRefresh] = useState(false)

    function handleFilterChange(event) { 
		event.persist();
		setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
		}));
	}

    const [focusedInput, setFocusedInput] = useState(null);
    function onDatesChange({ startDate, endDate }) {
        setFilterValues(oldValues => ({
            ...oldValues,
            startDate,
            endDate
        }));
    }
    function onFocusChange(f) {
        setFocusedInput(f);
    }

    const [filter, setFilter] = useState({
		filterValues: [],
        startDate: '2005-01-01',
        endDate: "2050-05-30"
    })

    function clickSearch() {
		if (filterValues.startDate == null && filterValues.endDate == null) {
			setFilter({
				filterValues: filterValues,
				startDate: '2005-01-01',
                endDate: "2050-01-01"
            })
		} else {
			setFilter({
				filterValues: filterValues,
				startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
				endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
			})
        }
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
    }
    
    const [gameEventStatus] = useMutation(GAME_EVENT_STATUS_MUTATION)
    const [gameEventDelete] = useMutation(GAME_EVENT_DELETE_MUTATION)

    async function modifyStatus(id, status, name) {
        await swal.fire({
            position: 'center',
            title: strings.updateStatus,
            text: strings.doUpdate + name + '?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: strings.yes,
			cancelButtonText: strings.cancel
        }).then((result) => {
            if(result.value) {
                changeStatus(id, status)
                // gameEventStatus({
                //     variables: {
                //         updatedBy: cookies.get('ID'),
                //         id: id,
                //         enabled: status
                //     }
                // })
                swal.fire(
                    strings.update,
                    name + strings.hasBeenUpdated,
                    'success'
                )
                // setRefresh(!refresh)
            }
        })
    }

    async function changeStatus(id, status) {
        const res = await gameEventStatus({
            variables: {
                updatedBy: cookies.get('ID'),
                id: id,
                enabled: status
            }
        })

        if(res) {
            setRefresh(!refresh)
        }
    }

    function deleteEvent(id, name) {
        swal.fire({
            position: 'center',
            title: strings.delete,
            text: strings.doDelete + name + '?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: strings.yes,
			cancelButtonText: strings.cancel
        }).then((result) => {
            if(result.value) {
                deleteEventFunction(id)
                swal.fire(
                    strings.delete,
					name + strings.hasBeenDeleted,
					'success'
                )
            }
        })
    }

    async function deleteEventFunction(id) {
        const res = await gameEventDelete({
            variables: {
                updatedBy: cookies.get('ID'),
                id: id,
                deletedFlag: true
            }
        })

        if(res) {
            setRefresh(!refresh)
        }
    }

    const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after}, setCursor, setPage } = pagination;
    const {data, loading} = useGameEventListQuery({
        mutation: refresh,
        deletedFlag: false,
        startAt: filter.startDate,
        endAt: filter.endDate,
        title: filter.filterValues.eventName,
        // eventType: filter.filterValues.typeOfActivity,
        enabled: filter.filterValues.status,
        rowsPerPage,
        before,
        after,
    });

    if(loading) {
        return <Loading />
    }
    
    const gameEvents = data.gameEvents.edges;
    const pageInfo = data.gameEvents.pageInfo;
    const count = data.gameEvents.totalCount;
    
    return <Grid>
        <Title pageTitle={strings.eventList} />

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Typography variant='h6'>{strings.eventList}</Typography>
            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }} />
            <Grid container alignItems="center" spacing={1}>
                <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                    <Grid item >
                        <Typography color="textSecondary">{strings.eventName}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField 
                            type="text" 
                            name="eventName"
                            variant="outlined" 
                            margin="dense" 
                            style={{ width: 100, marginLeft: 10, marginRight: 10 }} 
                            onChange={handleFilterChange}
                        />
                    </Grid>

                    <Grid item >
                        <Typography color="textSecondary">{strings.date}:</Typography>
                    </Grid>
                    <Grid item style={{ marginLeft: 10 }}>
                        <AppDateRangePicker
                            focusedInput={focusedInput}
                            onFocusChange={onFocusChange}
                            onDatesChange={onDatesChange}
                            startDate={filterValues.startDate}
                            endDate={filterValues.endDate}
                            startDateId="startDate"
                            endDateId="endDate"
                            startDatePlaceholderText={strings.startDate}
                            endDatePlaceholderText={strings.endDate}
                            inputIconPosition="after"
                            showDefaultInputIcon
                            small
                            isOutsideRange={() => false}
                        />
                    </Grid>

                    {/* <Grid item style={{ marginLeft: 10 }}>
                        <Typography color="textSecondary">{strings.founder}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField 
                            type="text" 
                            name="founder"
                            variant="outlined" 
                            margin="dense" 
                            style={{ width: 100, marginLeft: 10 }} 
                            onChange={handleFilterChange}
                        />
                    </Grid> */}

                    {/* <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.typeOfActivity}:</Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            displayEmpty
                            margin="dense"
                            className={classes.textfield}
                            name="typeOfActivity"
                            value={filterValues.typeOfActivity}
                            onChange={handleFilterChange}
                            style={{ width: 100 }}
                            input={<OutlinedInput notched={false} name="selectStatus" />}
                        >
                            <MenuItem value="">{strings.all}</MenuItem>
                            <MenuItem value="register">{strings.registrationActivity}</MenuItem>
                            <MenuItem value="login">{strings.loginActivity}</MenuItem>
                            <MenuItem value="deposit">{strings.rechargeActivity}</MenuItem>
                            <MenuItem value="consumption">{strings.consumerActivity}</MenuItem>
                            <MenuItem value="manual">{strings.manual}</MenuItem>
                        </Select>
                    </Grid> */}

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.status}:</Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            displayEmpty
                            margin="dense"
                            className={classes.textfield}
                            name="status"
                            value={filterValues.status}
                            onChange={handleFilterChange}
                            style={{ width: 100 }}
                            input={<OutlinedInput notched={false} name="selectStatus" />}
                        >
                            <MenuItem value="">{strings.all}</MenuItem>
                            <MenuItem value={true}>{strings.open}</MenuItem>
                            <MenuItem value={false}>{strings.shutDown}</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.company}:</Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            displayEmpty
                            margin="dense"
                            className={classes.textfield}
                            name="company"
                            value={filterValues.company}
                            onChange={handleFilterChange}
                            style={{ width: 100 }}
                            input={<OutlinedInput notched={false} name="selectStatus" />}
                        >
                            <MenuItem value="">{strings.all}</MenuItem>
                            <MenuItem value="pc">{strings.frontDeskOne}</MenuItem>
                            <MenuItem value="mobile">{strings.frontDeskTwo}</MenuItem>
                        </Select>
                    </Grid>

                    <GrowItem />

                    <Grid item>
                        <Button style={{ width: 100 }} color="primary" variant="contained" onClick={clickSearch}>{strings.searchFor}</Button>
                    </Grid>

                    <Grid item style={{ marginLeft: 10 }}>
                        <Button style={{ width: 100 }} style={{ backgroundColor: "#ff0000", color: "white" }} variant="contained" onClick={() => history.push(ADD_EVENT)}>{strings.newActivity}</Button>
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
                            <TableCell align="right">{strings.serialNumber}</TableCell>
                            <TableCell>{strings.eventName}</TableCell>
                            {/* <TableCell>{strings.company}</TableCell> */}
                            <TableCell>{strings.typeOfActivity}</TableCell>
                            <TableCell>{strings.activityStartTime}</TableCell>
                            <TableCell>{strings.eventEndTime}</TableCell>
                            <TableCell>{strings.creationTime}</TableCell>
                            <TableCell>{strings.founder}</TableCell>
                            <TableCell>{strings.lastUpdateTime}</TableCell>
                            <TableCell>{strings.updater}</TableCell>
                            <TableCell>{strings.status}</TableCell>
                            <TableCell colSpan={4} align="center">{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        gameEvents.length === 0 ? 
                        <TableRow>
                            <TableCell align="center" colSpan={12}>没有可用数据</TableCell>
                        </TableRow>
                        : 
                        gameEvents.map((o, index) =>
                        o.node ? 
                            <TableRow>
                                <TableCell align="right">{o.node.pk}</TableCell>
                                <TableCell>{o.node.title}</TableCell>
                                {/* <TableCell> */}
                                    {/* {
                                        o.node.content ? 
                                        o.node.content.length > 30 ?
                                        JSON.parse(o.node.content).blocks[0].text
                                        :
                                        o.node.content
                                        : 
                                        null
                                    } */}
                                    {/* {null}
                                </TableCell> */}
                                {/* <TableCell>
                                    {
                                        o.node.eventType === "LOGIN" ?
                                        strings.loginActivity
                                        :
                                        o.node.eventType === "DEPOSIT" ?
                                        strings.rechargeActivity 
                                        :
                                        o.node.eventType === "REGISTER" ?
                                        strings.registrationActivity 
                                        :
                                        o.node.eventType === "CONSUMPTION" ?
                                        strings.consumerActivity 
                                        :
                                        o.node.eventType === "MANUAL" ?
                                        strings.manual
                                        :
                                        "-"
                                    }
                                </TableCell> */}
                                <TableCell>{o.node.eventType ? o.node.eventType.name : "-"}</TableCell>
                                <TableCell>{moment(o.node.startAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                <TableCell>{moment(o.node.endAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                <TableCell>{moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                <TableCell>{o.node.createdBy ? o.node.createdBy.username : "-"}</TableCell>
                                <TableCell>{moment(o.node.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                <TableCell>{o.node.updatedBy ? o.node.updatedBy.username : "-" }</TableCell>
                                <TableCell>
                                    {
                                        (o.node.enabled) ? 
                                        <Typography color="primary">{strings.open}</Typography> 
                                        : 
                                        <Typography style={{ color: "red" }}>{strings.shutDown}</Typography>
                                    }
                                </TableCell>
                                <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    {
                                        o.node.enabled === false ?
                                        <Button color="primary" variant="outlined" className={classes.button} onClick={ () => modifyStatus(o.node.id, true, o.node.title)}>{strings.open}</Button>
                                        :
                                        <Button color="primary" variant="outlined" className={classes.button} onClick={ () => modifyStatus(o.node.id, false, o.node.title)}>{strings.shutDown}</Button>
                                    }
                                </TableCell>

                                <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                    <Button color="primary" variant="outlined" className={classes.button} onClick={ () => history.push(`${MODIFY_EVENT}/${o.node.id}`)}>{strings.modify}</Button> 
                                </TableCell>

                                <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                    <Button style={{ width: 100 }} color="primary" variant="outlined" className={classes.button} onClick={ () => history.push(`${ACTIVITY_REPORT}/${o.node.id}`)}>{strings.activityReport}</Button> 
                                </TableCell>

                                <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                    <Button 
                                        // color="primary" 
                                        variant="outlined"
                                        style={{ color: 'red' }}
                                        className={classes.button} 
                                        onClick={() => deleteEvent(o.node.id, o.node.title)}
                                    >
                                        {strings.delete}
                                    </Button> 
                                </TableCell>

                            </TableRow>
                            :
                            null
                        )
                    }
                />
            </Grid>
        </Paper>
    </Grid>
}