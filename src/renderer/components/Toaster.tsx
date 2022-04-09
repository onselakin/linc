/* eslint-disable react/require-default-props */

import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface ToasterProps {
  title: string;
  isShowing: boolean;
  onClose?: () => void;
}

const Toaster: React.FC<ToasterProps> = ({ title, isShowing, children, onClose }) => (
  <Transition
    as={Fragment}
    show={isShowing}
    enter="transform duration-150 ease-in-out"
    enterFrom="-left-[512px]"
    enterTo="left-0"
    leave="transform duration-150"
    leaveFrom="left-0"
    leaveTo="-left-[512px]"
  >
    <div className="w-[512px] border-2 border-gray-700 bg-container absolute bottom-0 left-0 rounded flex flex-col shadow">
      <div className="flex m-2">
        <div className="flex-1 text-orange">{title}</div>
        <button type="button" className="text-gray-200" onClick={onClose}>
          <i className="fa-solid fa-circle-xmark fa-lg" />
        </button>
      </div>
      <div className="flex-1 mx-2 my-1 text-gray-200">{children}</div>
      <div className="flex m-2">
        <button
          type="button"
          className="rounded border-2 border-gray-500 hover:border-green text-gray-400 hover:text-green text-sm py-1 px-4 no-underline text-center w-24 h-8"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  </Transition>
);

export default Toaster;
