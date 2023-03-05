import styled from 'styled-components';

export const ModalArea = styled.div`
	.background {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgb(0, 0, 0, 0.3);
		z-index: 1000;
	}

	.close {
		position: fixed;
		top: 0;
		right: 0;
		margin: 2px;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		text-align: center;
		font-weight: bold;
		cursor: pointer;
		border: none;
		background-color: #fff;

		&:hover {
			background-color: #f1f1f1;
		}
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 40px;
		background-color: #fff;
		border-radius: 10px;
		color: black;
	}
`;
