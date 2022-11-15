import { Fragment, useRef, useState } from "react";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";


export default function GiveFeedbackModal({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) {
    const cancelButtonRef = useRef(null);
    let [submitClicked, setSubmitClicked] = useState(false);
    let [feedbackText, setFeedbackText] = useState("");

    function submitClick(){
      setSubmitClicked(true);
      
      setTimeout(() => setOpen(false),1000);
      setTimeout(() => setSubmitClicked(false),2000);
    }

    function handleChange(event: { target: { value: any } }) {
      const {value} = event.target;
      setFeedbackText(value);
    }
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
                        📝
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Enter Feedback for Recce
                        </Dialog.Title>
                        <div className="sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <div className="sm:col-span-2 sm:mt-0">
                            <textarea
                              id="feedback"
                              name="feedback"
                              rows={5}
                              className="shadow-smsm:text-sm block w-full max-w-lg rounded-md border-gray-300"
                              defaultValue={""}
                              value={feedbackText}
                              onChange={handleChange}
                            />
                            <p className="mt-2 text-sm text-gray-500">
                              What issues did you encounter, and what would you
                              recommend changing?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className={`${
                        submitClicked
                          ? "inline-flex w-full justify-center rounded-md border border-transparent bg-green-400 px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm"
                          : "inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-400 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                      }`}
                      onClick={submitClick}
                    >
                      {submitClicked ? "Submitted!" : "Submit"}
                    </button>
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