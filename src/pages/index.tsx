import { Fragment } from "react";
import type { NextPage } from "next";
import { useState } from "react";
import {
  Popover,
  Disclosure,
  Menu,
  Transition,
  Listbox,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import axios from "axios";
import HowToUseModal from "../components/HowToUseModal";
import GiveFeedbackModal from "../components/GiveFeedbackModal";
import Footer from "../components/Footer";

const navigation = [
  { name: "About / How to Use", current: false },
  { name: "Give Feedback", current: false },
];

const mediaTypes = [
  {
    id: 1,
    name: "Book",
    emoji: "📚",
  },
  {
    id: 2,
    name: "Movie",
    emoji: "🎬",
  },
  {
    id: 3,
    name: "TV Show",
    emoji: "📺",
  },
  {
    id: 4,
    name: "Manga",
    emoji: "📖",
  },
  {
    id: 5,
    name: "Poem",
    emoji: "📜",
  },
  {
    id: 6,
    name: "Game",
    emoji: "🎮",
  },
];

function classNames(...classes: string[]) {
  return classes.filter((item) => Boolean(item)).join("");
}

const Home: NextPage = () => {
  const [selected, setSelected] = useState(mediaTypes[0]!);
  const [open, setOpen] = useState(false);
  const [executeClicked, setExecuteClicked] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [recBoxes, setRecBoxes] = useState([
    {
      id: 1,
      title: "",
      creator: "",
      href: "#",
      imageSrc: "",
      imageAlt: "Recommendation No.1 Picture",
      year: "",
      description: "",
    },
    {
      id: 2,
      title: "",
      creator: "",
      href: "#",
      imageSrc: "",
      imageAlt: "Recommendation No.2 Picture",
      year: "",
      description: "",
    },
    {
      id: 3,
      title: "",
      creator: "",
      href: "#",
      imageSrc: "",
      imageAlt: "Recommendation No.3 Picture",
      year: "",
      description: "",
    },
  ]);

  const [recomRefine, setRecomRefine] = useState({
    recommendation: " ",
    refinement: " ",
  });
  const [resultsLoaded, setResultsLoaded] = useState(false);

  function openHowToUseModal() {
    setOpen(true);
  }

  function openGiveFeedbackModal() {
    setOpenFeedback(true);
  }

  function handleChange(event: { target: { name: any; value: any } }) {
    const { name, value } = event.target;
    setRecomRefine((prevValue: { recommendation: any; refinement: any }) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function updateRecBoxes(res: any) {
    const result1Arr = res.data.result
      .substring(
        res.data.result.indexOf("1.") + 3,
        res.data.result.indexOf("2.")
      )
      .split(" | ");
    const result2Arr = res.data.result
      .substring(
        res.data.result.indexOf("2.") + 3,
        res.data.result.indexOf("3.")
      )
      .split(" | ");
    const result3Arr = res.data.result
      .substring(res.data.result.indexOf("3.") + 3)
      .split(" | ");
    const resultArr = [result1Arr, result2Arr, result3Arr];
    setRecBoxes((prevRecBoxes) => {
      const newRecBoxes = prevRecBoxes.map((recBox) => {
        if (recBox.id === 1) {
          return {
            ...recBox,
            title: resultArr[0][0],
            creator: resultArr[0][1],
            year: resultArr[0][2],
            description: resultArr[0][3],
          };
        } else if (recBox.id === 2) {
          return {
            ...recBox,
            title: resultArr[1][0],
            creator: resultArr[1][1],
            year: resultArr[1][2],
            description: resultArr[1][3],
          };
        } else if (recBox.id === 3) {
          return {
            ...recBox,
            title: resultArr[2][0],
            creator: resultArr[2][1],
            year: resultArr[2][2],
            description: resultArr[2][3],
          };
        }
        return recBox;
      });

      async function getImagesOne(newRecBoxes: any) {
        return await axios.post("/api/get-images", {
          term: newRecBoxes[0]?.title,
          genre: selected.name,
        });
      }
      async function getImagesTwo(newRecBoxes: any) {
        return await axios.post("/api/get-images", {
          term: newRecBoxes[1]?.title,
          genre: selected.name,
        });
      }
      async function getImagesThree(newRecBoxes: any) {
        return await axios.post("/api/get-images", {
          term: newRecBoxes[2]?.title,
          genre: selected.name,
        });
      }

      Promise.all([
        getImagesOne(newRecBoxes),
        getImagesTwo(newRecBoxes),
        getImagesThree(newRecBoxes),
      ]).then((results) => {
        setRecBoxes((prevRecBoxes) => {
          const newRecBoxes = prevRecBoxes.map((recBox) => {
            if (recBox.id === 1) {
              return { ...recBox, imageSrc: results[0].data };
            } else if (recBox.id === 2) {
              return { ...recBox, imageSrc: results[1].data };
            } else if (recBox.id === 3) {
              return { ...recBox, imageSrc: results[2].data };
            }
            return recBox;
          });
          return newRecBoxes;
        });
      });
      return newRecBoxes;
    });
  }

  async function handleClick(event: React.MouseEvent<HTMLElement>) {
    const requestInput = {
      selected: selected,
      recomRefine: recomRefine,
    };
    setExecuteClicked(true);
    await axios
      .post("/api/generate", requestInput, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        updateRecBoxes(res);
        setExecuteClicked(false);
      });

    setResultsLoaded(true);
  }

  return (
    <>
      <HowToUseModal open={open} setOpen={setOpen} />
      <GiveFeedbackModal open={openFeedback} setOpen={setOpenFeedback} />
      <Head>
        <title>Recce</title>
      </Head>
      <div className="flex min-h-screen flex-col">
        {/************Navigation Bar*********** */}
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-lg"
                      src="/images/RecceLogo.jpg"
                      alt="RecceLogo"
                    />
                    <p className="flex pl-2 text-lg text-purple-400">
                      Recce: Recommendations for You!
                    </p>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            onClick={
                              item.name === "About / How to Use"
                                ? openHowToUseModal
                                : openGiveFeedbackModal
                            }
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white ">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      onClick={
                        item.name === "About / How to Use"
                          ? openHowToUseModal
                          : openGiveFeedbackModal
                      }
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* ***********Choose Your Medium - User Selection*********** */}
        <div className="mx-auto w-3/5 pt-3">
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium text-gray-700">
                  Choose Your Medium
                </Listbox.Label>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-4 pl-3 pr-10 text-left shadow-sm  sm:text-sm">
                    <span className="flex items-center">
                      {selected.emoji}
                      <span className="ml-3 block truncate">
                        {selected.name}
                      </span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
                    {mediaTypes.map((mediaType) => (
                      <Listbox.Option
                        key={mediaType.id}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-indigo-200 text-blue-600"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={mediaType}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              {mediaType.emoji}
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-3 block truncate"
                                )}
                              >
                                {mediaType.name}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-blue-600" : "text-indigo-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5 "
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </>
            )}
          </Listbox>

          <div>
            <label className="block pt-3 text-sm font-medium text-gray-700">
              Give me recommendations for {selected.name}
              {selected.name === "Manga" ? "" : "s"} like...
              <br></br>(NOTE: Please do not reference anything after June 2021,
              as that is the most recent info that this model uses.)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm"></span>
              </div>
              <input
                onChange={handleChange}
                type="text"
                name="recommendation"
                value={recomRefine.recommendation}
                className="block w-full rounded-md border-gray-300 pl-3 pr-6 sm:text-sm"
                placeholder="e.g. The Office"
              />
            </div>
          </div>
          <div>
            <label className="block pt-3 text-sm font-medium text-gray-700">
              (Optional) Describe other requirements:
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm"></span>
              </div>
              <input
                onChange={handleChange}
                type="text"
                name="refinement"
                value={recomRefine.refinement}
                className="mx-auto block w-full rounded-md border-gray-300 pl-3 pr-6 sm:text-sm"
                placeholder="e.g. less than 2 hours long, light-hearted, etc."
              />
            </div>
          </div>
          <div className="items-center justify-center pt-3">
            <button
              onClick={handleClick}
              className={`${
                executeClicked
                  ? "md:text-md flex w-1/3 items-center justify-center rounded-md border border-transparent bg-green-400 px-5 py-3 text-base font-medium text-white md:w-1/4 md:py-3 md:px-5"
                  : "md:text-md flex w-1/3 items-center justify-center rounded-md border border-transparent bg-indigo-400 px-5 py-3 text-base font-medium text-white hover:bg-indigo-600 md:w-1/4 md:py-3 md:px-5"
              }`}
            >
              {executeClicked ? "Executing, may take 5-10s" : "Execute Recce!"}
            </button>
          </div>
        </div>

        <div
          className={`sm:py-18 mx-auto max-w-2xl py-4 px-4 sm:px-6 lg:max-w-7xl lg:px-8 ${
            resultsLoaded ? "visible" : "invisible"
          }`}
        >
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Recommendations
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {recBoxes.map((recBox) => (
              <div key={recBox.id} className="group relative">
                <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                  <img
                    src={recBox.imageSrc}
                    alt={recBox.imageAlt}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={recBox.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {recBox.title} ({recBox.creator})
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {recBox.description}
                    </p>
                  </div>
                  <p className="mx-1 text-sm font-medium text-gray-900">
                    {recBox.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
