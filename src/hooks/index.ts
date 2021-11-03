import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";
import landContractAbi from "../abi/LandContract.json";
import { landContractAddress } from "../contracts";

const landContractInterface = new ethers.utils.Interface(landContractAbi);
const contract = new Contract(landContractAddress, landContractInterface);

export function GetClaimedLandOf(owner: any) {
  const [claimedLand]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "claimedLandBalanceOf",
      args: [owner],
    }) ?? [];
  return claimedLand;
}

export function GetLandOfByIndex(owner: any, index: any) {
  const [encodedLand]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "getLandOfByIndex",
      args: [owner, index],
    }) ?? [];
  return encodedLand;
}

export function DecodeTokenID(encodedTokenID: any) {
  const [decodedX, decodedY]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "_decodeTokenId",
      args: [encodedTokenID],
    }) ?? [];
  const decodedObj = { decodedX, decodedY };
  console.log(decodedObj);
  return decodedObj;
}

export function useIncrement() {
  const { state, send } = useContractFunction(contract, "incrementCount", {});
  return { state, send };
}

export function useSetCount() {
  const { state, send } = useContractFunction(contract, "setCount", {});
  return { state, send };
}

export function useContractMethod(methodName: string) {
  const { state, send } = useContractFunction(contract, methodName, {});
  return { state, send };
}
