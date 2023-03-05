import React, { useState, useRef, useEffect } from 'react';
import useApi from '../../helpers/OlxAPI';
import MaskedInput from 'react-text-mask';
import creatNumberMask from 'text-mask-addons/dist/createNumberMask';
import { useNavigate } from 'react-router-dom';
import { PageArea } from './styled';
import {
	PageContainer,
	PageTitle,
	ErrorMessage,
} from '../../components/MainComponents';

const Page = () => {
	const api = useApi();

	const fileField = useRef();
	const history = useNavigate();

	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('');
	const [categories, setCategories] = useState([]);
	const [price, setPrice] = useState('');
	const [priceNegotiable, setPriceNegotiable] = useState(false);
	const [desc, setDesc] = useState('');

	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const getCategories = async () => {
			const cats = await api.getCategories();
			setCategories(cats);
		};
		getCategories();
	}, []);

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

		if (errors.length === 0) {
			const fData = new FormData();

			fData.append('title', title);
			fData.append('price', price);
			fData.append('priceneg', priceNegotiable);
			fData.append('desc', desc);
			fData.append('cat', category);

			if (fileField.current.files.length > 0) {
				for (let i = 0; i < fileField.current.files.length; i++) {
					fData.append('img', fileField.current.files[i]);
				}
			}

			const json = await api.addAd(fData);

			if (!json.error) {
				history(`/ad/${json.id}`);
				return;
			} else {
				setError(json.error);
			}
		} else {
			setError(errors.join('\n'));
		}

		setDisabled(false);
	};

	const priceMask = creatNumberMask({
		prefix: '',
		includeThousandsSeparator: true,
		thousandsSeparatorSymbol: '.',
		allowDecimal: true,
		decimalSymbol: ',',
	});

	return (
		<PageContainer>
			<PageTitle>Post an add</PageTitle>
			<PageArea>
				{error && <ErrorMessage>{error}</ErrorMessage>}

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
								<option></option>
								{categories &&
									categories.map((i) => (
										<option key={i._id} value={i._id}>
											{i.slug[0].toUpperCase() +
												i.slug.substring(1)}
										</option>
									))}
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
						<div className="area--input">
							<button disabled={disabled}>Post ad</button>
						</div>
					</label>
				</form>
			</PageArea>
		</PageContainer>
	);
};

export default Page;
