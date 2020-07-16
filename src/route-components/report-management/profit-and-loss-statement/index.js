 
import React, {useState} from 'react';
import {Paper, TableCell, TableRow, Grid, Button, Typography,
 TextField, Divider
} from '@material-ui/core'; 
import {SimpleTable,GrowItem,AppDateRangePicker, Title, Loading} from '../../../components';   
import {makeStyles} from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
// import {PROFIT_AND_LOSS_DATE_REPORT} from '../../../paths';
import {PROFIT_AND_LOSS_STATEMENT} from '../../../paths';
import useProfitAndLossDateStatement from '../../../queries-graphql/report-management/profit-and-loss-date-statement';
import usePagination from '../../../hooks/use-pagination';
import moment from 'moment'

// import Divider  from 'muicss/lib/react/divider';

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
 
export default function ProfitAndLossStatement() {
  const classes = useStyles();
  const strings = useLanguages(PROFIT_AND_LOSS_STATEMENT);   

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
 
      const [filter, setFilter] = React.useState({
        accountNumber: '',
        startDate: '2015-09-02',
        endDate: moment().format("YYYY-MM-DD").toString()
      })

      function clickSearch() {
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
        if (filterValues.startDate == null && filterValues.endDate == null) {
          setFilter({
            accountNumber: filterValues.accountNumber,
            startDate: '2015-09-02',
            endDate: moment().format("YYYY-MM-DD").toString()
          })
        } else {
          setFilter({
            accountNumber: filterValues.accountNumber,
            startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
            endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
          })
        }
      }
      
      const pagination = usePagination();
      const { rowsPerPage, cursor: {before, after}, page, setCursor, setPage } = pagination;
      const {data, loading} = useProfitAndLossDateStatement({
        startAt: filter.startDate,
        endAt: filter.endDate,
        userName: filter.accountNumber,
        rowsPerPage,
        before,
        after,
        page
      });

      if(loading) {
          return <Loading />
      }
        
      const profitAndLossStatement = data.betReport.edges;
      const pageInfo = data.betReport.pageInfo;
      const count = data.betReport.totalCount;
      
      return <Paper elevation={1} className={classes.paper}>
      <Title pageTitle={strings.profitAndLossDateStatement} />
        <Grid container spacing={2} direction="column">
          <Grid item><Typography variant="h6">{strings.profitAndLossDateStatement}</Typography></Grid>
          <Grid item style={{
            paddingTop: 0,
            paddingBottom: 0
          }}>
			<Divider light={true} orientation="vertical"/>
			</Grid>
          <Grid item container alignItems="center" spacing={1}> 
            <Grid item>
              <Typography>{strings.accountNumber}:</Typography>
            </Grid>

            <Grid item style={{width: 140}}>
              <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="accountNumber" className={classes.textfield}
                onChange={handleFilterChange} value={filterValues.accountNumber}/>
            </Grid>
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
              tableProps={{size: "small"}}
              hasPagination={true}
              pageInfo={pageInfo}
              noBorder={true}
              count={count}
              pagination={pagination}
              columns={
                <TableRow>
                  {/* <TableCell>{strings.date}</TableCell> */}
                  <TableCell>{strings.proxyAccount}</TableCell>
                  <TableCell>{strings.affiliatedAgent}</TableCell>
                  <TableCell align="center" colSpan={2}>{strings.betAmount}</TableCell>
                  <TableCell align="center" colSpan={2}>{strings.effectiveBet}</TableCell>
                  <TableCell align="center" colSpan={2}>{strings.prizeAmount}</TableCell>
                  <TableCell align="center" colSpan={2}>{strings.profitAndLoss}</TableCell> 
                </TableRow>
              }
              rows={
                profitAndLossStatement.length === 0 ? 
                <TableRow>
                  <TableCell align="center" colSpan={10}>没有可用数据</TableCell>
                </TableRow>
                :
                profitAndLossStatement.map((o, index) => <TableRow key={index}> 
                  {/* <TableCell>{o.date}</TableCell> */}
                  <TableCell>{o.node.username}</TableCell>
                  <TableCell>{o.node.affiliate ? o.node.affiliate : "公司"}</TableCell>
                  <TableCell align="right">¥</TableCell>
                  <TableCell align="right" width={150} style={{paddingRight: 50}}>{o.node.betAmount ? o.node.betAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell align="right">¥</TableCell>
                  <TableCell align="right" width={150} style={{paddingRight: 50}}>{o.node.betValidAmount ? o.node.betValidAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell align="right">¥</TableCell>
                  <TableCell align="right" width={150} style={{paddingRight: 50}}>{o.node.betPayout ? o.node.betPayout.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell align="right">¥</TableCell>
                  <TableCell align="right" width={150} style={{paddingRight: 50}}>{o.node.betSub ? o.node.betSub.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell> 
                </TableRow>)
              }
            />
          </Grid>
        </Grid> 
        
      </Paper> 
}