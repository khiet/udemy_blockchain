const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid');
const port = process.argv[2];
const rp = require('request-promise');

// each node has a unique ID
const nodeAddress = uuid.v1().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.get('/mine', function (req, res) {
  // proof of work
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  // any data can fit in here, no idea why 'index' needs to be recorded
  const currentBlockData = {
    index: lastBlock['index'] + 1,
    ...bitcoin.pendingTransactions
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

  // reward the miner
  bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)

  res.json({
    note: "New block mined successfully",
    block: newBlock
  });
});

app.post('/register-and-broadcast-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  const regNodesPromises = [];
  bitcoin.networkNodes.forEach(function(networkNodeUrl) {
    const registerOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true
    };

    regNodesPromises.push(rp(registerOptions));
  });

  Promise.all(regNodesPromises)
    .then(function(data) {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then(function(data) {
      res.json({ note: "New node registered with netowrk successfully." });
    });
});

app.post('/register-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1 && bitcoin.currentNodeUrl !== newNodeUrl) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  res.json({ note: "New node registered successfully." });
});

app.post('/register-nodes-bulk', function(req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(function(networkNodeUrl) {
    if (bitcoin.networkNodes.indexOf(networkNodeUrl) === -1 && bitcoin.currentNodeUrl !== networkNodeUrl) {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });

  res.json({ note: "Bulk registration successful." });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});
