import axios from "axios";

// const apiServer = "http://localhost:3001/api";
const apiServer = "https://api.mypfp.land/api";
const claimedLandURL = apiServer + "/claimedlands";
const royalLandURL = apiServer + "/royalLands";
const derivativeLandURL = apiServer + "/derivativeLands";
const honoraryRoyalURL = apiServer + "/honoraryRoyals";

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
  const hash = await sha256(x + "" + y);
  const headers = { secret: hash };
  await axios
    .post(claimedLandURL, { claimedLand: { x, y } }, { headers: headers })
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

export async function setClaimedRoyal(x, y, src) {
  const hash = await sha256(x + "" + y);
  const headers = { secret: hash };

  await axios
    .post(
      royalLandURL,
      { royalLand: { x, y, src, derivative: "0" } },
      { headers: headers }
    )
    .then((res) => {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err, " error");
    });
  return;
}

export async function setClaimedDerivative(x, y) {
  const hash = await sha256(x + "" + y);
  const headers = { secret: hash };

  await axios
    .post(derivativeLandURL, { derivativeLand: { x, y } }, { headers: headers })
    .then((res) => {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err, " error");
    });
  return;
}

export async function getHonoraryRoyals(owner) {
  let result = [];
  console.log(owner);

  await axios
    .get(honoraryRoyalURL, {
      params: { owner },
    })
    .then((res) => {
      result = res.data.honoraryRoyals;
    })
    .catch(function (err) {
      console.log(err, " error");
      result = [];
    });

  return result;
}

async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
