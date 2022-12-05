import { Fragment, useRef, useState } from "react";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function HowToUseModal({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) {
    const cancelButtonRef = useRef(null);

    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center text-3xl sm:mx-0 sm:h-10 sm:w-10">
                        ℹ️
                      </div>
                      <div className="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="pb-3 text-2xl font-medium leading-6 text-gray-900"
                        >
                          About / How to Use Recce:
                        </Dialog.Title>
                        <p className="py-1 text-sm leading-relaxed">
                          Recce is a recommendation-generation tool which sends
                          the following 3 user inputs:
                        </p>
                        <p className="py-1 pl-4 text-sm leading-relaxed">
                          1. chosen medium (e.g. TV shows), <br></br>
                          2. base reference (something similar to which you want
                          recommendations, e.g. Succession), <br></br>
                          3. search refinement (e.g. originally released after
                          2010, drama, highly-rated) <br></br>
                        </p>
                        <p className="text-sm leading-relaxed">
                          to the OpenAI general purpose API, GPT-3.
                        </p>
                        <p className="pt-2 text-sm leading-relaxed">
                          GPT-3 then generates a list of recommendations based
                          on your inputs, and the list is then displayed on the
                          page with corresponding images from the Bing Image
                          Search API.
                        </p>
                        <p className="pt-2 text-sm leading-relaxed">
                          The search refinement feature is optional, and if you
                          do not want to use it, just leave the field empty.
                          However, the more search refinement you provide, the
                          more accurate and tailored your results will be.
                        </p>
                        <p className="pt-2 text-sm leading-relaxed">
                          Please do not reference anything after June 2021, as
                          that is the most recent info that this model uses.
                        </p>
                        <p className="pt-2 text-sm leading-relaxed">
                          This website design utilizes TailwindCSS.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Exit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
}