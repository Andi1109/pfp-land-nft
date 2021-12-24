const apiServer = "http://localhost:3001/api";

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
  let claimedLandsJson = [
    { x: 30, y: 41 },
    { x: 29, y: 41 },
    { x: 50, y: 50 },
    { x: 50, y: 49 },
  ];
  await fetch(apiServer)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      claimedLandsJson = data;
    })
    .catch(function (err) {
      console.log(err, " error");
    });
  return claimedLandsJson;
}

export async function getRoyalLands() {
  let royalLandsJson = [
    {
      x: 50,
      y: 50,
      src: "https://gateway.pinata.cloud/ipfs/QmUjzbAh47BX9RgC8eLmCGQZoYpLVYfvtz2Yj1GEQqsTNs",
      derivative: "1",
    },
    {
      x: 50,
      y: 49,
      src: "https://gateway.pinata.cloud/ipfs/QmUjzbAh47BX9RgC8eLmCGQZoYpLVYfvtz2Yj1GEQqsTNs",
      derivative: "0",
    },
  ];
  await fetch(apiServer)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      royalLandsJson = data;
    })
    .catch(function (err) {
      console.log(err, " error");
    });
  return royalLandsJson;
}
