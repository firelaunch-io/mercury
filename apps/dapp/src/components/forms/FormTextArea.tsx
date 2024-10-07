import React from 'react';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

export type FormTextAreaProps<T extends FieldValues> = {
  label: string;
  id: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

export const FormTextArea = <T extends FieldValues>({
  label,
  id,
  register,
  errors,
}: FormTextAreaProps<T>) => (
  <div>
    <label htmlFor={id} className="block mb-1">
      {label}
    </label>
    <textarea
      id={id}
      {...register(id)}
      className="w-full px-3 py-2 bg-gray-800 rounded"
      rows={4}
    />
    {errors[id] && (
      <p className="text-red-500 text-sm mt-1">
        {errors[id]?.message?.toString()}
      </p>
    )}
  </div>
);
