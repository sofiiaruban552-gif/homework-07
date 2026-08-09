import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "dashed";

type ButtonType = "button" | "submit"; 

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  variant?: ButtonVariant;
  small?: boolean;
  fullWidth?: boolean;
  type?: ButtonType;
}

const Button = ({
  children,
  className,
  variant = "primary",
  small = false,
  fullWidth = false,
  disabled = false,
  onClick,
  ...props
}: ButtonProps) => {
  const buttonClassName = clsx(
    "button",
    `button--${variant}`,
    small && "button--small",
    fullWidth && "button--full-width",
    disabled && "button--disabled",
    className,
  );

  return (
    <button
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
