
import React, { Fragment } from 'react';
import { Title } from '../../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { OPERATIONAL_GENERAL_REPORT } from '../../../paths';
import ProxyData from './proxy-data'
import TotalData from './total-data'
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
  paperSplit: {
    marginTop: theme.spacing(3)
  },
  hoverPointer: {
    cursor: 'pointer'
  },
}));

export default function OperationalGeneralReport(props) {
  const {history} = props
  const classes = useStyles();
  const strings = useLanguages(OPERATIONAL_GENERAL_REPORT);
  const [filter, setFilter] = React.useState({
    isAgent: false,
    userName: '',
		startAt:  moment().format("YYYY-MM-DD").toString(),
		endAt:  moment().add(1, "days").format("YYYY-MM-DD").toString()
	  })

  return <Fragment>
    <Title pageTitle={strings.operationalGeneralReport} />
    <TotalData filter={filter} setFilter={setFilter} strings={strings} classes={classes} />
    <ProxyData filter={filter} setFilter={setFilter} url={OPERATIONAL_GENERAL_REPORT} strings={strings} classes={classes} history={history}/>
  </Fragment>
}