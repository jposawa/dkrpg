import React from "react";

import styles from "./Modal.module.scss";

export type ModalProps = {
	children: React.ReactNode;
	isOpen: boolean;
	setIsOpen: (arg0?: boolean) => void;
	header?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	hideCloseButton?: boolean;
};

export const Modal = ({
	children,
	isOpen,
	setIsOpen,
	header,
	className,
	style,
	hideCloseButton = false,
}: ModalProps) => {
	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<section
			className={`${styles.modal} ${isOpen ? "" : "hidden"}`}
			style={{ ...style }}
		>
			<span className={styles.background} onClick={closeModal} />

			<div className={styles.mainContainer}>
				{!hideCloseButton && (
					<button className={styles.closeBtn} onClick={closeModal}>
						&times;
					</button>
				)}
				<div className={styles.modalHeader}>{header}</div>

				<div className={`${styles.modalContent} ${className || ""}`}>
					{children}
				</div>
			</div>
		</section>
	);
};
