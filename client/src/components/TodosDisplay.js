import React, { useState, useEffect } from 'react';
import Todo from './Todo';

import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import List from '@material-ui/core/List';

const TodosDisplay = props => {
	const theme = useTheme();
	const useStyles = makeStyles((theme) => ({
		displayButtonGroup: {
			marginTop: theme.spacing(1),
			display: 'flex',
		},
		displayButton: {
			flex: '1 1 auto',
			height: '1.6rem',
			color: theme.palette.primary.main,
			borderColor: theme.palette.primary.main,
			'&.Mui-selected': {
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.primary.contrastText,
			},
		},
		displayList: {
			marginTop: '8px',
			paddingTop: 0,
			height: '19rem',
			overflow: 'auto',
		}
	}));

	const [ displayFilter, setDisplayFilter ] = useState('all');

	const handleDisplayFilter = (event, newDisplayFilter) => {
		setDisplayFilter(newDisplayFilter);
	};

	const classes = useStyles(theme);
	const { todos, onToggleTodo, onDeleteTodo, onUpdateTodo, todoListId } = props;
	const [displayedTodos, setDisplayedTodos ] = useState(todos);

	useEffect(() => {
		setDisplayedTodos(todos);
	}, [todos]);

	const completedTodos = [...todos].filter((todo) => !todo.completed);
	const activeTodos = [...todos].filter((todo) => todo.completed); 

	const todosDisplay = (
		<>
			<ToggleButtonGroup value={displayFilter} onChange={handleDisplayFilter} exclusive color="primary" size="small" className={classes.displayButtonGroup} aria-label="outlined primary button group">
				<ToggleButton className={classes.displayButton} value="all" onClick={() => setDisplayedTodos(todos)}>All</ToggleButton>
				<ToggleButton className={classes.displayButton} value="active" onClick={() => setDisplayedTodos(completedTodos)}>Active</ToggleButton>
				<ToggleButton className={classes.displayButton} value="completed" onClick={() => setDisplayedTodos(activeTodos)}>Completed</ToggleButton>
			</ToggleButtonGroup>

			{
				displayedTodos.length ? 
					<List className={classes.displayList}>
						{displayedTodos.map((todo, index) => (
							<Todo 
								content={todo.content} 
								completed={todo.completed}
								index={index}
								key={todo._id}
								id={todo._id}
								todoListId={todoListId}
								onToggleTodo={onToggleTodo}
								onDeleteTodo={onDeleteTodo}
								onUpdateTodo={onUpdateTodo}
							/>
						))}
					</List> 
					: null 
			}
		</>
	);

	return todosDisplay;
};

export default TodosDisplay;