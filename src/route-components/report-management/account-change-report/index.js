 
import React, {useState} from 'react';
import {Paper, TableCell, TableRow, Grid, Button, Typography,
 TextField, Divider
} from '@material-ui/core'; 
import {SimpleTable, GrowItem, AppDateRangePicker, Title, Loading} from '../../../components';   
import {makeStyles} from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import {ACCOUNT_CHANGE_REPORT} from '../../../paths';
import useAccountChangeReport from '../../../queries-graphql/report-management/account-change-report';
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

 
 
export default function RechargeReport(props) {
  const classes = useStyles();
  const strings = useLanguages(ACCOUNT_CHANGE_REPORT);  

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
    startDate: '2018-09-02',
    endDate: '2019-12-20'
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
        startDate: '2018-09-02',
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
  const {data, loading} = useAccountChangeReport({
    startAt: filter.startDate, 
    endAt: filter.endDate,
    user_Username_Icontains: filter.accountNumber,
    rowsPerPage,
    before,
    after,
    page
  });

  if(loading) {
      return <Loading />
  }
    
  const accountChangeReport = data.memberBankRecord.edges;
  const pageInfo = data.memberBankRecord.pageInfo;
  const count = data.memberBankRecord.totalCount;
  
  return <Paper elevation={1} className={classes.paper}>
        <Title pageTitle={strings.financialReport} />
        <Grid container spacing={2} direction="column">
          <Grid item><Typography variant="h6">{strings.financialReport}</Typography></Grid>
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
              <Button color="primary" variant="contained" onClick={clickSearch}>{strings.searchFor}</Button>
            </Grid>
          </Grid> 
          <Grid item style={{paddingTop: 0}}>
            <SimpleTable
              tableProps={{size: "small"}}
              hasPagination={true}
              noBorder={true}
              pageInfo={pageInfo}
              count={count}
              pagination={pagination}
              columns={
                <TableRow>
                  <TableCell>{strings.transactionFlow}</TableCell>
                  <TableCell>{strings.proxyAccount}</TableCell>
                  <TableCell>{strings.affiliatedAgent}</TableCell>
                  <TableCell>{strings.transactionHour}</TableCell>
                  <TableCell>{strings.transactionType}</TableCell>
                  <TableCell align="right">{strings.preTransaction}</TableCell>
                  <TableCell align="right">{strings.rechargeFee}</TableCell> 
                  {/* <TableCell>{strings.theTransactionAccount}</TableCell> */}
                  <TableCell align="right">{strings.postTradeAmount}</TableCell>
                  <TableCell>{strings.transactionNote}</TableCell> 
                </TableRow>
              }
              rows={
                accountChangeReport.length === 0 ? 
                <TableRow>
                  <TableCell align="center" colSpan={9}>没有可用数据</TableCell>
                </TableRow>
                :
                accountChangeReport.map((o, index) => 
                <TableRow key={index}>
                  <TableCell>{o.node.orderId}</TableCell>
                  <TableCell>{o.node.username}</TableCell>
                  {/* <TableCell>
                    {
                      o.node.user.affiliateProfile ? 
                      o.node.user.affiliateProfile.parent ?
                      o.node.user.affiliateProfile.parent.user ?
                      o.node.user.affiliateProfile.parent.user.username
                      :
                      "公司"
                      :
                      "公司"
                      :
                      "公司"
                    }
                  </TableCell> */}
                  <TableCell>{o.node.parentUsername}</TableCell>
                  <TableCell>{moment(o.node.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                  <TableCell>
                    {
                      strings[o.node.type]
                    }
                  </TableCell>
                  <TableCell align="right">{o.node.balanceBefore ? o.node.balanceBefore.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell align="right">{o.node.amount ? o.node.amount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell> 
                  {/* <TableCell>{o.node.user.id}</TableCell> */}
                  <TableCell align="right">{o.node.balance ? o.node.balance.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell>{o.node.remark}</TableCell>
                </TableRow>)
              }
            />
          </Grid>
        </Grid> 
        
      </Paper>
}