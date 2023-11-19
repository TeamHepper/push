"use Client";
import React, {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { calcSell, calcBNBPrice, holderBalance, } from "../utils/Tokenprice";
import {
  useAddress,
  useContract,
  useContractRead,
  useTokenBalance,
  useTokenSupply,
} from "@thirdweb-dev/react";
import usdtArtifact from "../constant/abi/USDT_BSC.json";
import distributorArtifact from "../constant/abi/DISTRIBUTOR.json";
import { ethers } from "ethers";
import {
  REWARD_Token_Contract,
  DEADWALLET,
  usdtAddr,
  RPC_URL,
  distributorContract,
  HPT_Token_Contract_MAINNET,
} from "../constant/Address";
import hepper from "../../../../../public/images/hepper_bg_heropng.png";
import hepperT from "../../../../../public/images/Hepper Token [png].jpg";
import { Skeleton } from "@/components/ui/skeleton";

function add(a: number, b: number, c: number) {
  return a + b + c;
}

function divide(a: number, b: number) {
  return a / b;
}

function marketcapSupply(a: number, b: number) {
  return a * b;
}

const Intro = () => {
  const address = useAddress();
  const [getPrice, setGetPrice] = useState(0);
  const [getMCPrice, setGetMCPrice] = useState(0);
  const [getCirPrice, setGetCirPrice] = useState(0);
  const {
    data: tokenAddr,
    isLoading: isLoadingContract,
    error: errorHPT,
  } = useContract(HPT_Token_Contract_MAINNET, "token");
  const { data: REWARD_CA, isLoading: isLoadingReward } = useContract(
    REWARD_Token_Contract,
    "custom"
  );
  const { data: distributorCa, isLoading: isLoadingDistributorCa } =
    useContract(distributorContract, "custom");

  const { data, isLoading: isLoadingName } = useContractRead(tokenAddr, "name");
  const { data: getTotalDistributed, isLoading: isLoadingtotalDistr } =
    useContractRead(distributorCa, "totalDistributed");
  const btb = divide.apply(undefined, [
    getTotalDistributed?.toString(),
    10 ** 18,
  ]);

  // const { data: tokenBalance, isLoading: isLoadingTokenBalance, error } = useTokenBalance(tokenAddr, "0xA27B89672557472BAD3c1859E25BA2086cCb0dBc");
  const {
    data: deadBalance,
    isLoading: isLoadingdeadBalance,
    error: errordead,
  } = useTokenBalance(tokenAddr, DEADWALLET);
  const {
    data: totalSupply,
    isLoading: isLoadingTs,
    error: errorTS,
  } = useTokenSupply(tokenAddr);

  useEffect(() => {
    const price = async () => {
      try {
        const bnbPrice = await calcBNBPrice() // query pancakeswap to get the price of BNB in USDT

        // console.log(`CURRENT BNB PRICE (TokenPrice): ${bnbPrice}`);

        const tokens_to_sell = 1;
        const calcMarketCap = 1000000;
        const calcCirculation = 800000

        const priceInBnb = await calcSell(tokens_to_sell); // calculate TOKEN price in BNB
        // const MCpriceInBnb = await calcSell(calcMarketCap); // calculate TOKEN price in BNB

        // holderBalance(800000);

        const priceInUSD = (priceInBnb * bnbPrice);
        const MCpriceInUSD = marketcapSupply.apply(undefined, [ calcMarketCap, priceInUSD]);
        const CirpriceInUSD = marketcapSupply.apply(undefined, [ calcCirculation, priceInUSD]);
        setGetMCPrice(MCpriceInUSD);
        setGetCirPrice(CirpriceInUSD);
        setGetPrice(priceInUSD);
        // console.log(priceInUSD, "price In USD (Token Price)")

        // console.log('SHIT_TOKEN VALUE IN BNB : ' + priceInBnb + ' | Just convert it to USD (Token Price)');
        // console.log(`SHIT_TOKEN VALUE IN USD (Token Price): ${priceInBnb * bnbPrice}`);
      } catch (err) { }
    }

    price()
  }, [])


  return (
    <div className="py-32 px-6 sm:px-12 max-w-screen-xl lg:mx-auto mb-10">
      <div className="">
        {/* <div className="">
                    <Image src={hepper} alt='' />
                </div> */}
        <div className="grid md:grid-cols-1 gap-8">
          <div className="justify-center items-center">
            {/* <div className='hidden md:flex w-[5rem] h-[5rem]'>
                            <Image src={hepperT} alt='' />
                        </div> */}
            <div>
              <h1 className="font-lilita text-2xl sm:text-3xl mb-4">
                Welcome to Hepper Token Reward Dashboard
              </h1>
              <p className="font-lato text-base sm:text-lg md:text-xl mb-4">
                Get Rewarded in USDT for holding HPT.
              </p>
              <Link href="/" className={buttonVariants({ variant: "welcome" })}>
                Enter App
              </Link>
            </div>
          </div>
          <div
            className="px-10 py-12 md:py-6 mx-1 bg-white card-shadows dark:bg-opacity-10
       backdrop-filter backdrop-blur-sm rounded-xl border-t-[1px]
        border-t-[rgba(255,255,255,0.5)] border-l-[1px] border-l-[rgba(255,255,255,0.5)]"
          >
            <div>
              <h2 className="font-lilita text-xl sm:text-2xl"> <span className="text-green-500">HPT Price</span>:
              <span className="text-green-500 dark:text-[gold]"> $</span>{!isLoadingContract ? getPrice.toFixed(8) || "0" : <Skeleton className="w-[50px] h-[15px]" />}
              </h2>
            </div>
            <div className="mt-5">
              <h3 className="font-lato font-semibold mb-2 text-green-500">REWARD INFO</h3>
              <h3>
                Total Reward Claimed:{" "}
                {!isLoadingReward && !isLoadingtotalDistr ? (
                  btb.toFixed(2) || "0"
                ) : (
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                )}{" "}
                <span className="text-green-500 dark:text-[gold]">USD</span>
              </h3>
            </div>
            <div className="mt-5">
              <h3 className="font-lato font-semibold mb-2 text-green-500">PROJECT INFO</h3>
              <h3 className="mb-2">
                Total Supply:{" "}
                {!isLoadingContract && !isLoadingTs ? (
                  totalSupply?.displayValue || "0"
                ) : (
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                )}{" "}
               <span className="text-green-500 dark:text-[gold]"> {totalSupply?.symbol}</span>
              </h3>

              <h3 className="mb-2">
                HPT Burnt:{" "}
                {!isLoadingContract && !isLoadingdeadBalance ? (
                  deadBalance?.displayValue
                ) : (
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                )}{" "}
                <span className="text-green-500 dark:text-[gold]">HPT</span>
              </h3>

              <p className="mb-2">Market Cap: {getMCPrice.toFixed(2)} <span className="text-green-500 dark:text-[gold]">USD</span></p>
              <p className="mb-2">Circulating Supply: 800,000 <span className="text-green-500 dark:text-[gold]">HPT</span> ({getCirPrice.toFixed(2)} <span className="text-green-500 dark:text-[gold]">USD</span>)</p>
              {/* <p>Estimated Trading Volume (24Hrs): USD</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
