import Cookies from 'js-cookie';
import qs from 'qs';

const BASEAPI = 'http://54.94.190.6:5000';

const apiFetchPost = async (endpoint, body) => {
	if (!body.token) {
		let token = Cookies.get('token');
		if (token) {
			body.token = token;
		}
	}
	const res = await fetch(BASEAPI + endpoint, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	const json = await res.json();

	if (json.notallowed) {
		window.location.href = '/signin';
		return;
	}

	return json;
};

const apiFetchGet = async (endpoint, body = []) => {
	if (!body.token) {
		let token = Cookies.get('token');
		if (token) {
			body.token = token;
		}
	}
	const res = await fetch(`${BASEAPI + endpoint}?${qs.stringify(body)}`);
	const json = await res.json();

	if (json.notallowed) {
		window.location.href = '/signin';
		return;
	}

	return json;
};

const apiFetchFile = async (endpoint, body) => {
	if (!body.token) {
		let token = Cookies.get('token');
		if (token) {
			body.append('token', token);
		}
	}
	const res = await fetch(BASEAPI + endpoint, {
		method: 'POST',
		body,
	});

	const json = await res.json();

	if (json.notallowed) {
		window.location.href = '/signin';
		return;
	}

	return json;
};

const apiFetchPut = async (endpoint, body) => {
	if (!body.token) {
		let token = Cookies.get('token');
		if (token) {
			body.token = token;
		}
	}

	const res = await fetch(BASEAPI + endpoint, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	const json = await res.json();
	if (json.notallowed) {
		window.location.href = '/signin';
		return;
	}

	return json;
};

const OlxAPI = {
	login: async (email, password) => {
		const json = await apiFetchPost('/user/signin', { email, password });
		return json;
	},

	register: async (name, email, password, stateLoc) => {
		const json = await apiFetchPost('/user/signup', {
			name,
			email,
			password,
			state: stateLoc,
		});
		return json;
	},

	getStates: async () => {
		const json = await apiFetchGet('/states');
		return json.states;
	},

	getCategories: async () => {
		const json = await apiFetchGet('/categories');
		return json.categories;
	},

	getAds: async (options) => {
		const json = await apiFetchGet('/ad/list', options);
		return json;
	},

	getAd: async (id, other = false) => {
		const json = await apiFetchGet('/ad/item', { id, other });
		return json;
	},

	addAd: async (fData) => {
		const json = await apiFetchFile('/ad/add', fData);
		return json;
	},

	getUserInfo: async () => {
		const json = await apiFetchGet('/user/me');
		return json;
	},

	updateUser: async (name, state, password) => {
		let body = {};
		if (name) body.name = name;
		//if (email) body.email = email;
		if (state) body.state = state;
		if (password) body.password = password;

		const json = await apiFetchPut('/user/me', body);
		return json;
	},

	updatePost: async (id, fData) => {
		const json = await apiFetchFile(`/ad/${id}`, fData);
		return json;
	},
};

export default () => OlxAPI;
