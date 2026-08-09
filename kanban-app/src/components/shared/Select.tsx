import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  className?: string;
  selectClassName?: string;
}

const Select = ({
  label,
  error,
  options,
  className,
  selectClassName,
  id,
  ...props
}: SelectProps) => (
  <div className={clsx("select", className)}>
    {label && (
      <label htmlFor={id} className="select__label">
        {label}
      </label>
    )}

    <div className="select__wrapper">
      <select
        id={id}
        {...props}
        className={clsx(
          "select__field",
          {
            "select__field--error": !!error,
          },
          selectClassName,
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown size={18} className="select__icon" />
    </div>

    {error && <p className="select__error">{error}</p>}
  </div>
);

export default Select;
