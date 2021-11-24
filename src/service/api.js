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
