import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";
import landContractAbi from "../abi/LandContract.json";
import { landContractAddress } from "../contracts";

const landContractInterface = new ethers.utils.Interface(landContractAbi);
const contract = new Contract(landContractAddress, landContractInterface);

export function GetTotalSupply() {
  const [totalSupply]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "totalSupply",
      args: [],
    }) ?? [];
  return totalSupply;
}

export function GetTokenByIndex(index: any) {
  const [tokenID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "tokenByIndex",
      args: [index],
    }) ?? [];
  return tokenID;
}

export function GetBalanceOf(owner: any) {
  const [balance]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "balanceOf",
      args: [owner],
    }) ?? [];
  return balance;
}

export function GetOwnerOf(tokenID: any) {
  const [owner]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "landOwnerOf",
      args: [tokenID],
    }) ?? [];
  return owner;
}

export function GetTokenOfOwnerByIndex(owner: any, index: any) {
  const [tokenID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "tokenOfOwnerByIndex",
      args: [owner, index],
    }) ?? [];
  return tokenID;
}

export function IsPausedClaimingLand() {
  const [isPaused]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "isPausedClaimingLand",
      args: [],
    }) ?? [];
  return isPaused;
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
  const [collectionID]: any =
    useContractCall({
      abi: landContractInterface,
      address: landContractAddress,
      method: "collectionIDAt",
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
