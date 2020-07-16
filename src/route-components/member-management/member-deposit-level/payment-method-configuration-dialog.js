import React from 'react';
import {
	Grid, 
	Dialog, 
	DialogContent, 
	DialogTitle,
	Button,
	Box,
	Divider,
	Typography,
	IconButton
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import { Close,CardGiftcard,ImportantDevices, Done, DonutSmall, CreditCard } from '@material-ui/icons'; 
// import {GrowItem} from '../../../components'; 
// import {ReactComponent as CompanyDepositSVG} from '../../../icons/company-deposit.svg'
// import {ReactComponent as CompanyDeposit1SVG} from '../../../icons/company-deposit1.svg'
// import {ReactComponent as OnlinePaymentSVG} from '../../../icons/online-payment.svg'
// import {ReactComponent as OnlinePayment1SVG} from '../../../icons/online-payment1.svg'
  
import WeChatPay from '../../../icons/weChatPay.png';
import Alipay from '../../../icons/aliPay.png';
import Icon1 from '../../../icons/icon1.png';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative'
	},
	padding: {
		padding: theme.spacing(2),
		'& div + div': {
			marginTop: theme.spacing(1)
		}
	},
	closeIcon: {
		position: 'absolute',
		top: 8,
		right: 8
	}, 
	dialogTry: {
		msOverflowY: 'none'
	}
}));
  
