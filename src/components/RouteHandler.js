import { Navigate } from 'react-router-dom';
import { isLogged } from '../helpers/AuthHandler';

export const RouteHandler = ({ children, ...rest }) => {
	let logged = isLogged();
	let authorized = rest.private && !logged ? false : true;

	if (!authorized) <Navigate to="/signin" />;

	return children;
};
