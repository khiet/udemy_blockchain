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
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);

  res.json({note: `Transaction will be added in block ${blockIndex}.`});
});

app.post('/transaction/broadcast', function (req, res) {
  const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach(function (networkNodeUrl) {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(
    requestPromises
  ).then(function (data) {
    res.json({note: 'Transaction created and broadcast successfully.'});
  });
});

app.post('/receive-newe-block', function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock.index + 1 === newBlock.index;

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];

    res.json({
      note: 'New block received and accepted.',
      newBlock: newBlock
    });
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock: newBlock
    });
  }
});

app.get('/mine', function (req, res) {
  // proof of work
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  // any data can fit in here, no idea why 'index' needs to be recorded
  const currentBlockData = {
    index: lastBlock['index'] + 1,
    transactions: bitcoin.pendingTransactions
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)

  const requestPromises = [];
  bitcoin.networkNodes.forEach(function (networkNodeUrl) {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-newe-block',
      method: 'POST',
      body: {newBlock: newBlock},
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(
    requestPromises
  ).then(function (data) {

    // reward the miner
    const requestOptions = {
      url: bitcoin.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body: {
        amount: 12.5,
        sender: "00",
        recipient: nodeAddress
      },
      json: true
    };

    return rp(requestOptions);
  }).then(function (dta) {
    res.json({
      note: "New block mined & broadcast successfully.",
      block: newBlock
    });
  });
});

app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  const regNodesPromises = [];
  bitcoin.networkNodes.forEach(function (networkNodeUrl) {
    const registerOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: {newNodeUrl: newNodeUrl},
      json: true
    };

    regNodesPromises.push(rp(registerOptions));
  });

  Promise.all(
    regNodesPromises
  ).then(function (data) {
    const bulkRegisterOptions = {
      uri: newNodeUrl + '/register-nodes-bulk',
      method: 'POST',
      body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
      json: true
    };

    return rp(bulkRegisterOptions);
  }).then(function (data) {
    res.json({note: "New node registered with netowrk successfully."});
  });
});

app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1 && bitcoin.currentNodeUrl !== newNodeUrl) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  res.json({note: "New node registered successfully."});
});

app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(function (networkNodeUrl) {
    if (bitcoin.networkNodes.indexOf(networkNodeUrl) === -1 && bitcoin.currentNodeUrl !== networkNodeUrl) {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });

  res.json({note: "Bulk registration successful."});
});

app.get('/consensus', function (req, res) {
  const requestPromises = [];
  bitcoin.networkNodes.forEach(function (networkNodeUrl) {
    const requestOptions = {
      url: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(
    requestPromises
  ).then(function (blockchains) {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(function (blockchain) {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (newLongestChain && bitcoin.chainIsValid(newLongestChain)) {
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: 'This chain has been replaced.',
        chain: bitcoin.chain
      });
    } else {
      res.json({
        note: 'Current chain has not been replaced.',
        chain: bitcoin.chain
      });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
