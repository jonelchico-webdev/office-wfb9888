import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles';
import {SimpleTable, GrowItem, AppDateRangePicker, Title, Loading} from '../../../components';   
import useLanguages from '../../../hooks/use-languages';
import { COMPANY_MANAGEMENT, COMPANY_MANAGEMENT_ADD } from '../../../paths';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import useCompaniesQuery from '../../../queries-graphql/company-management/company-management-sub/query/company-management-query';
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
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
    },
}));

export default function CompanyManagement(props) {
    const classes = useStyles();
    const strings = useLanguages(COMPANY_MANAGEMENT);
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

    const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after}, setCursor, setPage } = pagination;
    const {data, loading} = useCompaniesQuery({
        mutation: refresh,
    });

    if(loading) {
        return <Loading />
    }
    
    const companies = data.companies.edges;
    const pageInfo = data.companies.pageInfo;
    const count = data.companies.totalCount;
    
    return <Grid>
        <Title pageTitle={strings.companyManagement} />

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Typography variant='h6'>{strings.companyManagement}</Typography>
            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }} />
            <Grid container alignItems="center" spacing={1}>
                <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                    <Grid item >
                        <Typography color="textSecondary">{strings.companyName}:</Typography>
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
                        <Typography color="textSecondary">{strings.systemCode}:</Typography>
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

                    {/* <Grid item >
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

                    <GrowItem />

                    <Grid item>
                        <Button style={{ width: 100 }} color="primary" variant="contained" onClick={clickSearch}>{strings.searchFor}</Button>
                    </Grid>

                    <Grid item style={{ marginLeft: 10 }}>
                        <Button style={{ width: 100 }} style={{ backgroundColor: "#ff0000", color: "white" }} variant="contained" onClick={() => history.push(COMPANY_MANAGEMENT_ADD)}>{strings.newCompany}</Button>
                    </Grid>

                </Grid>
            </Grid>
            <Grid item>
                <SimpleTable
                    tableProps={{size: "small"}}
                    hasPagination={true}
                    pageInfo={pageInfo}
                    count={count}
                    noBorder={false}
                    pagination={pagination}
                    columns={
                        <TableRow>
                            <TableCell align="right">{strings.serialNumber}</TableCell>
                            <TableCell>{strings.companyName}</TableCell>
                            <TableCell>{strings.systemCode}</TableCell>
                            <TableCell>{strings.adminAccount}</TableCell>
                            <TableCell>{strings.creationTime}</TableCell>
                            <TableCell>{strings.status}</TableCell>
                            <TableCell>{strings.lastLoginIP}</TableCell>
                            <TableCell>{strings.lastLoginTime}</TableCell>
                            <TableCell colSpan={6} align="center">{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        companies.length === 0 ?
                        <TableRow>
                            <TableCell align="center" colSpan={12}>没有可用数据</TableCell>
                        </TableRow>
                        :
                        companies.map((o, idx) => 
                        <TableRow>
                            <TableCell>{o.node.pk}</TableCell>
                            <TableCell>{o.node.name}</TableCell>
                            <TableCell>{o.node.systemCode}</TableCell>
                            <TableCell>{o.node.admin ? o.node.admin.name : "-"}</TableCell>
                            <TableCell>{o.node.createdAt}</TableCell>
                            <TableCell>{o.node.status}</TableCell>
                            <TableCell>{o.node.admin ? o.node.admin.lastLoginIp : "-"}</TableCell>
                            <TableCell>{o.node.admin ? moment(o.node.admin.lastOnlineAt).format("YYYY-MM-DD HH:mm:ss") : "-"}</TableCell>
                            <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                <Button color="primary" variant="outlined" className={classes.button}>修改</Button>
                            </TableCell>
                            <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                <Button color="primary" variant="outlined" className={classes.button}>前台管理</Button>
                            </TableCell>
                            <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                <Button color="primary" variant="outlined" className={classes.button}>游戏管理</Button>
                            </TableCell>
                            <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                <Button color="primary" variant="outlined" className={classes.button}>参数设置</Button>
                            </TableCell>
                            <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                <Button color="primary" variant="outlined" className={classes.button}>域名管理</Button>
                            </TableCell>
                            <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> 
                                <Button color="primary" variant="outlined" className={classes.button}>变更状态</Button>
                            </TableCell>
                        </TableRow>
                        )
                    }
                />
            </Grid>
        </Paper>
    </Grid>
}