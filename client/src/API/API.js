// eslint-disable-next-line no-undef
const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://minimaltodoapp.herokuapp.com';

// route: most of these fetches need to have the authorization in headers

const returnResponseOrError = async (response) => {
	const json = await response.json();
	if (response.ok) {
		return json;
	}

	const error = new Error(json.message);
	error.response = json;
	throw error;
};

/* TodoLists */
const requestAllTodoLists = async () => {
	const response = await fetch(`${API_URL}/api/todoLists`, {
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		}
	});
	return response.json();
};

const addTodoList = async (data) => {
	const response = await fetch(`${API_URL}/api/todoLists/addTodoList`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		},
		body: JSON.stringify(data)
	});

	return returnResponseOrError(response);
};

const deleteTodoList = async (id) => {
	const response = await fetch(`${API_URL}/api/todoLists/deleteTodoList/${id}`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.json();
};

const updateTodoList = async (id, data) => {
	const response = await fetch(`${API_URL}/api/todoLists/updateTodoList/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		},
		body: JSON.stringify(data),
	});
	return response.json();
};

/* TodoLists END */

/* Todos */
const addTodo = async (id, data) => {
	const response = await fetch(`${API_URL}/api/todos/addTodo/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		},
		body: JSON.stringify(data)
	});
	
	return returnResponseOrError(response);
};

const deleteTodo = async (id, todoId) => {
	const response = await fetch(`${API_URL}/api/todos/deleteTodo/${id}/${todoId}`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.json();
};

const updateTodo = async (id, todoId, data) => {
	const response = await fetch(`${API_URL}/api/todos/updateTodo/${id}/${todoId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		},
		body: JSON.stringify(data),
	});
	
	return returnResponseOrError(response);
};

/* Todos END */

/* Authentication */
const signup = async (data) => {
	const response = await fetch(`${API_URL}/auth/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	});

	return returnResponseOrError(response);
};

const login = async (data) => {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	});

	return returnResponseOrError(response);
};

const checkLoggedIn = async () => {
	const response = await fetch(`${API_URL}/auth`, {
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		},
	});

	return returnResponseOrError(response);
};

/* Authentication END */

export { 
	requestAllTodoLists, 
	addTodoList, 
	deleteTodoList,
	updateTodoList,
	addTodo,
	deleteTodo,
	updateTodo,
	signup,
	login,
	checkLoggedIn,
};