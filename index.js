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
})

app.get('/', (req, res) => {
  res.status(200).send('Loaded');
});

app.get('/getTransactionCount', (req, res) => {
  const hours = req.query.hours;
  getTransactionCount(hours)
    .then((result) => {
      const str = JSON.stringify(result);
      res.status(200).send(str);
    })
    .catch((err) => {
      const str = JSON.stringify(err);
      res.status(400).send(str);
    });
});

function getTransactionsForBlock(height, hours) {
  return new Promise((resolve) => {
    client.getBlockJson(height)
      .then((res) => {
        // We want the time of the current blockheight
        const timestamp = res.result.Header.Timestamp; // HERE
        console.log(timestamp);
        if (timestamp > 1556142602){
            resolve(res.result.Transactions.length);
        } else {
            resolve(null);
        } // TODO: Check that the timestamp is within the range 1 hour in unix time
      })
      .catch((err) => {
        console.error(err);
        resolve(null);
      });
  });
}

//TODO: resolve(total) based on the hours
function getTransactionCount(hours) {
  return new Promise((resolve, reject) => {
    // Step 1. Get the current block height
    client.getBlockHeight()
      .then(async (height) => {

        //Step 2. Get the time of the current block
        console.log(height); // Current block height
        let stop = false;
        let total = 0;
        let h = height;
        while (!stop) {
          const count = await getTransactionsForBlock(h, hours);
          if (count != null) {
            total += count;
            console.log(`Total: ${total}`);
          } else {
            stop = true;
            console.log(`Stopping with total: ${total}`);
          }
          h -= 1;
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
