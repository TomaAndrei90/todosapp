import React, { useState, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form'; 
import useClickedOutside from '../hooks/useClickedOutside';
import TodosDisplay from './TodosDisplay';
import { addTodo, deleteTodo, updateTodo } from '../API/API';

import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Skeleton from '@material-ui/lab/Skeleton';

const TodosList = props => {
	const theme = useTheme();
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: theme.spacing(2),
			border: `1px solid ${theme.palette.primary.main}`,
			width: 'inherit',
			// next line stops TodoList scrollbars from showing through AppBar
			zIndex: theme.zIndex.mobileStepper, 
			[theme.breakpoints.up('sm')]: {
				height: '28rem',
			}
		},
		cardHeader: {
			padding: theme.spacing(1),
			paddingLeft: theme.spacing(2),
			background: theme.palette.primary.main,
			color: theme.palette.primary.contrastText,
			fontSize: theme.typography.body1.fontSize,
		},
		listTitle: {
			lineHeight: 'inherit',
		},
		updateListField: {
			fontSize: 'unset',
			verticalAlign: 'unset',
		},
		updateListInput: {
			padding: 0,
			color: theme.palette.primary.contrastText,
		},
		cardHeaderButton: {
			padding: 0,
			color: theme.palette.primary.contrastText,
			fontSize: theme.typography.body1.fontSize,
		},
		cardHeaderIcon: {
			fontSize: '1.4rem',
		},
		todoHelperText: {
			position: 'absolute',
			right: '2rem',
			bottom: '0.4rem',
			fontSize: '0.6rem',
			[theme.breakpoints.up(350)]: {
				bottom: '0.1rem',
				fontSize: '0.75rem'
			}
		},
	}));

	const classes = useStyles(theme);

	const { id, index, title, todos: todosFromProps, onDeleteTodoList, onUpdateTodoListName } = props;
	const { control, handleSubmit, errors } = useForm();
	const { control: control2, handleSubmit: handleSubmit2, errors: errors2 } = useForm();
	const [ error, setError ] = useState('');
	const [ todos, setTodos ] = useState(todosFromProps);
	const [ loading, setLoading ] = useState(false);
	const [ isEditing, setIsEditing ] = useState(false);
	
	const onSubmitUpdate = data => {
		setIsEditing(false);
		onUpdateTodoListName(id, index, data);
	};

	const updateFormRef = useRef();

	useClickedOutside(updateFormRef, () => {
		if (isEditing) {
			setIsEditing(false);
		}
	});

	const onSubmit = async (data, e) => { 
		try {
			setLoading(true);
			const newTodo = await addTodo(id, data);
			setTodos(todos => [
				...todos, 
				newTodo,
			]);
			e.target.reset();
			setLoading(false);
		} catch (error) {
			setError(error.message);
			setOpenSnackbar(true);
			setLoading(false);
		}
	};

	const handleToggleTodo = useCallback(async (todoListId, id, index) => {
		try {
			const updatedTodo = {
				...todos[index],
				completed: !todos[index].completed
			};
			const updatedTodoList = await updateTodo(todoListId, id, updatedTodo);
			setTodos(updatedTodoList.todos);
		} catch (error) {
			setError(error.message);
			setOpenSnackbar(true);
		}
	}, [todos]);

	const handleDeleteTodo = useCallback(async (todoListId, id) => {
		const updatedTodoList = await deleteTodo(todoListId, id);
		setTodos(updatedTodoList.todos);		
	}, []);
	
	const handleUpdateTodo = useCallback(async (todoListId, id, index, content) => {
		try {
			const updatedTodo = {
				...todos[index],
				content
			};
			const updatedTodoList = await updateTodo(todoListId, id, updatedTodo);
			setTodos(updatedTodoList.todos);
		} catch (error) {
			setError(error.message);
			setOpenSnackbar(true);
		}
	}, [todos]);
	
	const [ openSnackbar, setOpenSnackbar ] = useState(false);
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};	

	const todosList = (
		<Card className={classes.root}>
			<CardHeader
				className={classes.cardHeader} 
				disableTypography={true}
				title={
					isEditing ? (
						<form onSubmit={handleSubmit(onSubmitUpdate)} ref={updateFormRef}>
							<Controller 
								name="updatedListTitle" 
								control={control} 
								rules={{ required: true }}
								defaultValue=""
								as={
									<TextField 
										className={classes.updateListField} 
										placeholder="Update list name" 
										size="small"
										autoComplete="off"
										margin="none"			
										variant="standard"			
										color="secondary"		
										fullWidth		
										InputProps={{
											disableUnderline: true, 
											autoFocus: true, 
											classes: { input: classes.updateListInput }, 
											endAdornment: 
												<IconButton type="submit" size="small" color="inherit" className={classes.cardHeaderButton}>
													<SaveRoundedIcon className={classes.cardHeaderIcon} />
												</IconButton>
										}}
										error={!!errors.updatedListTitle}
										helperText={errors.updatedListTitle ? 'Cannot submit an empty todolist.' : null}
									/>
								} 
							/>
						</form>) :(
						<Box display="flex" justifyContent="space-between" alignItems="center">
							<Typography component="h2" className={classes.listTitle} onClick={() => setIsEditing(true)}>
								{title}
							</Typography>
							<IconButton type="submit" size="small" color="inherit" className={classes.cardHeaderButton} onClick={() => onDeleteTodoList(id, index)}>
								<HighlightOffRoundedIcon className={classes.cardHeaderIcon} />
							</IconButton>
						</Box>
					)
				} >
				
			</CardHeader>

			<CardContent>
				{loading ? <Skeleton variant="text" height="1.875rem" />  : 
					<form onSubmit={handleSubmit2(onSubmit)}>
						<Controller 
							name="content" 
							control={control2} 
							rules={{ required: true }}
							defaultValue=""
							as={
								<TextField 
									placeholder="New Task" 
									size="small"
									autoComplete="off"
									margin="none"			
									variant="standard"			
									color="primary"		
									fullWidth		
									InputProps={{
										endAdornment: 
											<IconButton type="submit" size="small" color="primary">
												<SaveRoundedIcon />
											</IconButton>
									}}
									error={!!errors2.content}
									helperText={ errors2.content ? 'Cannot submit an empty todo.' : null}
									FormHelperTextProps={{ classes: { root: classes.todoHelperText }}}
								/>
							} 
						/>						
					</form>
				}

				{todos.length ?
					<TodosDisplay
						todos={todos}
						onToggleTodo={handleToggleTodo}
						onDeleteTodo={handleDeleteTodo}
						onUpdateTodo={handleUpdateTodo}
						todoListId={id}
					/>
					: null
				}
			</CardContent>

			<Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity="error">
					{error}
				</Alert>
			</Snackbar>
		</Card>
	);

	return todosList;
};

export default TodosList;