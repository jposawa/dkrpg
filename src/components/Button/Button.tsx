import React from "react";

import styles from "./Button.module.scss";

export type ButtonProps = {
	onClick: (e?: any) => void;
	type?: "submit" | "button" | "reset";
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	rounded?: boolean;
	width?: string;
	height?: string;
};

export const Button = ({
	onClick,
	type = "button",
	className,
	style,
	children,
	rounded = false,
	width,
	height,
}: ButtonProps) => {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`${styles.button} ${className}`}
			style={
				{
          borderRadius: rounded ? "50%" : "auto",
					width,
					height,
					...style,
				} as React.CSSProperties
			}
		>
			{children}
		</button>
	);
};
