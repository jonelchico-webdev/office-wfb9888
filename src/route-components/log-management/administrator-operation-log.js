import React, { useState } from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField} from '@material-ui/core';
import { SimpleTable } from '../../components';
import { GrowItem } from '../../components';
import Title from '../../components/title';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { ADMINISTRATOR_OPERATION_LOG, USER_MANAGEMENT } from '../../paths';
import { AppDateRangePicker } from '../../components/date-picker';
import usePagination from '../../hooks/use-pagination'
import {Loading} from '../../components';
import {useAdminLogQuery} from '../../queries-graphql/log-management/log-admin'
import moment from 'moment'

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

export default function UserLoginLog(props) {
    const classes = useStyles();
    const strings = useLanguages(ADMINISTRATOR_OPERATION_LOG);

    const {history} = props

    const [filterValues, setFilterValues] = React.useState({
		startDate: null,
        endDate: null,
        accountNumber: '',
    });

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
        startDate: null,
		endDate: null
    });

    function handleFilterChange(event) {
		event.persist()
		setFilterValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

    function clickSearch() {
		setFilter(filterValues)
		if(filterValues.startDate === null && filterValues.endDate === null) {
			setFilter ({
				filterValues: filterValues,
				startDate: "2000-01-01",
				endDate: moment().add(1, 'day').format("YYYY-MM-DD").toString()
			})
		} else {
			setFilter ({
				filterValues: filterValues,
				startDate: filterValues.startDate ? filterValues.startDate.format("YYYY-MM-DD").toString() : '2000-01-01',
		 		endDate: filterValues.endDate ?  filterValues.endDate.format("YYYY-MM-DD").toString() :  moment().add(1, 'day').format("YYYY-MM-DD").toString()
			})
		}

	}

    const pagination = usePagination();
    const { rowsPerPage, cursor: { before, after } } = pagination;
    const { data, loading } = useAdminLogQuery({
        rowsPerPage,
        before,
        after,
        startAt: filter.startDate,
        endAt: filter.endDate,
        user_Username_Icontains: filter.filterValues.accountNumber,
        user_Username_Istartswith: filter.filterValues.accountNumber
    });
    if (loading) {
        return <Loading />;
    }
    const logAdmins = data.logAdmins.edges ? data.logAdmins.edges : null 
    const pageInfo = data.logAdmins.pageInfo
    const count = data.logAdmins.totalCount
    
    // return <Query query={LOG_MANAGEMENT_QUERY} client={mockClient}>
    //     {({ loading, error, data }) => {
    //         if (loading) return <div/>;
    //         const {userLoginLog} = data;
    //         const count = userLoginLog.length
            
            return <Grid>
                <Title pageTitle={strings.logManagement} />
                
                <Paper className={classes.root} style={{ marginTop: "20px" }}>
                <Grid container>
                    <Typography variant='h6'>{strings.administratorOperationLog}</Typography>
                </Grid>

                <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }}/>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                        <Grid item style={{ marginLeft: 10 }}>
                            <Typography color="textSecondary">{strings.accountNumber}:</Typography>
                        </Grid>
                        <Grid item>
                            <TextField 
                                onChange={handleFilterChange}
                                value={filterValues.accountNumber}
                                name="accountNumber"
                                type="text" 
                                variant="outlined" 
                                margin="dense" 
                                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
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
                            <Typography color="textSecondary">{strings.operationMenu}:</Typography>
                        </Grid>
                        <Grid item>
                            <TextField type="text" variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10 }}/>
                        </Grid>               */}

                        <GrowItem/>

                        <Grid item>
                            <Button style={{ width: 100 }} onClick={clickSearch} color="primary" variant="contained">{strings.searchFor}</Button>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item>	
                <SimpleTable
                    tableProps={{size: "small"}}
                    hasPagination={true}
                    noBorder={true}
                    pagination={pagination}
                    pageInfo={pageInfo}
                    count={count}
                    cols={6}
                    columns={
                        <TableRow>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.numbering}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.operationrAccount}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.operationMenu}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.operationContent}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.loginIP}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.operatingTime}</TableCell>
                        </TableRow>
                    }
                    rows={
						logAdmins.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={6}>{strings.noDataAvailable}</TableCell>
						</TableRow>
						:
                        logAdmins.length > 0 ? logAdmins.map((o, index) => {
                            let updatedAtUTC = moment.utc(o.node? o.node.updatedAt : null).format('YYYY-MM-DD HH:mm:ss')
                            let updatedAtLocal = moment.utc(updatedAtUTC).local().format('YYYY-MM-DD HH:mm:ss');
                            return <TableRow key={index}>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{o.node ? o.node.pk : null}</TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}><Button style={{ color: "blue", textTransform: "none" }} onClick={() => history.push({pathname: `${USER_MANAGEMENT}/${o.node ? o.node.user.username : null }`, state: 'userManagement'})}>{o.node ? o.node.user.username : null}</Button></TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings[o.node ? o.node.logType.toLowerCase() : null]}</TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{o.node ? o.node.note : null}{ o.node ? strings.operationIs : null}{strings[o. node ? o.node.saveType.toLowerCase() : null]}</TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{o.node ? o.node.ip ? o.node.user.notes ? o.node.ip + " " + o.node.user.notes : o.node.ip : null : null}</TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{updatedAtLocal === "Invalid date" ? null : updatedAtLocal}</TableCell>
                            </TableRow> 

                        })
						:  
                        <TableRow>
                            <TableCell align="center" colSpan={6}>{strings.noDataAvailable}</TableCell>
                        </TableRow>
                        
                    }     
                />
                </Grid>
                </Paper>
            </Grid>

        }