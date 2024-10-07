import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormInput } from '@/components';
import { useModal, useRpc } from '@/hooks';

const schema = z.object({
  rpcUrl: z.string().url('Please enter a valid URL'),
});

type FormData = z.infer<typeof schema>;

export const CustomRpcModal: React.FC = () => {
  const { isOpen, closeModal } = useModal();
  const { setRpc } = useRpc();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    setRpc(data.rpcUrl);
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all black-blur-background">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4"
                >
                  Enter Custom RPC URL
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-2 text-white">
                    <FormInput
                      label="RPC URL"
                      id="rpcUrl"
                      type="text"
                      register={register}
                      errors={errors}
                      placeholder="https://your-custom-rpc.com"
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="purple-button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="firelaunch-button">
                      Save
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
