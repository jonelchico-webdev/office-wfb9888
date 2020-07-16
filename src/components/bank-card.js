import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import bankImage1 from '../images/BankCardBlue.png'

const useStyle = makeStyles(theme => ({
  root: { 
		borderRadius: 10,
		backgroundColor: '#E3E9F0',
    padding: '20px 50px',
    color: '#ffffff',
    fontStyle: 'bold',
		backgroundImage: `url(${bankImage1}) no-repeat center center fixed`,
		backgroundSize: 'cover', 
		maxHeight: 435,
    maxWidth: 300, 
    marginLeft: 12,
    marginRight: 12,
		[theme.breakpoints.up('sm')]: {
      marginBottom: 8,
      marginTop: 8,
		},

  }
}));

export default function BankCard(props) { 
    const classes = useStyle();
    const {dataContent} = props; 
  return (
    
    <Grid item container direction="row" justify="flex-start" className={classes.root} xs={5} > 
      <Grid item >
        <Typography variant="h4">{dataContent.bankName}</Typography>
        <Typography variant="h6"> {dataContent.cardNumber}</Typography>
        <Typography variant="h6"> {dataContent.nameOnCard}</Typography>
        <Typography variant="subtitle1">{dataContent.branch}</Typography>
      </Grid>
    </Grid>
  );
}