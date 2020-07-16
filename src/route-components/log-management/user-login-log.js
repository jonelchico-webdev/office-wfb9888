import React, { useState } from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField} from '@material-ui/core';
import { SimpleTable } from '../../components';
import { GrowItem } from '../../components';
import Title from '../../components/title';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { USER_LOGIN_LOG, USER_MANAGEMENT } from '../../paths';
import { AppDateRangePicker } from '../../components/date-picker';
import usePagination from '../../hooks/use-pagination';
import {Loading} from '../../components';
import {useUserLogQuery} from '../../queries-graphql/log-management/log-user'
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
    const strings = useLanguages(USER_LOGIN_LOG);

    const {history} = props;

    const [filterValues, setFilterValues] = React.useState({
		startDate: null,
        endDate: null,
        accountNumber: ''
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

    function handleFilterChange(event) {
		event.persist()
		setFilterValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

    const [filter, setFilter] = useState({
        filterValues: [],
        startDate: null,
		endDate: null
    });

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
    const { data, loading } = useUserLogQuery({
        rowsPerPage,
        before,
        after,
        startAt: filter.startDate,
        endAt: filter.endDate,
        logType: "login",
        user_Username_Icontains: filter.filterValues.accountNumber,
        user_Username_Istartswith: filter.filterValues.accountNumber
    });
    if (loading) {
        return <Loading />;
    }

    const logUsers = data.logUsers.edges
    const pageInfo = data.logUsers.pageInfo
    const count = data.logUsers.totalCount

    // return <Query query={USER_MANAGEMENT_QUERY} client={mockClient}>
    //     {({ loading, error, data }) => {
    //         if (loading) return <div/>;
    //         const {userManagement} = data;
    //         const count = userManagement.length
            
            return <Grid>
                <Title pageTitle={strings.logManagement} />
                
                <Paper className={classes.root} style={{ marginTop: "20px" }}>
                <Grid container>
                    <Typography variant='h6'>{strings.userLoginLog}</Typography>
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

                        <GrowItem/>

                        <Grid item>
                            <Button style={{ width: 100 }} color="primary" onClick={clickSearch} variant="contained">{strings.searchFor}</Button>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item>	
                <SimpleTable
                    tableProps={{size: "small"}}
                    hasPagination={true}
                    pagination={pagination}
                    noBorder={true}
                    pageInfo={pageInfo}
                    count={count}
                    cols={5}
                    columns={
                        <TableRow>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.numbering}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.playerAccount}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.affiliatedAgent}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.loginTime}</TableCell>
                            <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{strings.loginIP}</TableCell>
                        </TableRow>
                    }
                    rows={
						logUsers.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={5}>{strings.noDataAvailable}</TableCell>
						</TableRow>
						:
                        logUsers.length > 0? logUsers.map((o, index) => {
                            let lastLoginTimeUTC = moment.utc(o.node.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                            let lastLoginTimeLocal = moment.utc(lastLoginTimeUTC).local().format('YYYY-MM-DD HH:mm:ss');

                            return <TableRow key={index}>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{o.node.pk}</TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}><Button style={{ color: "blue", textTransform: "none" }} onClick={() => history.push({pathname: `${USER_MANAGEMENT}/${o.node.user.username}`, state: 'userManagement'})}>{o.node.user.username}</Button></TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{o.node.user.affiliateProfile && o.node.user.affiliateProfile.parent ? o.node.user.affiliateProfile.parent.user.username : strings.theCompany}</TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{lastLoginTimeLocal}</TableCell>
                                <TableCell align="right" style={{whiteSpace: 'nowrap'}}>{o.node.ip ? o.node.user.notes ? o.node.ip + " " + o.node.user.notes : o.node.ip : null}</TableCell>
                            </TableRow> 

                        })
						: 
                        <TableRow>
							<TableCell align="center" colSpan={5}>{strings.noDataAvailable}</TableCell>
						</TableRow>
                       
                    }     
                />
                </Grid>
                </Paper>
            </Grid>

        }
//     }
//     </Query>
// }