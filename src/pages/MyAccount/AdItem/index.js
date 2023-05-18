import React, { useState, useRef, useEffect } from 'react';
import { Item } from './styled';
import Modal from '../../../components/modal';
import useApi from '../../../helpers/OlxAPI';
import MaskedInput from 'react-text-mask';
import creatNumberMask from 'text-mask-addons/dist/createNumberMask';
import { useNavigate } from 'react-router-dom';

export default (props) => {
	const api = useApi();
	const [openModal, setOpenModal] = useState(false);

	const fileField = useRef();
	const history = useNavigate();
	const [stateLoc, setStateLoc] = useState('');
	const [title, setTitle] = useState(props.data.title);
	const [category, setCategory] = useState(props.data.category);
	const [categories, setCategories] = useState([]);
	const [price, setPrice] = useState(props.data.price);
	const [priceNegotiable, setPriceNegotiable] = useState(
		props.data.priceNegotiable
	);
	const [desc, setDesc] = useState(props.data.description);

	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState('');
	const [done, setDone] = useState('none');

	const doneDivStyle = {
		display: done,
	};

	useEffect(() => {
		const getCategories = async () => {
			const cats = await api.getCategories();
			setCategories(cats);
		};
		getCategories();
	}, []);

	useEffect(() => {
		const getUserInfo = async () => {
			const uInfo = await api.getUserInfo();
			setStateLoc(uInfo.state);
		};
		getUserInfo();
	}, []);

	let categoryName = '';
	if (categories) {
		categories.map((i) => {
			if (props.data.category === i._id) {
				categoryName = i.slug.toString();
			}
		});
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setDisabled(true);
		setError('');
		let errors = [];

		if (!title.trim()) {
			errors.push('No title');
		}

		if (!category) {
			errors.push('No category');
		}

		if (!price) {
			errors.push('No price');
		}

		if (errors.length === 0) {
			const fData = new FormData();

			fData.append('title', title);
			fData.append('price', price);
			fData.append('priceneg', priceNegotiable);
			fData.append('desc', desc);
			fData.append('cat', category);
			fData.append('state', stateLoc);

			if (fileField.current.files.length > 0) {
				for (let i = 0; i < fileField.current.files.length; i++) {
					fData.append('img', fileField.current.files[i]);
				}
			}
			console.log(props.data._id);
			const json = await api.updatePost(props.data._id, fData);

			if (!json.error) {
				window.location.href = '/my-account';
			} else {
				setError(json.error);
			}
		} else {
			setError(errors.join('\n'));
		}

		setDisabled(false);
		setDone('block');
		setTimeout(() => {
			setOpenModal(false);
			setDone('none');
		}, 500);
	};

	const priceMask = creatNumberMask({
		prefix: '',
		includeThousandsSeparator: true,
		thousandsSeparatorSymbol: '.',
		allowDecimal: true,
		decimalSymbol: ',',
	});

	return (
		<>
			<Item
				className="aditem"
				onClick={() => {
					setOpenModal(true);
				}}
			>
				<div className="itemImage">
					{
						<img
							src={`http://54.94.190.6:5000/media/${props.data.images[0].url}`}
							alt=""
						/>
					}
				</div>
				<div className="itemName">{props.data.title}</div>
				<div className="itemPrice">{`$ ${props.data.price}`}</div>
			</Item>
			<Modal
				isOpened={openModal}
				setModalOpen={() => {
					setOpenModal(!openModal);
					setTitle(props.data.title);
					setCategory(props.data.category);
					setPrice(props.data.price);
					setPriceNegotiable(props.data.priceNegotiable);
					setDesc(props.data.description);
				}}
			>
				<h3>Update Ad</h3>
				<form onSubmit={handleSubmit}>
					<label className="area">
						<div className="area--title">Title</div>
						<div className="area--input">
							<input
								type="text"
								disabled={disabled}
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
					</label>
					<label className="area">
						<div className="area--title">Category</div>
						<div className="area--input">
							<select
								disabled={disabled}
								onChange={(e) => setCategory(e.target.value)}
								required
							>
								<option key={0} value={props.data.category}>
									{categoryName[0]?.toUpperCase() +
										categoryName?.substring(1)}
								</option>

								{categories &&
									categories.map((i) => {
										if (i._id !== props.data.category) {
											return (
												<option
													key={i._id}
													value={i.slug}
												>
													{i.slug[0].toUpperCase() +
														i.slug.substring(1)}
												</option>
											);
										}
									})}
							</select>
						</div>
					</label>
					<label className="area">
						<div className="area--title">Price</div>
						<div className="area--input">
							<MaskedInput
								mask={priceMask}
								placeholder="$ "
								disabled={disabled || priceNegotiable}
								value={price}
								onChange={(e) => {
									setPrice(e.target.value);
								}}
							/>
						</div>
					</label>
					<label className="area">
						<div className="area--title">Negotiable Price</div>
						<div className="area--input">
							<input
								type="checkbox"
								disabled={disabled}
								checked={priceNegotiable}
								onChange={(e) =>
									setPriceNegotiable(!priceNegotiable)
								}
							/>
						</div>
					</label>
					<label className="area">
						<div className="area--title">Description</div>
						<div className="area--input">
							<textarea
								disabled={disabled}
								value={desc}
								onChange={(e) => setDesc(e.target.value)}
							></textarea>
						</div>
					</label>
					<label className="area">
						<div className="area--title">Images</div>
						<div className="area--input">
							<input
								type="file"
								disabled={disabled}
								multiple
								ref={fileField}
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
			</Modal>
		</>
	);
};
