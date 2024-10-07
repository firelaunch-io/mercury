import React from 'react';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

export type FormImageUploadProps<T extends FieldValues> = {
  label: string;
  id: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  previewImage: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FormImageUpload = <T extends FieldValues>({
  label,
  id,
  register,
  errors,
  previewImage,
  handleImageUpload,
}: FormImageUploadProps<T>) => (
  <div>
    <label htmlFor={id} className="block mb-1">
      {label}
    </label>
    <div className="flex flex-col items-center space-y-4">
      {previewImage && (
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <input
        id={id}
        type="file"
        accept="image/*"
        {...register(id)}
        className="hidden"
        onChange={handleImageUpload}
      />
      <label htmlFor={id} className="cursor-pointer purple-button text-xs p-2">
        Select Image
      </label>
    </div>
    {errors[id] && (
      <p className="text-red-500 text-sm mt-1">
        {errors[id]?.message?.toString()}
      </p>
    )}
  </div>
);
