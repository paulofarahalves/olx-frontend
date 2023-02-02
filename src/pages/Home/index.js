import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../helpers/OlxAPI';
import { PageArea, SearchArea } from './styled';
import { PageContainer } from '../../components/MainComponents';
import AdItem from '../../components/partials/AdItem';

const Page = () => {
	const api = useApi();

	const [stateList, setStateList] = useState([]);
	const [categories, setCategories] = useState([]);
	const [adList, setAdList] = useState([]);

	useEffect(() => {
		const getStates = async () => {
			const sList = await api.getStates();
			setStateList(sList);
		};
		getStates();
	}, []);

	useEffect(() => {
		const getCategories = async () => {
			const cats = await api.getCategories();
			setCategories(cats);
		};
		getCategories();
	}, []);

	useEffect(() => {
		const getRecentAds = async () => {
			const json = await api.getAds({
				sort: 'desc',
				limit: 8,
			});
			setAdList(json.ads);
		};
		getRecentAds();
	}, []);

	return (
		<>
			<SearchArea>
				<PageContainer>
					<div className="searchBox">
						<form method="GET" action="/ads">
							<input
								type="text"
								name="q"
								placeholder="What are you looking for?"
							/>
							<select name="state">
								{stateList.map((i, k) => (
									<option key={k} value={i.name}>
										{i.name}
									</option>
								))}
							</select>
							<button>Search</button>
						</form>
					</div>
					<div className="categoryList">
						{categories.map((i, k) => (
							<Link
								key={k}
								to={`/ads?cat=${i.slug}`}
								className="categoryItem"
							>
								<img src={i.img} alt="" />
								<span>
									{i.slug[0].toUpperCase() +
										i.slug.substring(1)}
								</span>
							</Link>
						))}
					</div>
				</PageContainer>
			</SearchArea>
			<PageContainer>
				<PageArea>
					<h2>Recent Ads</h2>
					<div className="list">
						{adList.map((i, k) => (
							<AdItem key={k} data={i} />
						))}
					</div>
					<Link to="/ads" className="seeAllLink">
						See all
					</Link>
					<hr />
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Fusce ligula neque, ultricies a arcu nec, tincidunt
					dignissim urna. Morbi nec vestibulum nisi. Duis egestas sed
					turpis vel posuere. Duis a nisl nec libero efficitur
					condimentum. Sed scelerisque nibh velit, vel feugiat leo
					volutpat vel.
				</PageArea>
			</PageContainer>
		</>
	);
};

export default Page;
