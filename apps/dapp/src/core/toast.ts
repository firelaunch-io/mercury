import { toast } from 'sonner';

type ToastPromiseOptions = Parameters<typeof toast.promise>[1];

export const withToast = <T>(
  promise: Promise<T>,
  data?: ToastPromiseOptions,
): Promise<T> =>
  new Promise((resolve, reject) => {
    toast.promise(
      promise.then(resolve).catch((error) => {
        reject(error);
        throw error; // Rethrow the error
      }),
      data,
    );
  });
