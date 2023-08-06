import React from "react";

import styles from "./Button.module.scss";

export type ButtonProps = {
  onClick: (e?: any) => void,
  type?: "submit" | "button" | "reset",
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode,
}

export const Button = ({
  onClick,
  type = "button",
  className,
  style,
  children,
}: ButtonProps) => {
  return <button
    type={type}
    onClick={onClick}
    className={`${styles.button} ${className}`}
    style={{ ...style }}
  >
    {children}
  </button>
}