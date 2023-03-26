import { Fragment } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface ModalPropsType {
  isOpen: boolean | undefined
  onClose: () => void
  title?: String
  children: React.ReactNode
}

export function Modal ({ isOpen, onClose, title, children }: ModalPropsType) {
  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div
                  className="flex bg-white justify-end pb-2 cursor-pointer"
                  onClick={onClose} >
                  <XMarkIcon className="w-8 h-8 text-stone-600" />
                </div>
                {
                  (title != null) && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                  )
                }
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
