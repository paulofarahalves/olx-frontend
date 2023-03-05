import React from 'react';
import { ModalArea } from './styled';

const Modal = ({ isOpened, setModalOpen, children }) => {
	if (isOpened) {
		return (
			<ModalArea>
				<div className="background">
					<div className="modal">
						<button className="close" onClick={setModalOpen}>
							x
						</button>
						{children}
					</div>
				</div>
			</ModalArea>
		);
	}
	return null;
};

export default Modal;
