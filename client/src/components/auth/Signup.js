import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';


import { signup } from '../../API/API';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import EmailIcon from '@material-ui/icons/Email';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { useHistory } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const SignupSchema = yup.object().shape({
	username: yup.string().required().matches(/(^[a-zA-Z0-9_]+$)/, { message: 'Username can only contain characters from a-z / A-Z, numbers, or _' }).min(5).max(30),
	email: yup.string().required().email().min(5).max(255),
	password: yup.string().required().trim().min(10).max(255),
});

const Signup = () => {
	const useStyles = makeStyles((theme) => ({
		signupGrid: {
			marginTop: theme.spacing(4),
		},
		signupSubgrid: {
			maxWidth: '95%',
		},
		signupInput: {
			marginBottom: theme.spacing(2),
		},
		signupIcon: {
			color: theme.palette.text.secondary,
		},
	}));
	const classes = useStyles();

	const history = useHistory();

	const { handleSubmit, errors, control } = useForm({
		validationSchema: SignupSchema,
	});
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState('');
	
	const onSubmit = async (data, e) => { 
		try {
			console.log('submitted');
			console.log(data);
			setLoading(true);
			const newUserAndToken = await signup(data);
			console.log(newUserAndToken);
			const { user, token } = newUserAndToken;
			localStorage.setItem('token', token);
			setLoading(false);
			history.push('/dashboard');
		} catch (error) {
			console.error(error);
			setError(error.message);
			setOpenSnackbar(true);
			setLoading(false);
		}
	};	
	
	const [ openSnackbar, setOpenSnackbar ] = useState(false);
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};	

	const signupComponent = (
		<>
			{loading ? 
				<Backdrop open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop> :
				<Grid container justify="center" spacing={0} className={classes.signupGrid}>
					<Grid container item sm={6} md={4} lg={3} xl={2} className={classes.signupSubgrid}>
						<Card>
							<CardHeader title="Sign Up" titleTypographyProps={{ variant: 'h5', component: 'h1', align: 'center' }} />
							<CardContent>
								<form onSubmit={handleSubmit(onSubmit)}>
									<Controller 
										name="username" 
										control={control} 
										defaultValue=""
										as={
											<TextField 
												className={classes.signupInput}
												label="Username" 
												variant="outlined"
												size="small"
												autoComplete="off"
												fullWidth
												InputProps={{
													endAdornment: <AccountBoxRoundedIcon className={classes.signupIcon} />
												}}
												error={!!errors.username}
												helperText={errors.username ? `${errors.username.message}` : null}
											/>
										} 
									/>
									<Controller 
										name="email" 
										control={control} 
										defaultValue=""
										as={
											<TextField 
												className={classes.signupInput}
												label="Email" 
												variant="outlined"
												size="small"
												autoComplete="off"
												fullWidth
												InputProps={{
													endAdornment: <EmailIcon className={classes.signupIcon} />
												}}
												error={!!errors.email}
												helperText={errors.email ? `${errors.email.message}` : null}
											/>
										} 
									/>
									<Controller 
										name="password" 
										control={control} 
										defaultValue=""
										as={
											<TextField 
												type="password"
												className={classes.signupInput}
												label="Password" 
												variant="outlined"
												size="small"
												autoComplete="off"
												fullWidth
												InputProps={{
													endAdornment: <LockRoundedIcon className={classes.signupIcon} />
												}}
												error={!!errors.password}
												helperText={errors.password ? `${errors.password.message}` : null}
											/>
										} 
									/>
									<Box display="flex" justifyContent="space-between" alignItems="flex-end">
										<Link component={RouterLink} to='/'>Click here for login.</Link>
										<Button type="submit" variant="contained" color="primary">Sign up</Button>
									</Box>
								</form>
							</CardContent>
						</Card>
					</Grid>
					
					<Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar}>
						<Alert onClose={handleCloseSnackbar} severity="error">
							{error}
						</Alert>
					</Snackbar>
				</Grid>
			}
		</>
	);

	return signupComponent;
};

export default Signup;

