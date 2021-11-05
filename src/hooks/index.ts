import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";
import landContractAbi from "../abi/LandContract.json";
import { landContractAddress } from "../contracts";

const landContractInterface = new ethers.utils.Interface(landContractAbi);
const contract = new Contract(landContractAddress, landContractInterface);

export function GetTotalLands() {
  const [totalLands]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "totalLands",
      args: [],
    }) ?? [];
  return totalLands;
}

export function GetLandsByIndex(index: any) {
  const [landX, landY]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "landByIndex",
      args: [index],
    }) ?? [];
  const land = { landX, landY };
  return land;
}

export function GetMyTotalLands(owner: any) {
  const [myTotalLands]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "claimedLandBalanceOf",
      args: [owner],
    }) ?? [];
  return myTotalLands;
}

export function GetMyLandsByIndex(owner: any, index: any) {
  const [assetID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "getLandOfByIndex",
      args: [owner, index],
    }) ?? [];
  return assetID;
}

export function GetLandOwnerOf(assetID: any) {
  const [owner]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "landOwnerOf",
      args: [assetID],
    }) ?? [];
  return owner;
}

export function GetRoyalMetaDataOfLand(assetID: any) {
  const [collectionID, tokenID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "landRoyalMetadataOf",
      args: [assetID],
    }) ?? [];
  const metadata = { collectionID, tokenID };
  return metadata;
}

export function GetMetaDataAtCollection(collectionID: any, tokenID: any) {
  const [metadata]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "getLandMetaData",
      args: [collectionID, tokenID],
    }) ?? [];
  return metadata;
}

export function CollectionIDAt(landX: any, landY: any) {
  const [collectionID, owner]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "collectionIDAndClaimerAt",
      args: [landX, landY],
    }) ?? [];
  return collectionID;
}

export function EncodeTokenID(landX: any, landY: any) {
  const [assetID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "_encodeTokenId",
      args: [landX, landY],
    }) ?? [];
  return assetID;
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
  return decodedObj;
}

export function useContractMethod(methodName: string) {
  // @ts-ignore
  const { state, send } = useContractFunction(contract, methodName, {});
  return { state, send };
}
