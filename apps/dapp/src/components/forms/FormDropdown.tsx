import React from 'react';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

export type FormDropdownProps<T extends FieldValues> = {
  label: string;
  id: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  options: { value: string; label: string }[];
};

export const FormDropdown = <T extends FieldValues>({
  label,
  id,
  register,
  errors,
  options,
}: FormDropdownProps<T>) => (
  <div>
    <label htmlFor={id} className="block mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        {...register(id)}
        className="w-full px-3 py-2 bg-gray-800 rounded appearance-none h-10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
    {errors[id] && (
      <p className="text-red-500 text-sm mt-1">
        {errors[id]?.message?.toString()}
      </p>
    )}
  </div>
);
