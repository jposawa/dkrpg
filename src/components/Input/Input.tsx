import React from "react";

import styles from "./Input.module.scss";

type InputProps = {
  id?: string;
  type?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  defaultValue?: any;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultChecked?: boolean;
  title?: string;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  list?: string;
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
  maxLength,
  pattern,
  list,
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
      maxLength={maxLength}
      required={required}
      placeholder={placeholder}
      pattern={pattern}
      list={list}
    />
  )
}