import React from "react";
import Footer2 from "../../footer2/Footer2";
import CountdownTimer from "../../../ui/CountdownTimer"
import Link from "next/link";
import Navbar from "../../navbar/Navbar";

type Props = {};

const HeroGameCountDown = (props: Props) => {

  const deadliine = new Date("Nov 1, 2023 00:00:00").getTime();
  return (
    <section className="flex flex-col justify-center items-center px-6 py-28 max-w-screen-md md:mx-auto">
      <Navbar />
      <nav className="flex mb-6 self-start" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href={"/"}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-500 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3 mr-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                href={"/dashboard"}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-green-500 md:ml-2 dark:text-gray-400 dark:hover:text-white"
              >
                Play Game
              </Link>
            </div>
          </li>
        </ol>
      </nav>
      <div className="text-center mb-12">
        <h1 className="text-[36px] lg:text-[50px] font-lilita">Game Launch Countdown</h1>
        <p className="text-[18px] lg:text-[24px] font-lato">Our game is coming soon!</p>
      </div>
      <CountdownTimer deadline={deadliine} />
      <div className="max-w-[800px] text-center my-[50px] mx-0">
        <h2 className="text-2xl lg:text-[32px] mb-5 font-lilita">What is our Project?</h2>
        <p className="lg:text-xl font-lato text-lg mb-12">
          Hepper Token (HPT) is a token designed to address the concerns within the crypto community.
          It encourages community-driven research, provides exclusive access to vetted projects,
          offers protection against scams, and lets you have a say in decision-making.... <br /> {" "}
          <Link href={"/faq"}>
            <button className="bg-green-500 text-white p-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg mt-10">
              Visit FAQ for more.
            </button>
          </Link>
        </p>
        <h2 className="lg:text-[32px] mb-5 font-lilita text-2xl">When will it be available?</h2>
        <p className="lg:text-xl font-lato text-lg mb-12">
        As game development takes alot of time and energy, we cannot give you an estimated time yet but we would 
        be giving weekly updated about our game in our group. Be sure to
         join us!
        </p>
      </div>

    </section>
  );
};

export default HeroGameCountDown;
