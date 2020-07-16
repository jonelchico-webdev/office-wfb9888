 
import React, {useState} from 'react';
import {Paper, TableCell, TableRow, Grid, Button, Typography,
  Divider
} from '@material-ui/core'; 
import { SimpleTable, GrowItem, AppDateRangePicker, Title } from '../../../components';   
import {makeStyles} from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import {USER_REPORT} from '../../../paths';
import useUserReport from '../../../queries-graphql/report-management/user-report';
import usePagination from '../../../hooks/use-pagination'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  textfield: {
      backgroundColor: '#ffffff',
  },
}));

 
 
export default function UserReport(props) {
    const classes = useStyles();
    const strings = useLanguages(USER_REPORT);

    const [filterValues, setFilterValues] = React.useState({
      startDate: null,
      endDate: null, 
      accountNumber: '',
      id: '',      
    }); 

    function clear(){
      setFilterValues({
          startDate: null,
          endDate: null, 
          accountNumber: '',
          id: '',      
      })
    }

    // function handleFilterChange(event) { 
    //   event.persist();
    //   setFilterValues(oldValues => ({
    //     ...oldValues,
    //     [event.target.name]: event.target.value
    //   }));
    // }

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
  
    const [filter, setFilter] = React.useState({
      accountNumber: '',
      // startDate: '2009-01-01',
      // endDate: moment().format("YYYY-MM-DD").toString()
    })
  
    function clickSearch() {
      setCursor({
        before: null,
        after: null
      })
      setPage(0)
      setFilter(filterValues)
      setFilter({
        accountNumber: filterValues.accountNumber,
        startDate: filterValues.startDate ? filterValues.startDate.format("YYYY-MM-DD").toString() : moment().format("YYYY-MM-DD").toString(),
        endDate: filterValues.endDate ?  filterValues.endDate.format("YYYY-MM-DD").toString() :  moment().format("YYYY-MM-DD").toString()
      })
    }

    const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after}, page, setCursor, setPage } = pagination;
    const {data, loading} = useUserReport({
      userName: filter.accountNumber,
      startAt: filter.startDate,
      endAt: filter.endDate,
      rowsPerPage,
      before,
      after,
      page
    });

    if(loading) {
        return null;
    }

    const userReport = data.dailyMemberReport.edges;
    const pageInfo = data.dailyMemberReport.pageInfo;
    const count = data.dailyMemberReport.totalCount;
    
    return <Paper elevation={1} className={classes.paper}>
      <Title pageTitle={strings.userReport} />
      <Grid container spacing={2} direction="column">
        <Grid item><Typography variant="h6">{strings.userReport}</Typography></Grid>
        <Grid item style={{
          paddingTop: 0,
          paddingBottom: 0
        }}>
    <Divider light={true} orientation="vertical"/>
    </Grid>
        <Grid item container alignItems="center" spacing={1}> 
          {/* <Grid item>
            <Typography>{strings.accountNumber}:</Typography>
          </Grid>

          <Grid item style={{width: 140}}>
            <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="accountNumber" className={classes.textfield}
              onChange={handleFilterChange} value={filterValues.accountNumber}/>
          </Grid> */}
          <Grid item>
              <Typography>{strings.date}:</Typography>
          </Grid>
          <Grid item>
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
            <Button color="primary"  onClick={clear} className={classes.button} >{strings.clearFilter}</Button> 
          </Grid> 

          <Grid item>
            <Button color="primary" onClick={clickSearch} variant="contained" >{strings.searchFor}</Button>
          </Grid>
        </Grid> 
        <Grid item style={{paddingTop: 0}}>
          <SimpleTable
            tableProps={{ size: "small" }}
            hasPagination={true}
            pageInfo={pageInfo}
            count={count}
            noBorder={true}
            pagination={pagination}
            columns={
              <TableRow>
                <TableCell>{strings.date}</TableCell>
                <TableCell align="right">{strings.activeUser}</TableCell>
                <TableCell align="right">{strings.numberOfBets}</TableCell>
                <TableCell align="right">{strings.newUsers}</TableCell>
                <TableCell align="right">{strings.newUserRecharge}</TableCell>
                <TableCell>{strings.retainedTheNextDay}</TableCell>
                <TableCell>{strings.threeDaysOfRetention}</TableCell>
                <TableCell>{strings.fiveDaysToSurvive}</TableCell>
                <TableCell>{strings.retainedOnThe7th}</TableCell>
                <TableCell>{strings.remainingOnThe15thDay}</TableCell> 
              </TableRow>
            }
            rows={
              userReport.length === 0 ? 
              <TableRow>
                <TableCell align="center" colSpan={10}>没有可用数据</TableCell>
              </TableRow>
              :
              userReport.map((o, index) => <TableRow key={index}> 
                <TableCell align="right">{o.node.day}</TableCell>
                <TableCell align="right">{o.node.activeMemberCount}</TableCell>
                <TableCell align="right">{o.node.betUsers}</TableCell>
                <TableCell align="right">{o.node.registerMemberCount}</TableCell>
                <TableCell align="right">{o.node.depositAmount ? o.node.depositAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                <TableCell>{o.retainedTheNextDay ? o.retainedTheNextDay : '-'}</TableCell>
                <TableCell>{o.threeDaysOfRetention ? o.threeDaysOfRetention : '-'}</TableCell>
                <TableCell>{o.fiveDaysToSurvive ? o.fiveDaysToSurvive : '-'}</TableCell>
                <TableCell>{o.retainedOnThe7th ? o.retainedOnThe7th : '-'}</TableCell>
                <TableCell>{o.remainingOnThe15thDay ? o.remainingOnThe15thDay : '-'}</TableCell> 
              </TableRow>)
            }
          />
        </Grid>
      </Grid> 
      
    </Paper>
}