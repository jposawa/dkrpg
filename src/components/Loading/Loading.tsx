import styles from "./Loading.module.scss";

export type LoadingProps = {
	className?: string;
	style?: React.CSSProperties;
	color?: string;
	size?: string;
	showInner?: boolean;
};

export const Loading = ({
	className,
	style,
	color,
	size,
	showInner = false,
}: LoadingProps) => {
	return (
		<span
			className={`${styles.loading} ${className || ""}`}
			style={
				{
					...style,
					"--borderColor": color,
					"--size": size,
				} as React.CSSProperties
			}
		>
			{showInner && <span />}
		</span>
	);
};
