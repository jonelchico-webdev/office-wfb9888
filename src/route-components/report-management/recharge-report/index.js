
import React, { useState } from 'react';
import {
  Paper, TableCell, TableRow, Grid, Button, Typography,
  TextField, Divider
} from '@material-ui/core';
import { SimpleTable, GrowItem, AppDateRangePicker, Title } from '../../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { RECHARGE_REPORT } from '../../../paths';
import useRechargeReport from '../../../queries-graphql/report-management/recharge-report';
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



export default function RechargeReport() {
  const classes = useStyles();
  const strings = useLanguages(RECHARGE_REPORT);

  const [filterValues, setFilterValues] = React.useState({
    startDate: null,
    endDate: null,
    accountNumber: '',
    id: '',
  });

  function clear() {
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
    startDate: '2000-01-01',
		endDate: moment().format("YYYY-MM-DD").toString()
  })

  function clickSearch() {
    setCursor({
      before: null,
      after: null
    })
    setPage(0)
    setFilter({
      accountNumber: filterValues.accountNumber,
      startDate: filterValues.startDate ? filterValues.startDate.format("YYYY-MM-DD").toString() : '2000-01-01',
		  endDate: filterValues.endDate ?  filterValues.endDate.format("YYYY-MM-DD").toString() :  moment().format("YYYY-MM-DD").toString()
    })
  }

  const pagination = usePagination();
  const { rowsPerPage, cursor: {before, after}, page, setCursor, setPage } = pagination;
  const {data, loading} = useRechargeReport({
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

  const useProfitAndLossDateStatement = data.financeReport.edges;
  const pageInfo = data.financeReport.pageInfo;
  const count = data.financeReport.totalCount;

      return <Paper elevation={1} className={classes.paper}>
        <Title pageTitle={strings.rechargeReport} />
        <Grid container spacing={2} direction="column">
          <Grid item><Typography variant="h6">{strings.rechargeReport}</Typography></Grid>
          <Grid item style={{
            paddingTop: 0,
            paddingBottom: 0
          }}>
            <Divider light={true} orientation="vertical" />
          </Grid>
          <Grid item container alignItems="center" spacing={1}>
            <Grid item>
              <Typography>{strings.accountNumber}:</Typography>
            </Grid>

            <Grid item style={{ width: 140 }}>
              <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="accountNumber" className={classes.textfield}
                onChange={handleFilterChange} value={filterValues.accountNumber} />
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


            <GrowItem />
            <Grid item>
              <Button color="primary" onClick={clear} className={classes.button} >{strings.clearFilter}</Button>
            </Grid>

            <Grid item>
              <Button color="primary" variant="contained" onClick={clickSearch}>{strings.searchFor}</Button>
            </Grid>
          </Grid>
          <Grid item style={{ paddingTop: 0 }}>
            <SimpleTable
              tableProps={{ size: "small" }}
              hasPagination={true}
              pageInfo={pageInfo}
              noBorder={true}
              count={count}
              pagination={pagination}
              columns={
                <TableRow>
                  <TableCell>{strings.proxyAccount}</TableCell>
                  <TableCell>{strings.affiliatedAgent}</TableCell>
                  <TableCell align="right">{strings.rechargeAmount}</TableCell>
                  <TableCell align="right">{strings.numberOfRecharges}</TableCell>
                  <TableCell align="right">{strings.rechargeNumber}</TableCell>
                  <TableCell align="right">{strings.topUpOffer}</TableCell>
                  <TableCell align="right">{strings.rechargeFee}</TableCell> 
                  <TableCell align="right">{strings.numerOfWithdrawals}</TableCell>
                  <TableCell align="right">{strings.numerOfPeopleWithdrawals}</TableCell>
                  <TableCell align="right">{strings.withdrawalAmount}</TableCell>
                  <TableCell align="right">{strings.withdrawalFee}</TableCell>
                  <TableCell align="right">{strings.charge}</TableCell> 
                </TableRow>
              }
              rows={
                useProfitAndLossDateStatement.length === 0 ? 
                <TableRow>
                  <TableCell align="center" colSpan={12}>没有可用数据</TableCell>
                </TableRow>
                :
                useProfitAndLossDateStatement.map((o, index) => <TableRow key={index}>  
                  <TableCell>{o.node.username ? o.node.username : '-'}</TableCell>
                  <TableCell>{o.node.affiliate ? o.node.affiliate : "公司"}</TableCell>
                  <TableCell align="right">{o.node.depositAmount ? o.node.depositAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell align="right">{o.node.depositCount ? o.node.depositCount : '-'}</TableCell>
                  <TableCell align="right">{o.node.depositUsers ? o.node.depositUsers : '-'}</TableCell>
                  <TableCell align="right">{o.node.depositAuditAmount ? '¥'+o.node.depositAuditAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell align="right">{o.node.depositHandlingFee ? '¥'+o.node.depositHandlingFee.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell> 
                  <TableCell align="right">{o.node.withdrawalCount ? o.node.withdrawalCount : '-'}</TableCell>
                  <TableCell align="right">{o.node.withdrawalUsers ? o.node.withdrawalUsers : '-'}</TableCell>
                  <TableCell align="right">{o.node.withdrawalAmount ? o.node.withdrawalAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell align="right">{o.node.withdrawalHandlingFee ? o.node.withdrawalHandlingFee.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
                  <TableCell align="right">{o.node.subtraction ? o.node.subtraction.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell> 
                </TableRow>)
              }
            />
          </Grid>
        </Grid>

      </Paper>
}