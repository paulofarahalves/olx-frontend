import React from 'react';
import { useRoutes } from 'react-router-dom';
import { RouteHandler } from './components/RouteHandler';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdPage from './pages/AdPage';

export const Routes = () => {
	return useRoutes([
		{
			path: '/',
			element: (
				<RouteHandler>
					<Home />
				</RouteHandler>
			),
		},
		{
			path: '/about',
			element: (
				<RouteHandler>
					<About />
				</RouteHandler>
			),
		},
		{
			path: '/signin',
			element: (
				<RouteHandler>
					<SignIn />
				</RouteHandler>
			),
		},
		{
			path: '/signup',
			element: (
				<RouteHandler>
					<SignUp />
				</RouteHandler>
			),
		},
		{
			path: '/ad/:id',
			element: (
				<RouteHandler>
					<AdPage />
				</RouteHandler>
			),
		},
		{
			path: '/post-an-ad',
			element: (
				<RouteHandler private>
					<About />
				</RouteHandler>
			),
		},
		{
			path: '*',
			element: (
				<RouteHandler>
					<NotFound />
				</RouteHandler>
			),
		},
	]);
};
