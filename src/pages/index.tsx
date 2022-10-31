import type {NextPage} from "next";
import {useState, useEffect} from "react";
import {Disclosure, Menu, Transition, Listbox} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {signIn, useSession} from "next-auth/react";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Head from "next/head";
import axios from "axios";

// let user = {
//   name: "Pochi Chao",
//   email: "19pochi94@gmail.com",
//   imageUrl: "/images/profilePic.jpeg"
// }

const navigation = [
  { name: "How to Use", href: "#", current: false },
  { name: "Give Feedback", href: "#", current: false },
]

const mediaTypes = [
  {
    id: 1,
    name: "Books",
    emoji: "📚",
  },
  {
    id: 2,
    name: "Movies",
    emoji: "🎬",
  },
  {
    id: 3,
    name: "TV Shows",
    emoji: "📺",
  },
  {
    id: 4,
    name: "Manga",
    emoji: "📖",
  },
  {
    id: 5,
    name: "Poems",
    emoji: "📜",
  },
  {
    id: 6,
    name: "Games",
    emoji: "🎮",
  },
]

const recBoxes = [
  {
    id: 1,
    title: '',
    creator: '',
    href: '#',
    imageSrc: '',
    imageAlt: "Recommendation No.1 Picture",
    year: '',
    description: '',
  },
  {
    id: 2,
    title: '',
    creator: '',
    href: '#',
    imageSrc: '',
    imageAlt: "Recommendation No.2 Picture",
    year: '',
    description: '',
  },
  {
    id: 3,
    title: '',
    creator: '',
    href: '#',
    imageSrc: '',
    imageAlt: "Recommendation No.3 Picture",
    year: '',
    description: '',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(item => Boolean(item)).join("")
}

const Home: NextPage = () => {
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState(["","",""]);
  const {data, status} = useSession();
  
  const [selected, setSelected] = useState(mediaTypes[0]!);
  const [recomRefine, setRecomRefine] = useState({
    recommendation: " ",
    refinement: " ",
  });
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [imageRecs, setImageRecs] = useState();


  function handleChange(event: { target: { name: any; value: any; }; }){
    const {name, value} = event.target;
    setRecomRefine((prevValue: {recommendation: any; refinement: any;}) => {
      return {
        ...prevValue,
        [name]: value
      }
    })
  }

  async function handleClick(event: React.MouseEvent<HTMLElement>){
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selected, recomRefine }),
    });
    const data = await response.json();
    let result1 = data.result.substring((data.result.indexOf("1.")+3), (data.result.indexOf("2.")));
    let result2 = data.result.substring((data.result.indexOf("2."))+3,(data.result.indexOf("3.")));
    let result3 = data.result.substring((data.result.indexOf("3.")+3));
    let result1Arr = result1.split(" | ");
    let result2Arr = result2.split(" | ");
    let result3Arr = result3.split(" | ");
    let resultArr = [result1Arr, result2Arr, result3Arr];
    
    for (let i = 0; i < 3; i++){
        recBoxes[i]!.title = resultArr[i][0];
        recBoxes[i]!.creator = resultArr[i][1];
        recBoxes[i]!.year = resultArr[i][2];
        recBoxes[i]!.description = resultArr[i][3];
    }

    setResult(resultArr);
    setResultsLoaded(true);

  }

  return (
    <>
      <Head>
        <title>Recce: Recommendations4U!</title>
      </Head>
      <div className="min-h-full">
        {/************Navigation Bar*********** */}
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8"
                      src="/images/RecceLogo.jpg"
                      alt="RecceLogo"
                    />
                    <p className="pl-2 text-lg text-purple-400">Recce</p>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "text-gray-300 outline outline-offset-1 outline-yellow-400 hover:bg-gray-700 hover:text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex items-center md:ml-6">
                    <button
                      type="button"
                      className={`p-1 text-gray-400 hover:text-white ${
                        status === "authenticated" ? "hidden" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                      }}
                    >
                      Sign Up
                    </button>
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="mr-3 flex max-w-xs items-center rounded-full bg-gray-800 text-sm">
                          <span className="sr-only">Open user menu</span>
                          {/* <img
                            className="h-8 w-8 rounded-full"
                            src={user.imageUrl}
                            alt="User Profile Pic"
                          /> */}
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 "></Menu.Items>
                    </Menu>
                    <button
                      className="text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={(event) => {
                        event.preventDefault();
                        signIn("google");
                      }}
                    >
                      {status === "authenticated" ? "Sign Out" : "Sign In"}
                    </button>
                  </div>
                  <div className="-mr-2 flex md:hidden">
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

          {/* ***********Give me recommendations for + Optional Refinement User Inputs*********** */}
          <div>
            <label className="block pt-3 text-sm font-medium text-gray-700">
              Give me recommendations for {selected.name} like...
              {recomRefine.recommendation}
              <br></br>(NOTE: Please don't reference anything before June 2021,
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
              (Optional) Describe other requirements: {recomRefine.refinement}
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
              className="md:text-md flex w-1/4 items-center justify-center rounded-md border border-transparent bg-indigo-400 px-3 py-1 text-base font-medium text-white hover:bg-indigo-600 md:py-3 md:px-6"
            >
              Execute Recce!
            </button>
          </div>
        </div>

        <div className={`mx-auto max-w-2xl py-4 px-4 sm:py-18 sm:px-6 lg:max-w-7xl lg:px-8 ${resultsLoaded ? 'visible' : 'invisible'}`}>
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
      </div>
    </>
  );
}

export default Home;
