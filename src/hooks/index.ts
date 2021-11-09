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
  const [decodedX, decodedY]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "getLandOfByIndex",
      args: [owner, index],
    }) ?? [];
  const decodeObj = { decodedX, decodedY };
  return decodeObj;
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

export function GetTotalRoyalBalanceOf(owner: any, collectionID: any) {
  const [balance]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "totalRoyalBalanceOf",
      args: [owner, collectionID],
    }) ?? [];
  return balance;
}

export function GetRoyalTokenOfOwnerByIndex(
  owner: any,
  index: any,
  collectionID: any
) {
  const [newCollectionID, tokenID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "royalTokenOfOwnerByIndex",
      args: [owner, index, collectionID],
    }) ?? [];
  const royalObj = { newCollectionID, tokenID };
  return royalObj;
}

export function GetTotalDerivativeBalance(assetID: any) {
  const [balance]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "landDerivativeBalance",
      args: [assetID],
    }) ?? [];
  return balance;
}

export function GetDerivativeByIndex(assetID: any, index: any) {
  const [collectionAddress, tokenID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "landDerivativeMetadataOf",
      args: [assetID, index],
    }) ?? [];
  const derivativeObj = { collectionAddress, tokenID };
  return derivativeObj;
}

export function GetCollectionIDByAddress(collectionAddress: any) {
  const [collectionID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "collectionIndicesByAddress",
      args: [collectionAddress, 0],
    }) ?? [];
  return collectionID;
}

export function GetLandMetaData(collectionID: any, tokenID: any) {
  const [tokenURI]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "getLandMetaData",
      args: [collectionID, tokenID],
    }) ?? [];
  return tokenURI;
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
