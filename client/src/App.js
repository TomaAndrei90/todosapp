import React from 'react';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
	const app = (
		<>
			<CssBaseline />
			<Router>
				<Route path="/signup">
					<Signup />
				</Route>
				<Route path="/dashboard">
					<Dashboard />
				</Route>
				<Route exact path="/">
					<Login />
				</Route>
			</Router>
			
		</>
	);

	return app;
};

export default App;
