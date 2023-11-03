import { Popover } from "antd";
import React from "react";

import styles from "./FeatureCard.module.scss";

export type FeatureCardProps = {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
};

export const FeatureCard = ({
	children,
	className,
	style,
}: FeatureCardProps) => (
	<article
		className={`${styles.featureCard} ${className || ""}`}
		style={{ ...style } as React.CSSProperties}
	>
		<span className={styles.background} />
    {children}
	</article>
);
