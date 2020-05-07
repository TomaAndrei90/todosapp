import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

import { login } from '../../API/API';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
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


const LoginSchema = yup.object().shape({
	email: yup.string().required().email().min(5).max(255),
	password: yup.string().required().trim().min(10).max(255),
});

const Login = () => {
	const useStyles = makeStyles((theme) => ({
		loginGrid: {
			marginTop: theme.spacing(4),
		},
		loginSubgrid: {
			maxWidth: '95%',
		},
		loginInput: {
			marginBottom: theme.spacing(2),
		},
		loginIcon: {
			color: theme.palette.text.secondary,
		},
	}));
	const classes = useStyles();

	const history = useHistory();

	const { handleSubmit, errors, control } = useForm({
		validationSchema: LoginSchema,
	});
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState('');
	
	const onSubmit = async (data, e) => { 
		try {
			console.log('submitted');
			console.log(data);
			setLoading(true);
			const newUserAndToken = await login(data);
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

	const loginComponent = (
		<>
			{loading ? 
				<Backdrop open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop> :
				<Grid container justify="center" spacing={0} className={classes.loginGrid}>
					<Grid container item sm={6} md={4} lg={3} xl={2} className={classes.loginSubgrid}>
						<Card>
							<CardHeader title="Login" titleTypographyProps={{ variant: 'h5', component: 'h1', align: 'center' }} />
							<CardContent>
								<form onSubmit={handleSubmit(onSubmit)}>
									<Controller 
										name="email" 
										control={control} 
										defaultValue=""
										as={
											<TextField 
												className={classes.loginInput}
												label="Email" 
												variant="outlined"
												size="small"
												autoComplete="off"
												fullWidth
												InputProps={{
													endAdornment: <EmailIcon className={classes.loginIcon} />
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
												className={classes.loginInput}
												label="Password" 
												variant="outlined"
												size="small"
												autoComplete="off"
												fullWidth
												InputProps={{
													endAdornment: <LockRoundedIcon className={classes.loginIcon} />
												}}
												error={!!errors.password}
												helperText={errors.password ? `${errors.password.message}` : null}
											/>
										} 
									/>
									<Box display="flex" justifyContent="flex-end" alignItems="flex-end">
										<Button type="submit" variant="contained" color="primary">Login</Button>
									</Box>
									<span>
										You can log in with: <br/> 
										<b>demo@demo.com</b><br/>
										<b>demopassword</b><br/> 
										if you do not want to make an account. <br/>
										<Link component={RouterLink} to='/signup'>But you can also signup here.</Link>
									</span>
									
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

	return loginComponent;
};

export default Login;

