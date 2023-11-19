import React, { useState, useEffect } from "react";
import style from "../../glass/glass.module.css";
import Link from "next/link";
import { GoShareAndroid } from "react-icons/go";
import { TbMoneybag } from "react-icons/tb";
import Sidebar, { SidebarItem } from "@/components/ui/Sidebar";
import { buttonVariants } from "@/components/ui/button";
import {
  HPT_Token_Contract_MAINNET,
  distributorContract,
  REWARD_Token_Contract,
} from "../constant/Address";
import {
  calcSell,
  calcBNBPrice,
  holderBalance,
} from "../utils/Tokenprice";

import Timer from "../timer/Timer";

import {
  useAddress,
  useChainId,
  useChain,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { Skeleton } from "@/components/ui/skeleton";
import { MdPriceCheck } from "react-icons/md";
// import moment from "moment";
import { timing } from "../utils/Timing";

function hptdecimal(a: number) {
  return a / 10 ** 9;
}

function usdtdecimal(a: number) {
  return a / 10 ** 18;
}

const Hero = () => {
  const [getPrice, setGetPrice] = useState(0);
  const [getAmount, setGetAmount] = useState(0);

  const address = useAddress();
  const chainId = useChainId();
  const chain = useChain();

  const { contract, isLoading: isLoadingContract } = useContract(
    HPT_Token_Contract_MAINNET,
    "token"
  );
  const { data: distributorCa, isLoading: isLoadingDistributor } = useContract(
    distributorContract,
    "custom"
  );
  const { data, isLoading: isLoadingName } = useContractRead(contract, "name");
  const { data: tokenBalance, isLoading: isLoadingTknBal } = useContractRead(
    contract,
    "balanceOf",
    [address]
  );
  const balanceOfAddr = hptdecimal.apply(undefined, [tokenBalance?.toString()]);

  const { mutateAsync: claimDividend, isLoading: isLoadingClaim } =
    useContractWrite(distributorCa, "claimDividend");
  const { data: unpaidEarning, isLoading: isLoadingUnpaidEarning } =
    useContractRead(distributorCa, "getUnpaidEarnings", [address]);

  const unpaidEarningFixed = usdtdecimal.apply(undefined, [
    unpaidEarning?.toString(),
  ]);

  const { data: getShares, isLoading: isLoadingShares } = useContractRead(
    distributorCa,
    "shares",
    [address]
  );
  const totalRealised = usdtdecimal.apply(undefined, [
    getShares?.[2].toString(),
  ]);

  const { data: getClaimTime, isLoading: isLoadingClaimTime } = useContractRead(
    distributorCa,
    "shareholderClaims",
    [address]
  );

  const value = timing(getClaimTime);

  const call = async () => {
    try {
      const data = await claimDividend({ args: [] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  useEffect(() => {
    const price = async () => {
      try {
        const bnbPrice = await calcBNBPrice(); // query pancakeswap to get the price of BNB in USDT
        const tokens_to_sell = 1;
        const priceInBnb = await calcSell(tokens_to_sell); // calculate TOKEN price in BNB
        const priceInUSD = priceInBnb * bnbPrice;
        setGetPrice(priceInUSD);
      } catch (err) {}
    };

    const holdings = async () => {
      try {
        const bnbPrice = await calcBNBPrice(); // query pancakeswap to get the price of BNB in USDT
        const priceInBnb = await calcSell(balanceOfAddr); // calculate TOKEN price in BNB
        console.log(balanceOfAddr, "balanceOfAddr");
        const priceInUSD = priceInBnb * bnbPrice;
        console.log(priceInUSD, "priceInUSD");
        setGetAmount(priceInUSD);

        console.log(
          "SHIT_TOKEN VALUE IN BNB : " +
            priceInBnb +
            " | Just convert it to USD "
        );
        console.log(`SHIT_TOKEN VALUE IN USD: ${priceInBnb * bnbPrice}`);
      } catch (err) {}
    };
    price();
    holdings();
  }, []);

  // If an address is connected but the chainId of the wallet is not the same chain as HPT
  if (address && chainId != 56) {
    return (
      <div className="py-20 lg:mb-32">
        <div className="flex gap-x-4">
          <div className="w-[20%]">
            <Sidebar>
              <SidebarItem
                icon={<TbMoneybag size={20} />}
                text="claim bonus"
                active
                alert={true}
              />
              <SidebarItem
                icon={<GoShareAndroid size={20} />}
                text="Revenue Share (Coming Soon!)"
                active
                alert={false}
              />

              <div className="mt-10">
                <SidebarItem
                  icon={<MdPriceCheck size={20} />}
                  text={`Token Price: $${
                    !isLoadingContract ? (
                      getPrice.toFixed(11) || "0"
                    ) : (
                      <Skeleton className="w-[50px] h-[15px]" />
                    )
                  }`}
                  active
                  alert={false}
                />
              </div>
            </Sidebar>
          </div>

          <div className="flex flex-col-reverse lg:flex-row pt-10 pl-16 pr-10 gap-4 lg:pt-16 lg:gap-x-12">
            <div className="flex-grow ">
              <div className="flex-grow mt-6 sm:mt-0 ">
                <div>
                  <h1 className="font-lilita text-2xl sm:text-3xl md:text-4xl mb-4">
                    Dashboard
                  </h1>
                </div>
                {/* 
                  <h2 className="font-lato text-lg sm:text-xl md:text-2xl mb-4 text-green-500">
                        Current Apy: 0%
                      </h2> 
                  */}
                <div className="flex justify-end mb-6">
                  <div className="flex items-start">
                    <Link href={""}>
                      <button
                        className="bg-green-500 text-white p-2 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg"
                        disabled={true}
                      >
                        <p className="font-lilita text-sm md:text-lg">
                          Claim reward
                        </p>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col px-4 md:px-8 py-6 mx-1 md:py-8 rounded-xl dark:bg-opacity-10 backdrop-blur-sm mb-6 card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]">
                <h3 className="font-lilita text-base sm:text-lg md:text-xl">
                  Your Unclaimed Reward
                </h3>
                <p className="font-lato text-sm sm:text-base md:text-lg text-green-500">
                  Value: 0 USD
                </p>
              </div>

              <div className="flex flex-col px-10 py-6 md:px-8 mx-1 md:py-8 bg-white rounded-xl dark:bg-opacity-10 backdrop-blur-sm card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]">
                <h3 className="font-lilita text-base sm:text-lg md:text-xl mb-4">
                  Your Assets
                </h3>
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                  <div className="rounded-xl dark:bg-opacity-10 backdrop-blur-sm p-6 border border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)] card-shadows">
                    <Skeleton className="w-[100px] h-[20px]" />
                    {/* <h4 className="text-green-500 font-lato">0 USDT</h4> */}
                    <p className=" font-lato">Your Claimed Reward</p>
                  </div>
                  <div className="rounded-xl dark:bg-opacity-10 backdrop-blur-sm p-6 card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]">
                    <Skeleton className="w-[100px] h-[20px]" />
                    <Skeleton className="w-[100px] h-[20px]" />
                    {/* <h4 className="text-green-500 font-lato">0 HPT</h4> */}
                    {/* <p className="text-green-500"> Value: 0 USD</p> */}
                    <p>Your HPT Balance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-[20%]">
              <h2 className="font-lilita text-2xl sm:text-3xl md:text-4xl mb-4">
                Connected Wallet
              </h2>
              <h3 className="text-[red] font-bold uppercase">
                Connection Alert!
              </h3>
              <p>
                You are connected to {chain?.name} (chainId {chainId}), HPT
                token is on the BSC Network, switch your Network to the Binance
                Smart Chain (ChainId 57).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If an address is connected and the chainId of the wallet is the same chain as HPT
  if (address && chainId == 56) {
    return (
      <div className="py-20 lg:mb-32">
        {/* @note doings */}
        {/* <div className={style.glass}></div> */}
        <div className="flex gap-x-4">
          <div className="w-[20%]">
            <Sidebar>
              <SidebarItem
                icon={<TbMoneybag size={20} />}
                text="claim bonus"
                active
                alert={true}
              />
              <SidebarItem
                icon={<GoShareAndroid size={20} />}
                text="Revenue Share (Coming Soon!)"
                active
                alert={false}
              />

              <div className="mt-10 flex">
                <SidebarItem
                  icon={<MdPriceCheck size={20} />}
                  text={`Token Price: $${
                    !isLoadingTknBal && !isLoadingContract ? (
                      getPrice.toFixed(11) || "0"
                    ) : (
                      <Skeleton className="w-[50px] h-[15px]" />
                    )
                  }`}
                  active
                  alert={false}
                />
              </div>
            </Sidebar>
          </div>
          <div className="flex flex-col-reverse lg:flex-row pt-10 pl-16 pr-10 gap-4 lg:pt-16 lg:gap-x-12">
            <div className="flex-grow ">
              <div className="flex-grow mt-6 sm:mt-0 ">
                <h1 className="font-lilita text-2xl sm:text-3xl md:text-4xl mb-4">
                  Dashboard
                </h1>
                {/* <h2 className="font-lato text-lg sm:text-xl md:text-2xl mb-4 text-green-500">
                  Current Apy: 0%
                </h2> */}
                <div className="flex justify-end mb-6">
                  <div className="flex">
                    {/* <Link href={""}> */}
                    <button
                      className="bg-green-500 p-2 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg text-white"
                      disabled={isLoadingClaim || unpaidEarning == 0}
                      onClick={() => call()}
                    >
                      <p className="font-lilita text-sm md:text-lg ">
                        Claim reward
                      </p>
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col px-4 md:px-8 py-6 mx-1 md:py-8 bg-white rounded-xl
                    dark:bg-opacity-10 backdrop-blur-sm mb-6 card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-lilita text-base sm:text-lg md:text-xl">
                      Your Unclaimed Reward
                    </h3>
                    <p className="font-lato text-sm sm:text-base md:text-lg text-green-500 flex gap-2 mt-1">
                      Value:{" "}
                      {!isLoadingUnpaidEarning ? (
                        unpaidEarningFixed.toFixed(4) || "0"
                      ) : (
                        <Skeleton className="w-[50px] h-[15px]" />
                      )}{" "}
                      USD
                    </p>
                  </div>

                  <div className="ms-auto">
                    <h3 className="font-lilita text-base sm:text-lg md:text-xl lg:text-base">
                      Next Claim Countdown
                    </h3>
                    <p className="font-lato text-sm sm:text-base md:text-lg lg:text-base text-green-500 flex gap-2 mt-1">
                      {!isLoadingUnpaidEarning ? (
                        <Timer duration={value} /> || "0"
                      ) : (
                        <Skeleton className="w-[50px] h-[15px]" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col px-10 py-6 md:px-8 mx-1 md:py-8 bg-white rounded-xl
                    dark:bg-opacity-10 backdrop-blur-sm card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
              >
                <h3 className="font-lilita text-base sm:text-lg md:text-xl mb-4">
                  Your Assets
                </h3>
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                  <div
                    className="bg-gray-300 rounded-xl
                    dark:bg-opacity-10 backdrop-blur-sm p-6 card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
                  >
                    <h4 className="text-green-500 font-lato flex gap-2">
                      {!isLoadingShares ? (
                        totalRealised.toFixed(4) || "0"
                      ) : (
                        <Skeleton className="w-[50px] h-[15px]" />
                      )}{" "}
                      USDT
                    </h4>
                    <p className=" font-lato">Your Claimed Reward</p>
                  </div>
                  <div
                    className="bg-gray-300 rounded-xl
                    dark:bg-opacity-10 backdrop-blur-sm p-6 card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
                  >
                    <h4 className="text-green-500 font-lato flex gap-2">
                      {!isLoadingTknBal && !isLoadingContract ? (
                        balanceOfAddr?.toFixed(2).toString() || "0"
                      ) : (
                        <Skeleton className="w-[50px] h-[15px] rounded-full" />
                      )}{" "}
                      HPT
                    </h4>
                    <p className="text-green-500 flex gap-1">
                      {" "}
                      Value:{" "}
                      {!isLoadingTknBal && !isLoadingContract ? (
                        getAmount.toFixed(4) || "0"
                      ) : (
                        <Skeleton className="w-[50px] h-[15px] rounded-full" />
                      )}{" "}
                      USD
                    </p>
                    <p>Your HPT Balance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-[20%]">
              <h2 className="font-lilita text-2xl sm:text-3xl md:text-4xl mb-4">
                Welcome{" "}
                <span className="text-green-500">
                  {address.substring(0, 5)}
                </span>
                !
              </h2>
              <h3 className="text-green-500 font-bold uppercase">
                How it works?
              </h3>
              <p>
                You could claim your reward by clicking the claim button or wait
                till your reward is auto distributed by the reward distibutor
                smart contract.
              </p>

              <p className="mt-5">
                Remember to verify your transactions before confirming any of
                the functions in our Dapp.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If an address is not yet connected
  return (
    <div className="py-20 lg:mb-32">
      <div className="flex gap-x-4">
        <div className="w-[20%]">
          <Sidebar>
            <SidebarItem
              icon={<TbMoneybag size={20} />}
              text="claim Reward"
              active
              alert={true}
            />
            <SidebarItem
              icon={<GoShareAndroid size={20} />}
              text="Revenue Share (Coming Soon!)"
              active
              alert={false}
            />

            <div className="mt-10">
              <SidebarItem
                icon={<MdPriceCheck size={20} />}
                text={`Token Price: $${
                  !isLoadingContract ? (
                    getPrice.toFixed(11) || "0"
                  ) : (
                    <Skeleton className="w-[50px] h-[15px]" />
                  )
                }`}
                active
                alert={false}
              />
            </div>
          </Sidebar>
        </div>
        <div className="flex flex-col-reverse lg:flex-row pt-10 pl-16 pr-10 gap-4 lg:pt-16 lg:gap-x-12">
          <div className="flex-grow ">
            <div className="flex-grow mt-6 sm:mt-0 ">
              <div>
                <h1 className="font-lilita text-2xl sm:text-3xl md:text-4xl mb-4">
                  Dashboard
                </h1>
              </div>
              {/* <h2 className="font-lato text-lg sm:text-xl md:text-2xl mb-4 text-green-500">
              Current Apy: 0%
            </h2> */}
              <div className="flex justify-end mb-6">
                <div className="flex items-start">
                  <Link href={""}>
                    <button
                      className="bg-green-500 text-white p-2 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg"
                      disabled={true}
                    >
                      <p className="font-lilita text-sm md:text-lg">
                        Claim reward
                      </p>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col px-4 md:px-8 py-6 mx-1 md:py-8 bg-white rounded-xl
                dark:bg-opacity-10 backdrop-blur-sm mb-6 card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
            >
              <h3 className="font-lilita text-base sm:text-lg md:text-xl">
                Your Unclaimed Reward
              </h3>
              <Skeleton className="w-[100px] h-[20px]" />
              {/* <p className="font-lato text-sm sm:text-base md:text-lg text-green-500">
                Value: 0 USD
              </p> */}
            </div>
            <div
              className="flex flex-col px-10 py-6 md:px-8 mx-1 md:py-8 bg-white rounded-xl
                dark:bg-opacity-10 backdrop-blur-sm card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
            >
              <h3 className="font-lilita text-base sm:text-lg md:text-xl mb-4">
                Your Assets
              </h3>
              <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div
                  className="bg-gray-300 rounded-xl
                dark:bg-opacity-10 backdrop-blur-sm p-6 card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
                >
                  <Skeleton className="w-[100px] h-[20px]" />
                  {/* <h4 className="text-green-500 font-lato">0 USDT</h4> */}
                  <p className=" font-lato">Your Claimed Reward</p>
                </div>
                <div
                  className="bg-gray-300 rounded-xl
                dark:bg-opacity-10 backdrop-blur-sm p-6 card-shadows border border-t border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
                >
                  <Skeleton className="w-[100px] h-[20px] mb-1" />
                  <Skeleton className="w-[100px] h-[20px] mb-1" />
                  {/* <h4 className="text-green-500 font-lato">0 HPT</h4> */}
                  {/* <p className="text-green-500"> Value: 0 USD</p> */}
                  <p>Your HPT Balance</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[20%]">
            <h2 className="font-lilita text-2xl sm:text-3xl md:text-4xl mb-4">
              Welcome User!
            </h2>
            <h3 className="text-[yellow] font-bold uppercase">
              Connection Alert!
            </h3>
            <p>
              Connect your wallet to the Dapp to view your assets and to claim
              your reward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
