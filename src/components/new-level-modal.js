import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Modal, Button, Paper, Grid, IconButton, TextField} from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import CloseIcon from '../icons/close';
import {COMMON} from '../paths';
import {FormRowCenterItems} from '../components/form-layouts';
// import {useDropzone} from 'react-dropzone';
// import Image from 'material-ui-image'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 800,

		padding: theme.spacing(2),
		outline: 'none',
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`
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
	}
}));

export default function NewLevelModal({levelData, isEdit, title, open, mutate, setIsEdit, setMutate, setOpen, levelName, query, effectiveAmount, depositAmount}) {
	const strings = useLanguages(COMMON);
  	// const [files, setFiles] = useState([]);
	
	const [values, setValues] = useState({
        levelName: '',
        // levelIcons: '',
        requiredPoints: null,
        upgradeAmount: null,
		// upload: upload,
		// dropAndDropFile: dropAndDropFile
	});

	function handleChange(event) {
		event.persist();
		if(event.target.name !== "levelName"){
			setValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value < 0 ? 0 : event.target.value,
			}));
		}else{
			setValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value,
			}));
		}
	}

	const handleClose = () => {
		setOpen(!open);
		setIsEdit(false)
	};
    
	const classes = useStyles();

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
	// 		<Image
	// 			src={file.preview}
	// 			animationDuration='3000'
	// 			imageStyle={{height: '9.3rem', width: '100%', borderRadius: 3}}
	// 		/>
	// 	</Grid>
	// ));

	// useEffect(() => () => {
	// 	// Make sure to revoke the data uris to avoid memory leaks
	// 	files.forEach(file => URL.revokeObjectURL(file.preview));
	// }, [files]);
	const [operation] = useMutation(query)

	async function operateMutate() {
		if(isEdit === false){
			const res = await operation({
				variables: { 
					name: values.levelName,
					requiredPoints: values.requiredPoints,
					upgradeAmount: values.upgradeAmount
				}
			});
			setIsEdit(false)
			
			if(res.data.vipLevel.errors.length === 0){
				setMutate(!mutate)
				swal.fire({
					position: 'center',
					type: 'success',
					title: '新的VIP等级已保存',
					showConfirmButton: false,
					timer: 1500
				})
			} 
		}else{
			const res = await operation({
				variables: { 
					id: levelData.id,
					name: values.levelName === '' ? levelData.name : values.levelName,
					requiredPoints: values.requiredPoints === null ? levelData.requiredPoints : values.requiredPoints,
					upgradeAmount: values.upgradeAmount === null ? levelData.upgradeAmount : values.upgradeAmount
				}
			});
			setIsEdit(false)
			
			if(res.data.vipLevel.errors.length === 0){
				setMutate(!mutate)
				swal.fire({
					position: 'center',
					type: 'success',
					title: 'VIP等级更新',
					showConfirmButton: false,
					timer: 1500
				})
			} 
		}

		setValues({
			levelName: '',
			requiredPoints: null,
			upgradeAmount: null
		})

        setOpen(!open)
	}
	
	function saveHandle(event){
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
				<Paper  className={classes.paper}>
					<FormRowCenterItems  
						leftComponent={
							<Typography >{title} </Typography>
						}
						rightComponent={
							<Grid container justify="flex-end" alignItems="flex-end">
								<IconButton size="small" onClick={handleClose}>
									<CloseIcon style={{fontSize: 10}}/>
								</IconButton>
							</Grid>
						}
					/>
					<Grid container spacing={1} alignItems="flex-start">
						<FormRowCenterItems
							leftComponent={
								<Typography>{levelName}:</Typography>
							}
							rightComponent={
								<TextField variant="outlined" style={{width: 350}}  margin="dense" name="levelName" 
									onChange={handleChange} defaultValue={isEdit ? levelData.name : values.levelName} required/>
							}
						/>
						{/* <FormRowCenterItems fullWidth
							leftComponent={
								<Typography>{levelIcons}:</Typography>
							}
							rightComponent={
								<Grid container elevation={1}>
									<Grid item>
										<TextField {...getRootProps({className: 'dropzone'})} style={{marginRight: 10, width: 275}} value={thumbs !== ''? files[0].name : null} id="levelIcons" variant="outlined" margin="dense" name="levelIcons" onChange={handleChange}/>
										<label htmlFor="levelIcons">
											<Button variant="raised" style={{marginTop: 5}} color="primary" variant="contained"  component="span">
												
												{upload}
											</Button>
										</label> 
									</Grid>
								</Grid>
							}
						/>

						<FormRowCenterItems
							rightComponent={
								<Grid item  style={{width: 350, height: 150}}>
									{thumbs === ''? 
										<Grid htmlFor="levelIcons" container {...getRootProps({className: 'dropzone'})} alignItems='center' justify="center" style={{ width: "100%", height: "100%", backgroundColor: '#e8e8e8', border: '1px dashed #00bfa5', borderRadius: 6, backgroundImage: {imgSrc} }}>
											<Grid>
												<input {...getInputProps()} />
												<LibraryAdd style={{fontSize: 30, marginLeft:13}} color="primary"/>
												<Typography>{dropAndDropFile}</Typography>
											</Grid>
										</Grid>
									: 
										<Grid {...getRootProps()} style={{ width: "100%", height: "100%", border: '1px dashed #00bfa5', overflow: "hidden", borderRadius: 6}}>
											<input {...getInputProps()} />
											{thumbs}
										</Grid>
									}
								</Grid>
							}
						/> */}

						<FormRowCenterItems
							leftComponent={
								<Typography>{depositAmount}:</Typography>
							}
							rightComponent={
								<TextField style={{width: 350}} variant="outlined" margin="dense" name="upgradeAmount" 
									onChange={handleChange} type="number" defaultValue={isEdit ? levelData.upgradeAmount : values.upgradeAmount} required/>
							}
						/>
						<FormRowCenterItems
							leftComponent={
								<Typography>{effectiveAmount}:</Typography>
							}
							rightComponent={
								<TextField style={{width: 350}} type="number" defaultValue={isEdit ? levelData.requiredPoints : values.requiredPoints} variant="outlined" margin="dense" 
								name="requiredPoints" onChange={handleChange} required/>
							}
						/>
					</Grid>
					<Grid container justify="center" spacing={1} className={classes.actions}>
						<Grid item><Button variant="outlined" onClick={handleClose}>{strings.cancel}</Button></Grid>
						<Grid item><Button variant="contained"  type="submit" color="primary">{strings.continue}</Button></Grid>
					</Grid>
				</Paper>
			</form>
		</Modal>
	);
}
