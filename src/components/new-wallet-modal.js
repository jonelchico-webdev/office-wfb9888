import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Modal, Button, Paper, Grid, TextField, Divider, OutlinedInput, Select, MenuItem, RadioGroup, Radio, FormControlLabel} from '@material-ui/core';
// import {useDropzone} from 'react-dropzone';
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import gql from 'graphql-tag'

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 500,

		padding: theme.spacing(2),
		outline: 'none',
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`
	},

	thick: {
		padding: theme.spacing(4)
	},

	actions: {
		paddingTop: theme.spacing(2)
	},

	thumbsContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 16
	},
	
	thumb: {
		display: 'inline-flex',
		borderRadius: 2,
		border: '1px solid #eaeaea',
		marginBottom: 8,
		marginRight: 8,
		width: 100,
		height: 100,
		padding: 4,
		boxSizing: 'border-box'
	},

	thumbInner: {
		display: 'flex',
		minWidth: 0,
		overflow: 'hidden'
	},

	img: {
		// display: 'block',
		width: 'auto',
		height: '100%'
	},
    
    hoverPointer: {
        cursor: 'pointer'
    }
}));

export default function NewWalletModal({mutate, setMutate, open, setOpen, addWallet, sortWeight, walletName, walletType, whetherToMaintain, 
		whetherToDisplay, classification, no, yes, confirm, modifyWallet, methodEdit, walletData}) {
	
	// const [files, setFiles] = useState([]);
	
	const [values, setValues] = useState({
        walletName: '',
        walletType: "electronicwallet",
        classification: '',
		whetherToMaintain: null,
		whetherToDisplay: null,
		sortWeight: null
	});

	function handleValueChange(event) {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
		if(event.target.name === "classification"){
			walletData.category = event.target.value
		}
	}

	const WALLET_MUTATION = gql`
		mutation Wallet($name: String, $type: String, $enabled: Boolean, $weight: Int, $category: String, $maintance: Boolean){
			gameWallet(input: {
				name: $name
				type: $type
				enabled: $enabled
				weight: $weight
				category: $category
				maintance: $maintance
			}){
				errors{
					field
				}
			}
	  }
	`

	const WALLET_MUTATION_UPDATE = gql`
		mutation Wallet($id: ID, $name: String, $type: String, $enabled: Boolean, $weight: Int, $category: String, $maintance: Boolean){
			gameWallet(input: {
				id: $id
				name: $name
				type: $type
				enabled: $enabled
				weight: $weight
				category: $category
				maintance: $maintance
			}){
				errors{
					field
				}
			}
	  }
	`

	const [operation] = useMutation(WALLET_MUTATION)
	const [update] = useMutation(WALLET_MUTATION_UPDATE)

    async function operateMutate() {
		if(methodEdit === true){
			const res = await update({
			   variables: { 
					id: walletData.id,
					name: values.walletName == '' ? walletData.name : values.walletName,
					type: "electronicwallet",
					weight: values.sortWeight == null ? walletData.weight : values.sortWeight,
					category: values.classification == '' ? walletData.category : values.classification,
					maintance: values.whetherToMaintain == null ? walletData.maintance : values.whetherToMaintain === 'yes' ? true : false,
					enabled: values.whetherToDisplay == null ? walletData.enabled : values.whetherToDisplay === 'yes' ? true : false,
			   }
		   });

			if(res.data.gameWallet.errors.length === 0){
				setMutate(!mutate)
				swal.fire({
					position: 'center',
					type: 'success',
					title: '电子钱包已成功更新.',
					showConfirmButton: false,
					timer: 1500
				})
			} 
		}else{
			const res = await operation({
				variables: { name: values.walletName,
					type: "electronicwallet",
					enabled: values.whetherToDisplay === 'yes' ? true : false,
					weight: values.sortWeight,
					category: values.classification,
					maintance: values.whetherToMaintain === 'yes' ? true : false
				}
			});
			
			if(res.data.gameWallet.errors.length === 0){
				setMutate(!mutate)
				swal.fire({
					position: 'center',
					type: 'success',
					title: '已成功添加新的电子钱包',
					showConfirmButton: false,
					timer: 1500
				})
			} 
		}

		setValues({
			walletName: '',
			classification: '',
			whetherToMaintain: null,
			whetherToDisplay: null,
			sortWeight: null,
		})

        setOpen(false)
		// window.location.reload(true);
    }
    
	const classes = useStyles();

	const handleClose = () => {
		setOpen(false);
	};
	
	// function removeImage(){
	// 	setFiles([])
	// }

	// const [imgSrc, setImgSrc] = useState(null);

	// const {getRootProps, getInputProps} = useDropzone({
	// 	accept: 'image/*',
	// 	onDrop: acceptedFiles => {
	// 	  setFiles(acceptedFiles.map(file => Object.assign(file, {
	// 		preview: URL.createObjectURL(file)
	// 	  })));
	// 	}
	// });
	  
	// const thumbs = files.map(file => (
	// 	<Grid key={file.name}>
	// 		{/* <Image
	// 			src={file.preview}
	// 			animationDuration='3000'
	// 			imageStyle={{height: '9.3rem', width: '100%', borderRadius: 3}}
	// 		/> */}
	// 		<Avatar alt="Profile Picture" src={file.preview} style={{height: 80, width: 80}}/>
	// 	</Grid>
	// ));

	// useEffect(() => () => {
	// 	// Make sure to revoke the data uris to avoid memory leaks
	// 	files.forEach(file => URL.revokeObjectURL(file.preview));
	// }, [files]);

	function saveHandle(event) {
		event.preventDefault();
		operateMutate();
	}

	return (
		<Modal
			aria-labelledby="modal-title"
			aria-setsize="modal-weight"
			open={open}
            onClose={handleClose}
		>
			<form className={classes.container} onSubmit={saveHandle} autoComplete="off">
				<Paper className={classes.paper}>
					<Typography variant="h6">{methodEdit ? modifyWallet : addWallet} </Typography>
					<Divider light={true} />
					<Grid container className={classes.thick}>
						<Grid container alignItems="center" justify="space-between">
							<Grid md={3}>
								<Typography>{walletName}*</Typography>
							</Grid> 
							<Grid md={8}>
								<TextField variant="outlined" fullWidth defaultValue={methodEdit ? walletData.name : values.walletName} margin="dense" name="walletName" 
										onChange={handleValueChange} required/>
							</Grid> 
						</Grid>
						<Grid container alignItems="center" justify="space-between">
							<Grid md={3}>
								<Typography>{walletType}*</Typography>
							</Grid> 
							<Grid md={8}>
								<TextField variant="outlined" fullWidth disabled defaultValue={methodEdit ? walletData.type.toLowerCase() : values.walletType} margin="dense" name="walletType" 
										onChange={handleValueChange} required/>
							</Grid> 
						</Grid>
						{/* <Grid container alignItems="center" justify="space-between" style={{marginTop: 10}}>
							<Grid md={3}>
								<Typography>{walletType}*</Typography>
							</Grid> 
							<Grid md={8}>
								<Select margin="dense"
									name="walletType"
									required
									value={methodEdit ? walletData.type.toLowerCase() : values.walletType}
									onChange={handleValueChange}
									input={<OutlinedInput notched={false} required fullWidth de name="walletType"/>}
								>
									<MenuItem value=""></MenuItem>
									<MenuItem required value="electronicwallet">electronicwallet</MenuItem>
								</Select>
							</Grid> 
						</Grid> */}
						<Grid container alignItems="center" justify="space-between" style={{marginTop: 10}}>
							<Grid md={3}>
								<Typography>{classification}*</Typography>
							</Grid> 
							<Grid md={8}>
							<Select margin="dense"
									name="classification"
									value={methodEdit ? walletData.category : values.classification}
									onChange={handleValueChange}
									input={<OutlinedInput notched={false} fullWidth name="classification"/>}
								>
									{methodEdit ? null
										:
										<MenuItem value=""></MenuItem>
									}
									<MenuItem required value="icefox">Icefox</MenuItem>
									<MenuItem required value="longmen">Longmen</MenuItem>
								</Select>
							</Grid> 
						</Grid>
						<Grid container alignItems="center" justify="space-between" style={{marginTop: 10}}>
							<Grid md={3}>
								<Typography>{whetherToDisplay}*</Typography>
							</Grid> 
							<Grid md={8}>
								<RadioGroup
									aria-label="Deposit Offer Options"
									name="whetherToDisplay"
									defaultValue={methodEdit ? walletData.enabled ? "yes" : "no" : values.whetherToDisplay}
									onChange={handleValueChange}
								>
									<Grid container justify="space-between">
										<Grid md={6}>
											<FormControlLabel value="yes" control={<Radio required color="primary"/>} label={yes} />
										</Grid>
										<Grid md={6}>
											<FormControlLabel value="no" control={<Radio required color="primary"/>} label={no} />
										</Grid>
									</Grid>
								</RadioGroup>
							</Grid> 
						</Grid>
						<Grid container alignItems="center" justify="space-between" style={{marginTop: 10}}>
							<Grid md={3}>
								<Typography>{whetherToMaintain}*</Typography>
							</Grid> 
							<Grid md={8}>
								<RadioGroup
									aria-label={whetherToMaintain}
									name="whetherToMaintain"
									defaultValue={methodEdit ? walletData.maintance ? "yes" : "no" : values.whetherToMaintain}
									onChange={handleValueChange}
								>
									<Grid container justify="space-between">
										<Grid md={6}>
											<FormControlLabel value="yes" control={<Radio required color="primary"/>} label={yes} />
										</Grid>
										<Grid md={6}>
											<FormControlLabel value="no" control={<Radio required color="primary"/>} label={no} />
										</Grid>
									</Grid>
								</RadioGroup>
							</Grid> 
						</Grid>
						{/* <Grid container alignItems="center" justify="space-between" style={{marginTop: 10}}>
							<Grid md={3}>
								<Typography>{imageFile}*</Typography>
							</Grid> 
							<Grid md={8}>
								{thumbs === ''? 
									<Grid container>
										<Grid md={6}>
											<Avatar {...getRootProps({className: 'dropzone'})}  style={{height: 80, width: 80, backgroundColor: '#80cbc4'}}>
												<AddAPhoto style={{height: 50, width: 50}}/>
												<input {...getInputProps()} />
											</Avatar>
										</Grid>
										<Grid md={6} container
										direction="row"
										alignItems="center">
											<Typography {...getRootProps({className: 'dropzone'})} className={classes.hoverPointer}>{upload}</Typography>
											<Grid container><Typography color="textSecondary">max of 20mb</Typography></Grid>
										</Grid>
									</Grid>
								:
									<Grid container>
										<Grid {...getRootProps({className: 'dropzone'})} md={6}>
											<input {...getInputProps()} />
											{thumbs}
										</Grid>
										<Grid md={6} container
										direction="row"
										alignItems="center">
											<Typography {...getRootProps({className: 'dropzone'})} className={classes.hoverPointer}>{upload}</Typography>
											<Typography style={{marginLeft: 10}} onClick={removeImage} className={classes.hoverPointer}>{remove}</Typography>
											<Grid container><Typography color="textSecondary">{files[0].name}</Typography></Grid>
										</Grid>
									</Grid>
								}
							</Grid> 
						</Grid> */}
						<Grid container alignItems="center" justify="space-between">
							<Grid md={3}>
								<Typography>{sortWeight}*</Typography>
							</Grid> 
							<Grid md={8}>
								<TextField type="number" variant="outlined" fullWidth 
									defaultValue={methodEdit ? walletData.weight : values.sortWeight} margin="dense" name="sortWeight" 
										onChange={handleValueChange} required/>
							</Grid> 
						</Grid>
					</Grid>
					<Grid container justify="center" spacing={1} className={classes.actions}>
						<Grid item>
							{
								methodEdit === false? 
								<Button disabled={values.classification === ''? true : false} variant="contained" type="submit" color="primary">{confirm}</Button>
								:
								<Button variant="contained" type="submit" color="primary">{confirm}</Button>
							}
						</Grid>
					</Grid>
				</Paper>
			</form>
		</Modal>
	);
}
