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
			className={`${styles.modal} ${className || ""} ${isOpen ? "" : "hidden"}`}
			style={{ ...style }}
		>
			<span className={styles.background} onClick={closeModal} />

			{!!header && <div className={styles.modalHeader}>{header}</div>}

			{!hideCloseButton && (
				<button className={styles.closeBtn} onClick={closeModal}>
					&times;
				</button>
			)}

			<div className={styles.modalContent}>
        {children}
      </div>
		</section>
	);
};
