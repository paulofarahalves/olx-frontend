import React, { useEffect, useState } from 'react';
import useApi from '../../helpers/OlxAPI';
import { Link, useParams } from 'react-router-dom';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { PageArea, Fake, OthersArea, BreadChumb } from './styled';
import { PageContainer } from '../../components/MainComponents';
import AdItem from '../../components/partials/AdItem';

const Page = () => {
	const api = useApi();
	const { id } = useParams();

	const [loading, setLoading] = useState(true);
	const [adInfo, setAdInfo] = useState({});

	useEffect(() => {
		const getAdInfo = async (id) => {
			const json = await api.getAd(id, true);
			setAdInfo(json);
			setLoading(false);
		};
		getAdInfo(id);
	}, []);

	const formatDate = (date) => {
		let cDate = new Date(date);
		let months = [
			'january',
			'february',
			'march',
			'april',
			'may',
			'june',
			'july',
			'august',
			'september',
			'october',
			'november',
			'december',
		];
		let cDay = cDate.getDate();
		let cMonth = cDate.getMonth();
		let cYear = cDate.getFullYear();

		return `${months[cMonth]} ${cDay} of ${cYear}`;
	};

	return (
		<PageContainer>
			{adInfo.category && (
				<BreadChumb>
					You are here:
					<Link to="/">Home</Link>/
					<Link to={`/ads?states=${adInfo.stateName}`}>
						{adInfo.stateName}
					</Link>
					/
					<Link
						to={`/ads?state=${adInfo.stateName}&cat=${adInfo.category.slug}`}
					>
						{adInfo.category.name}
					</Link>
					/ {adInfo.title}
				</BreadChumb>
			)}

			<PageArea>
				<div className="leftSide">
					<div className="box">
						<div className="adImage">
							{loading && <Fake height={300} />}
							{adInfo.images && (
								<Slide>
									{adInfo.images && (
										<Slide>
											{adInfo.images.map((img, k) => (
												<div
													key={k}
													className="each-slide"
												>
													<img src={img} alt="" />
												</div>
											))}
										</Slide>
									)}
								</Slide>
							)}
						</div>
						<div className="adInformation">
							<div className="adName">
								{loading && <Fake height={20} />}
								{adInfo.title && <h2>{adInfo.title}</h2>}
								{adInfo.dateCreated && (
									<small>
										Created in{' '}
										{formatDate(adInfo.dateCreated)}
									</small>
								)}
							</div>
							<div className="adDescription">
								{loading && <Fake height={100} />}
								{adInfo.description}
								<hr />
								{adInfo.views && (
									<small>Views: {adInfo.views}</small>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="rightSide">
					<div className="box box-padding">
						{loading && <Fake height={20} />}
						{adInfo.priceNegotiable && 'Negotiable Price'}
						{!adInfo.priceNegotiable && adInfo.price && (
							<div className="price">
								Price: <span>$ {adInfo.price}</span>
							</div>
						)}
					</div>
					{loading && <Fake height={50} />}
					{adInfo.userInfo && (
						<>
							<a
								href={`mailto:${adInfo.userInfo.email}`}
								target="_blank"
								className="contactSellerLink"
							>
								Contact seller
							</a>
							<div className="createdBy box box--padding">
								<strong>{adInfo.userInfo.name}</strong>
								<small>Email: {adInfo.userInfo.email}</small>
								<small>State: {adInfo.state}</small>
							</div>
						</>
					)}
				</div>
			</PageArea>
			<OthersArea>
				{adInfo.others && (
					<>
						<h2>Other offers from this vendor</h2>
						<div className="list">
							{adInfo.others.map((i, k) => (
								<AdItem key={k} data={i} />
							))}
						</div>
					</>
				)}
			</OthersArea>
		</PageContainer>
	);
};

export default Page;
