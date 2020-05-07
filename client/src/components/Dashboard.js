import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TodosList from './TodosList';
import { requestAllTodoLists, addTodoList, deleteTodoList, updateTodoList, checkLoggedIn } from '../API/API';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddBoxRounded from '@material-ui/icons/AddBoxRounded';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';

import { useHistory } from 'react-router-dom';

const Dashboard = () => {
	const useStyles = makeStyles((theme) => ({
		logoutButton: {
			marginLeft: 'auto',
			color: theme.palette.grey[500],
		},
		margin: {
			margin: theme.spacing(2),
		},
		newTodoListForm: {
			paddingBottom: '0.5rem',
			width: 'inherit',
		},
		helperText: {
			position: 'absolute',
			top: '2.4rem'
		},
	}));

	const classes = useStyles();

	const history = useHistory();

	const { handleSubmit, errors, control } = useForm();
	const [ error, setError ] = useState('');
	const [ loadingAllLists, setLoadingAllLists ] = useState(false);
	const [ loadingAddList, setLoadingAddList ] = useState(false);
	const [ username, setUsername ] = useState('');
	const [ todoLists, setTodoLists ] = useState([]);

	const getAllTodoLists = async () => {
		try {
			setLoadingAllLists(true);
			const todoLists = await requestAllTodoLists();
			setTodoLists(todoLists);
			setLoadingAllLists(false);
		} catch (error) {
			setError(error.message);
			setOpenSnackbar(true);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const response = await checkLoggedIn();
				if (!response) throw Error;
				setUsername(response.user.username);
				getAllTodoLists();
				console.log('response', response);
			} catch (error) {
				logout();
			}
		})();
	}, []);

	const logout = () => {
		localStorage.removeItem('token');
		history.push('/');
	};

	const onSubmit = async (data, e) => { 
		try {
			setLoadingAddList(true);
			const newTodoList = await addTodoList(data);
			console.log(newTodoList);
			setTodoLists(todoLists => [
				...todoLists, 
				newTodoList,
			]);
			e.target.reset();
			setLoadingAddList(false);
		} catch (error) {
			console.error(error);
			setError(error.message);
			setOpenSnackbar(true);
			setLoadingAddList(false);
		}
	};
	
	const handleDeleteTodoList = useCallback(async (id, index) => {
		try {
			const deletedTodoList = await deleteTodoList(id);
			const clonedTodoLists = [...todoLists];
			clonedTodoLists.splice(index, 1);
			setTodoLists(clonedTodoLists);
			// Workaround; this is not actually an error
			// but I'm using the Snackbard and it's set up to handle errors
			setError(`List ${deletedTodoList.title} was deleted.`);
			setOpenSnackbar(true);
			setTimeout(() => { 
				setOpenSnackbar(false);
				setError('');
			}, 6000 );
			// Workaround END
		} catch (error) {
			setError(error.message);
			setOpenSnackbar(true);
		}
	}, [todoLists]);

	const handleUpdateTodoListName = useCallback(async (id, index, data) => {
		try {
			const updatedTodoList = await updateTodoList(id, data);
			const clonedTodoLists = [...todoLists];
			clonedTodoLists.splice(index, 1, updatedTodoList);
			setTodoLists(clonedTodoLists);
		} catch (error) {
			setError(error.message);
			setOpenSnackbar(true);
		}
	}, [todoLists]);

	const [ openSnackbar, setOpenSnackbar ] = useState(false);
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};	

	const dashboard = (
		<>{username &&
			<>
				<AppBar position="sticky">
					<Toolbar variant="dense">
						{ username && <span>Hello, {username}</span> }
						<Button color="secondary" className={classes.logoutButton} onClick={logout}>Logout</Button>
					</Toolbar>
				</AppBar>
				
				<div className={classes.margin}>
					{loadingAllLists ? 
						<Backdrop open={loadingAllLists}>
							<CircularProgress color="inherit" />
						</Backdrop> :
						<>
							<Grid container spacing={1}>
								<Grid container item md={4} lg={3} xl={2}>
									{
										loadingAddList ? <Skeleton variant="text" height="3.5rem" width="inherit" /> : 
											<form className={classes.newTodoListForm} onSubmit={handleSubmit(onSubmit)}>
												<Controller 
													name="newTodoListTitle" 
													control={control} 
													rules={{ required: true }}
													defaultValue=""
													as={
														<TextField 
															label="List Name" 
															variant="outlined"
															size="small"
															autoComplete="off"
															fullWidth
															InputProps={{
																endAdornment: 
															<IconButton type="submit" size="small">
																<AddBoxRounded />
															</IconButton>
															}}
															error={!!errors.newTodoListTitle}
															helperText={errors.newTodoListTitle ? 'Cannot submit an empty todo list.' : null}
															FormHelperTextProps={{ classes: { root: classes.helperText } }}
														/>
													} 
												/>
											</form>
									}
								</Grid>
							</Grid>

							{todoLists.length ? 
								<Grid container spacing={1}>
									{todoLists.map((todoList, index) => (
										<Grid container item key={todoList._id}
											xs={12} 
											sm={6} 
											md={4}
											lg={3}
											xl={2}
										>
											<TodosList 
												id={todoList._id} 
												index={index}
												title={todoList.title}
												todos={todoList.todos}
												onDeleteTodoList={handleDeleteTodoList}
												onUpdateTodoListName={handleUpdateTodoListName}
											/>
										</Grid>
									))}
								</Grid>
								: null	
							}			
						</>
					}

					<Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar}>
						<Alert onClose={handleCloseSnackbar} severity="error">
							{error}
						</Alert>
					</Snackbar>
				</div>
			</>
		}</>
	);

	return dashboard;
};

export default Dashboard;
