import type { InputHTMLAttributes } from "react";
import clsx from "clsx";


interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
}

const Input = ({
  type = "text",
  label,
  error,
  className,
  inputClassName,
  id,
  ...props
}: InputProps) => {
  return (
    <div className={clsx("input__wrapper", className)}>
      {label && (
        <label htmlFor={id} className="input__label">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        className={clsx(
          "input__field",
          {
            "input__field--error": !!error,
          },
          inputClassName,
        )}
        {...props}
      />

      {error && (
        <span className="input__error">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;

