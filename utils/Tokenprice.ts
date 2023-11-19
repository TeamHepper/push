// import HeppertokenAbi from "../constant/abi/TOKEN.json";
import HeppertokenAbi from "../constant/abi/USDT_BSC.json";
import pancakeSwapAbi from "../constant/abi/ROUTER.json";
import { ethers } from "ethers";
import {
  MainnetRouterContract,
  routerContract,
  REWARD_Token_Contract,
  WBNB_Token_Contract,
  HPT_Token_Contract,
  WBNB_Token_Contract_MAINNET,
  MAINNET_RPC_URL,
  RPC_URL,
  usdtAddr,
  HPT_Token_Contract_MAINNET,
} from "../constant/Address";

const pancakeSwapContractMainnet = MainnetRouterContract.toLowerCase();
const MainHepperToken = HPT_Token_Contract_MAINNET;
const MainnetUrl = MAINNET_RPC_URL;
const BNBMainnetTokenAddress = WBNB_Token_Contract_MAINNET; //BNB
const USDMainnetTokenAddress = usdtAddr; //USDT
const bnbToSell = ethers.utils.parseEther("1");

export async function calcSell(tokensToSell: any) {
  const provider = new ethers.providers.JsonRpcProvider(MainnetUrl);

  const tokenRouter = new ethers.Contract(
    MainHepperToken,
    HeppertokenAbi,
    provider
  );

  let tokenDecimals = await tokenRouter.decimals();

  tokensToSell = setDecimals(tokensToSell, tokenDecimals);
  let amountOut;
  try {
    let router = new ethers.Contract(
      pancakeSwapContractMainnet,
      pancakeSwapAbi,
      provider
    );
    amountOut = await router.getAmountsOut(tokensToSell, [
      MainHepperToken,
      BNBMainnetTokenAddress,
    ]);
    amountOut = ethers.utils.formatEther(amountOut[1]);
  } catch (error) {}

  if (!amountOut) return 0;
  return amountOut;
}

export async function calcBNBPrice() {
  let amountOut;
  try {
    const provider = new ethers.providers.JsonRpcProvider(MainnetUrl);

    const router = new ethers.Contract(
      pancakeSwapContractMainnet,
      pancakeSwapAbi,
      provider
    );
    amountOut = await router.getAmountsOut(bnbToSell, [
      BNBMainnetTokenAddress,
      USDMainnetTokenAddress,
    ]);
    amountOut = ethers.utils.formatEther(amountOut[1]);
  } catch (error) {}
  if (!amountOut) return 0;
  return amountOut;
}

export async function holderBalance(address: any) {
  const provider = new ethers.providers.JsonRpcProvider(MainnetUrl);
  const tokenRouter = new ethers.Contract(
    MainHepperToken,
    HeppertokenAbi,
    provider
  );

  const tokenBalance = await tokenRouter.balanceOf(address);
  const tknBal = tokenBalance.toString();

  return tknBal;
}

export function setDecimals(number: string, decimals: number) {
  number = number.toString();
  let numberAbs = number.split(".")[0];
  let numberDecimals = number.split(".")[1] ? number.split(".")[1] : "";
  while (numberDecimals.length < decimals) {
    numberDecimals += "0";
  }
  return numberAbs + numberDecimals;
}
