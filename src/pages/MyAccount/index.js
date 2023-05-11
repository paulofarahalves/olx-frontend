import React, { useState, useEffect } from 'react';
import useApi from '../../helpers/OlxAPI';
import { PageArea } from './styled';
import {
	PageContainer,
	PageTitle,
	ErrorMessage,
} from '../../components/MainComponents';
import AdItem from './AdItem';

const Page = () => {
	const api = useApi();

	const [name, setName] = useState('');
	const [stateLoc, setStateLoc] = useState('');
	const [userLoc, setUserLoc] = useState('');
	const [userLocId, setUserLocId] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [adList, setAdList] = useState([]);
	const [stateList, setStateList] = useState([]);
	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState('');
	const [done, setDone] = useState('none');

	useEffect(() => {
		const getStates = async () => {
			const sList = await api.getStates();
			setStateList(sList);
		};
		getStates();
	}, []);

	useEffect(() => {
		const getUserInfo = async () => {
			const uInfo = await api.getUserInfo();

			setName(uInfo.name);
			setStateLoc(uInfo.stateId);
			setEmail(uInfo.email);
			setAdList(uInfo.ads);
			setUserLoc(uInfo.state);
			setUserLocId(uInfo.stateId);
		};
		getUserInfo();
	}, []);

	let stateId = '';

	if (stateList) {
		stateList.map((i) => {
			if (userLoc === i.name) {
				stateId = i._id;
			}
		});
	}

	const doneDivStyle = {
		display: done,
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setDisabled(true);
		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			setDisabled(false);
			return;
		}

		const json = await api.updateUser(name, stateLoc, password);

		if (json.error) {
			setError(json.error);
		} else {
			setDone('block');
			window.location.href = '/my-account';
		}

		setDisabled(false);
	};

	return (
		<>
			<PageContainer>
				<PageTitle>My Account</PageTitle>
				<PageArea>
					{error && <ErrorMessage>{error}</ErrorMessage>}

					<form onSubmit={handleSubmit}>
						<label className="area">
							<div className="area--title">Full Name</div>
							<div className="area--input">
								<input
									type="text"
									disabled={disabled}
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
						</label>
						<label className="area">
							<div className="area--title">State</div>
							<div className="area--input">
								<select
									onChange={(e) =>
										setStateLoc(e.target.value)
									}
								>
									<option key={0} value={userLocId}>
										{userLoc}
									</option>
									{stateList.map((i, k) => {
										if (i._id !== stateId) {
											return (
												<option key={k} value={i._id}>
													{i.name}
												</option>
											);
										}
									})}
								</select>
							</div>
						</label>
						<label className="area">
							<div className="area--title">Email</div>
							<div className="area--input">
								<input
									type="email"
									disabled={true}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</label>
						<label className="area">
							<div className="area--title">Password</div>
							<div className="area--input">
								<input
									type="password"
									disabled={disabled}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>
						</label>
						<label className="area">
							<div className="area--title">Confirm Password</div>
							<div className="area--input">
								<input
									type="password"
									disabled={disabled}
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
								/>
							</div>
						</label>

						<label className="area">
							<div className="area--title"></div>
							<div className="area--input save">
								<button disabled={disabled}>Save</button>
								<div style={doneDivStyle}>✔️</div>
							</div>
						</label>
					</form>
				</PageArea>
			</PageContainer>
			<PageContainer>
				<PageArea>
					<h2>My Ads</h2>
					<div className="list">
						{adList.map((i, k) => (
							<AdItem key={k} data={i._doc} />
						))}
					</div>
				</PageArea>
			</PageContainer>
		</>
	);
};

export default Page;
