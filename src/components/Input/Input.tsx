import React from "react";

import styles from "./Input.module.scss";

type InputProps = {
  id?: string;
  type?: string;
  min?: number;
  max?: number;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  defaultValue?: any;
  disabled?: boolean;
  onChange?: (event: any) => void;
  defaultChecked?: boolean;
  title?: string;
  required?: boolean;
  placeholder?: string;
}

export const Input = ({
  id,
  name,
  className,
  defaultValue,
  style,
  disabled = false,
  onChange,
  defaultChecked = false,
  type = "text",
  min,
  max,
  title,
  required,
  placeholder,
}: InputProps) => {
  return (
    <input
      id={id}
      name={name}
      title={title}
      className={`${styles.input} ${className || ""}`}
      style={{...style}}
      defaultValue={defaultValue}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      type={type}
      min={min}
      max={max}
      required={required}
      placeholder={placeholder}
    />
  )
}