export default function PaymentMethodConfigurationDialog({open, handleClose, strings, selected}) {
 
	const classes = useStyles();
 

	const [state, setState] = React.useState({
		isOnline: true,
		checkedA: false,
		checkedB: false,
		checkedC: false,
		checkedD: false,
		checkedE: false,
		checkedF: false,
		checkedG: false,
		checkedH: false,
		checkedI: false,
		checkedJ: false,
		checkedK: false,
		checkedL: false,
	});
	
	function clear(){
		setState({
		isOnline: true,
		checkedA: false,
		checkedB: false,
		checkedC: false,
		checkedD: false,
		checkedE: false,
		checkedF: false,
		checkedG: false,
		checkedH: false,
		checkedI: false,
		checkedJ: false,
		checkedK: false,
		checkedL: false,
		})
	}

	function clearAndHandleClose() {
		handleClose()
		clear()
	}
	
  const handleChange = name => event => { 
    setState({ ...state, [name]: !state[name] });
  };

	return <Dialog open={open} onClose={clearAndHandleClose} aria-labelledby="form-dialog-title" fullWidth={true}
	maxWidth="xs" >
		<IconButton className={classes.closeIcon} size="small" onClick={clearAndHandleClose}>
			<Close/>
		</IconButton>
		<DialogTitle id="form-dialog-title">
			<Typography className={classes.paper} variant="h5">{strings.selectMethod}</Typography>
			<Divider />
		</DialogTitle>
		<DialogContent  > 
  			<Box my={1}>

			<Grid container direction="row"	justify="space-evenly" alignItems="center" spacing={1} style={{marginBottom: 13}}>
				<Grid item md={6} xs={12}>
					<Button size="large" color={ state.isOnline === true ? "primary" : "default"} variant="outlined" fullWidth={true} onClick={()=>{ setState({ ...state, isOnline: true }); }}> 
						<Grid container direction="column" >
							<Box mx="auto">
								<CardGiftcard /> 
								<Typography   color={state.isOnline === true ? "default" : "textSecondary"}  >{strings.companyDeposit}</Typography> 
							</Box>
						</Grid>
					</Button>
				</Grid>
				<Grid item md={6} xs={12}>
					<Button size="large" color={ state.isOnline === false ? "primary" : "default"} variant="outlined"  fullWidth={true} onClick={()=>{ setState({ ...state, isOnline: false }); }}>
						<Grid container direction="column" >
							<Box mx="auto">
								<ImportantDevices /> 
								<Typography   color={state.isOnline === false ? "default" : "textSecondary"}  >{strings.onlinePayment}</Typography> 
							</Box>
						</Grid> 
					</Button>
				</Grid>
			</Grid>  

				<Divider />

		

			<Grid container direction="row" spacing={1} >
				<Grid item md={12}>
					<Box my={1}> 
						<Typography color="textSecondary"> {strings.warning2} </Typography>
					</Box>
				</Grid>

				{
					state.isOnline === true ? 
					<Grid container direction="row" spacing={1} >
						<Grid item md={6} xs={12}>
							<Button color={state.checkedB === true ? "primary" : "default"} variant={state.checkedB === true ? "contained" : "outlined"}fullWidth={true} 
											onClick={handleChange('checkedB')}> 
								<Grid container  direction="row"  justify="space-between"  alignItems="center"> 
										<CreditCard color={state.checkedB === true ? "inherit" : "error"} />  
										<Typography >••• ••• 700</Typography>  
										{
											state.checkedB === true ? <Done /> : <div/> 
										}  
								</Grid>
							</Button>
						</Grid>  
						<Grid item md={6} xs={12}>
							<Button color={state.checkedF === true ? "primary" : "default"} variant={state.checkedF === true ? "contained" : "outlined"}fullWidth={true} 
											onClick={handleChange('checkedF')}> 
								<Grid container  direction="row"  justify="space-between"  alignItems="center"> 
										<DonutSmall color={state.checkedF === true ? "inherit" : "error"} />  
										<Typography >••• ••• 700</Typography>  
										{
											state.checkedF === true ? <Done /> : <div/> 
										}  
								</Grid>
							</Button>
						</Grid>  
						<Grid item md={6} xs={12}>
							<Button color={state.checkedC === true ? "primary" : "default"} variant={state.checkedC === true ? "contained" : "outlined"}fullWidth={true} 
											onClick={handleChange('checkedC')}> 
								<Grid container  direction="row"  justify="space-between"  alignItems="center"> 
										<CreditCard color={state.checkedC === true ? "inherit" : "error"} />  
										<Typography >••• ••• 700</Typography>  
										{
											state.checkedC === true ? <Done /> : <div/> 
										}  
								</Grid>
							</Button>
						</Grid>  
						<Grid item md={6} xs={12}>
							<Button color={state.checkedD === true ? "primary" : "default"} variant={state.checkedD === true ? "contained" : "outlined"}fullWidth={true} 
											onClick={handleChange('checkedD')}> 
								<Grid container  direction="row"  justify="space-between"  alignItems="center"> 
										<DonutSmall color={state.checkedD === true ? "inherit" : "error"} />  
										<Typography >••• ••• 700</Typography>  
										{
											state.checkedD === true ? <Done /> : <div/> 
										}  
								</Grid>
							</Button>
						</Grid>  
						<Grid item md={6} xs={12}>
							<Button color={state.checkedE === true ? "primary" : "default"} variant={state.checkedE === true ? "contained" : "outlined"}fullWidth={true} 
											onClick={handleChange('checkedE')}> 
								<Grid container  direction="row"  justify="space-between"  alignItems="center"> 
										<CreditCard color={state.checkedE === true ? "inherit" : "error"} />  
										<Typography >••• ••• 700</Typography>  
										{
											state.checkedE === true ? <Done /> : <div/> 
										}  
								</Grid>
							</Button>
						</Grid>  
						<Grid item md={6} xs={12}>
						<Button color={state.checkedA === true ? "primary" : "default"} variant={state.checkedA === true ? "contained" : "outlined"}fullWidth={true} 
										onClick={handleChange('checkedA')}> 
							<Grid container  direction="row"  justify="space-between"  alignItems="center"> 
									<DonutSmall color={state.checkedA === true ? "inherit" : "error"} />  
									<Typography >••• ••• 700</Typography>  
									{
										state.checkedA === true ? <Done /> : <div/> 
									}  
							</Grid>
						</Button>
					</Grid>  
					</Grid>				
					: 
					<Grid container direction="row" spacing={1} > 

						<Grid item md={6} xs={12}> 
							<img alt="wechatpay" src= {WeChatPay} />
						</Grid>  

						<Grid item md={6} xs={12} >
							<Grid container direction="row"  justify="space-between"  alignItems="center" >	
								<Grid item md={6} xs={12}>
									<Button   color={state.checkedG === true ? "primary" : "default"} variant={state.checkedG === true ? "contained" : "outlined"} 
											onClick={handleChange('checkedG')}>  
										<Typography > {strings.smilePayment} </Typography> 
									</Button>		
								</Grid>
								<Grid item md={6} xs={12}>
									<Button color={state.checkedH === true ? "primary" : "default"} variant={state.checkedH === true ? "contained" : "outlined"}  
											onClick={handleChange('checkedH')}>  
										<Typography >{strings.ringPayment} </Typography>   
									</Button>
								</Grid>
							</Grid>
						</Grid>  
						
						<Grid item md={6} xs={12}>
							<img src= {Alipay} />
						</Grid>  

						<Grid item md={6} xs={12}>
							<Grid container direction="row"  justify="space-between"  alignItems="center" >	
								<Grid item md={6} xs={12}>
									<Button   color={state.checkedI === true ? "primary" : "default"} variant={state.checkedI === true ? "contained" : "outlined"} 
											onClick={handleChange('checkedI')}>  
										<Typography > {strings.smilePayment} </Typography> 
												 
									</Button>		
								</Grid>
								<Grid item md={6} xs={12}>
									<Button color={state.checkedJ === true ? "primary" : "default"} variant={state.checkedJ === true ? "contained" : "outlined"}  
										onClick={handleChange('checkedJ')}>  
										<Typography >{strings.ringPayment} </Typography>  
									</Button>
								</Grid>
							</Grid>
						</Grid>  

						<Grid item md={6} xs={12}>
							<img src= {Icon1} />
						</Grid>  
						
						<Grid item md={6} xs={12}>
							<Grid container direction="row"  justify="space-between"  alignItems="center" >	
								<Grid item md={6} xs={12}>
									<Button   color={state.checkedK === true ? "primary" : "default"} variant={state.checkedK === true ? "contained" : "outlined"} 
													onClick={handleChange('checkedK')}>  
										<Typography > {strings.smilePayment} </Typography>  
									</Button>		
								</Grid>
								<Grid item md={6} xs={12}>
									<Button color={state.checkedL === true ? "primary" : "default"} variant={state.checkedL === true ? "contained" : "outlined"}  
											onClick={handleChange('checkedL')}>  
										<Typography >{strings.ringPayment} </Typography>      
									</Button>
								</Grid>
							</Grid>
						</Grid>  				

					</Grid>	
				}   
			</Grid> 
				</Box>
		</DialogContent>
		<Grid container direction="column" className={classes.padding}>
			<Grid item >
				<Button onClick={clear} variant="contained" color="primary" fullWidth={true} >
					{strings.determine}
				</Button>
			</Grid>
			<Grid item  >
				<Button onClick={clearAndHandleClose}  fullWidth={true}>
					{strings.cancel}
				</Button>
			</Grid>
		</Grid>
	</Dialog>
}