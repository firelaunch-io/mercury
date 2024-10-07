import React from 'react';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

export type FormInputProps<T extends FieldValues> =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: Path<T>;
    type: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
  };

export const FormInput = <T extends FieldValues>({
  label,
  id,
  type,
  register,
  errors,
  ...props
}: FormInputProps<T>) => (
  <div className="flex-1">
    <label htmlFor={id} className="block mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      className="w-full px-3 py-2 bg-gray-800 rounded"
      {...props}
    />
    {errors[id] && (
      <p className="text-red-500 text-sm mt-1">
        {errors[id]?.message?.toString()}
      </p>
    )}
  </div>
);
