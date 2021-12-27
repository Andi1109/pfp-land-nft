import axios from "axios";

const apiServer = "http://localhost:3001/api";
const claimedLandURL = apiServer + "/claimedlands";
const royalLandURL = apiServer + "/royalLands";

export async function getRoyalDerivePair() {
  let pairsJson;
  await fetch("./pair.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      pairsJson = data;
    })
    .catch(function (err) {
      console.log(err, " error");
    });
  return pairsJson;
}

export async function getClaimedLands() {
  let claimedLandsJson = {
    claimed: [],
  };
  await fetch(claimedLandURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      claimedLandsJson = data;
    })
    .catch(function (err) {
      console.log(err, " error");
    });
  return claimedLandsJson.claimed;
}

export async function setClaimedLand(x, y) {
  await axios
    .post(claimedLandURL, { claimedLand: { x, y } })
    .then((res) => {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err, " error");
    });
  return;
}

export async function getRoyalLands() {
  let royalLandsJson = {
    royalLands: [],
  };
  await fetch(royalLandURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      royalLandsJson = data;
    })
    .catch(function (err) {
      console.log(err, " error");
    });
  return royalLandsJson.royalLands;
}
