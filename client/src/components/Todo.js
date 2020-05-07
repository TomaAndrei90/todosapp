import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form'; 
import useClickedOutside from '../hooks/useClickedOutside';

import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import Box from '@material-ui/core/Box';

const Todo = props => {
	const theme = useTheme();
	const useStyles = makeStyles((theme) => ({
		todoBox: {
			marginLeft: '-12px',
			paddingRight: '4px'
		},
		todoCheckbox: {
			marginTop: '-9px',
		},
		todoContent: {
			marginTop: '0.2rem',
			wordBreak: 'break-word',
		},
		todoSave: {
			paddingTop: 0,
		},
		todoDelete: {
			marginLeft: 'auto',
			paddingTop: '2px',
		},
	}));

	const classes = useStyles(theme);

	const { content, completed, id, index, todoListId, onToggleTodo, onDeleteTodo, onUpdateTodo } = props;
	const { control, handleSubmit, errors } = useForm();
	const [isEditing, setIsEditing ] = useState(false);

	const onSubmitUpdate = ({ content }) => {
		setIsEditing(false);
		onUpdateTodo(todoListId, id, index, content);
	};

	const updateFormRef = useRef();

	useClickedOutside(updateFormRef, () => {
		if (isEditing) {
			setIsEditing(false);
		} 
	});

	const todo = (
		<Box display="flex" alignItems="start" className={classes.todoBox}>
			<Checkbox 
				checked={completed}
				onChange={() => onToggleTodo(todoListId, id, index)}
				color="primary"
				className={classes.todoCheckbox}
			/>
			{isEditing ? 
				<form onSubmit={handleSubmit(onSubmitUpdate)} ref={updateFormRef}>
					<Controller 
						name="content" 
						control={control} 
						rules={{ required: true }}
						defaultValue=""
						as={
							<TextField 
								placeholder="Update task content" 
								size="small"
								autoComplete="off"
								margin="none"			
								variant="standard"			
								color="secondary"		
								fullWidth		
								InputProps={{
									disableUnderline: true, 
									autoFocus: true, 
									endAdornment: 
											<IconButton type="submit" size="small" color="primary" className={classes.todoSave}>
												<SaveRoundedIcon />
											</IconButton>
								}}
								
								error={!!errors.content}
								helperText={ errors.content ? 'Cannot submit an empty todo.' : null}
							/>
						} 
					/>
				</form>
				: <span className={classes.todoContent} onClick={() => setIsEditing(true)}>{content}</span>}
			<IconButton size="small" color="inherit" className={classes.todoDelete} onClick={() => onDeleteTodo(todoListId, id)}>
				<HighlightOffRoundedIcon/>
			</IconButton>
		</Box>
	);

	return todo;
};

export default Todo;
