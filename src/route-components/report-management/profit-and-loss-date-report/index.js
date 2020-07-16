 
import React, { useState, Fragment } from 'react';
import {Paper, TableCell, TableRow, Grid, Button, Typography,
  Divider
} from '@material-ui/core'; 
import {SimpleTable,GrowItem,AppDateRangePicker, Title, Loading} from '../../../components';   
import {makeStyles} from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import {PROFIT_AND_LOSS_DATE_REPORT} from '../../../paths';

import useProfitAndLossDateReport from '../../../queries-graphql/report-management/profit-and-loss-date-report';
import usePagination from '../../../hooks/use-pagination';
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

 
 
export default function ProfitAndLossDateReport(props) {
  const classes = useStyles();
  const strings = useLanguages(PROFIT_AND_LOSS_DATE_REPORT);   

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
      // startDate: moment().format("YYYY-MM-DD").toString(),
      // endDate: moment().add(1, 'days').format("YYYY-MM-DD").toString()
    })

    function clickSearch() {
      // setFilter(filterValues)
      
           
      setFilter({
        // accountNumber: filterValues.accountNumber,
        startDate: filterValues.startDate ? filterValues.startDate.format("YYYY-MM-DD").toString() : null,
        endDate: filterValues.endDate ? filterValues.endDate.format("YYYY-MM-DD").toString() : null
      })

      setCursor({
        before: null,
        after: null
      })
      setPage(0)

    }
      
    const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after}, page, setCursor, setPage } = pagination;
    const {data, loading} = useProfitAndLossDateReport({
      startAt: filter.startDate, 
      endAt: filter.endDate,
      rowsPerPage,
      before,
      after,
      page
    });

    if(loading) {
        return <Loading />
    }
      
    const profitAndLossDateReport = data.betDayReport.edges;
    const pageInfo = data.betDayReport.pageInfo;
    const count = data.betDayReport.totalCount;    

      return <Paper elevation={1} className={classes.paper}> 
        <Title pageTitle={strings.profitAndLossDateReport} />
        <Grid container spacing={2} direction="column">
          <Grid item><Typography variant="h6">{strings.profitAndLossDateReport}</Typography></Grid>
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
              <Button color="primary" variant="contained" onClick={clickSearch}>{strings.searchFor}</Button>
            </Grid>
          </Grid> 

          <Grid item style={{paddingTop: 0}}>
            <SimpleTable
              tableProps={{size: "small"}}
              hasPagination={true}
              pageInfo={pageInfo}
              noBorder={true}
              count={count}
              pagination={pagination}
              columns={
                <TableRow>
                  <TableCell>{strings.date}</TableCell>
                  <TableCell align="right">{strings.numberOfBets}</TableCell>
                  <TableCell align="right">{strings.numberOfPeopleBets}</TableCell>
                  <TableCell align="center" style={{ minWidth: 250 }}>{strings.effectiveBet}</TableCell>
                  <TableCell align="center" style={{ minWidth: 250 }}>{strings.prizeAmount}</TableCell>
                  <TableCell align="center" style={{ minWidth: 250 }}>{strings.betAmount}</TableCell>
                  <TableCell align="center" style={{ minWidth: 250 }}>{strings.profitAndLoss}</TableCell> 
                </TableRow>
              }
              rows={
                profitAndLossDateReport.length === 0 ? 
                <TableRow>
                  <TableCell align="center" colSpan={7}>没有可用数据</TableCell>
                </TableRow>
                :
                profitAndLossDateReport.map((o, index) => <TableRow key={index}> 
                  <TableCell>{o.node.day}</TableCell>
                  <TableCell >{o.node.betCount}</TableCell>
                  <TableCell >{o.node.betUsers}</TableCell>
                  <TableCell >{o.node.betAmount ?  <Fragment>&yen; { o.node.betAmount.toLocaleString('en', { maximumFractionDigits: 2 }) }</Fragment> : "-"}</TableCell>
                  <TableCell >{o.node.betValidAmount ? <Fragment>&yen; { o.node.betValidAmount.toLocaleString('en', { maximumFractionDigits: 2 }) }</Fragment> : "-"}</TableCell>
                  <TableCell >{o.node.betPayout ? <Fragment>&yen; { o.node.betPayout.toLocaleString('en', { maximumFractionDigits: 2 }) }</Fragment> : "-"}</TableCell>
                  <TableCell >{o.node.betSub ? <Fragment>&yen; { o.node.betSub.toLocaleString('en', { maximumFractionDigits: 2 }) }</Fragment> : "-"}</TableCell> 
                </TableRow>)
              }
            />
          </Grid>
          
        </Grid> 
        
      </Paper> 
}