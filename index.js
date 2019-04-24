const express = require('express')
const app = express()
const port = 3000
const rp = require('request-promise');
const Ont = require('ontology-ts-sdk');

const {
  Crypto,
  Parameter,
  ParameterType,
  TransactionBuilder,
  Transaction,
  RpcClient,
  utils,
} = Ont;

const node = 'http://dappnode1.ont.io:20336/';

const client = new RpcClient(node);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  getBlockHeights();
})

app.get('/getTotalTransactionCount', (req, res) => {
  getTransactionCount(timePeriod, (result) => {
    const str = JSON.stringify(result);
    res.status(200).send(str);
  });
})

function getTransactionCount(timePeriod) {
  // 90 days

  // Step 1. Get blockheights for past hour
  const blockHeights = getBlockHeights();

  // Step 2. Loop through each block from step 1 and get the total number of transactions
  // Use promise.all() to call all of these at once

  // Step 3. Return the total number of tansactions

  return 99
}

function isValidHeight(height) {
  return new Promise((resolve, reject) => {
    client.getBlockJson(height)
      .then((res) => {
        console.log(res); // Info on the current block

        // We want the time of the current blockheight
        const timestamp = res.result.Timestamp; // HERE
        if (timestamp > 0){
            resolve(res.result.Transactions.length);
        } else {
            resolve(null);
        } // TODO: Check that the timestamp is within the range 1 hour in unix time
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getBlockHeights() {
  return new Promise((resolve, reject) => {
    // Step 1. Get the current block height
    client.getBlockHeight()
      .then(async (height) => {

        //Step 2. Get the time of the current block
        console.log(height); // Current block height
        let stop = false;
        let total = 0;
        while (!stop) {
          const count = await isValidHeight(height);
          if (count != null) {
            total += count;
          } else {
            stop = true;
          }
          height -= 1;
        }
        resolve(total);
      })
      .catch((err) => {
        reject(err);
      });
  });

  //Step 3. Get the lowest blockheight in the time period
  //Step 4. Return array with all of the block heights

}
