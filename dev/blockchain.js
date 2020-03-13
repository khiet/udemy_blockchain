const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash,
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
}

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid.v1().split('-').join('')
  };

  return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transaction) {
  this.pendingTransactions.push(transaction);

  return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
}

Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }
  return nonce;
}

Blockchain.prototype.chainIsValid = function(blockchain) {
  let validChain = true;

  for(let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i-1];
    const blockHash = this.hashBlock(
      currentBlock.previousBlockHash,
      { index: currentBlock.index, transactions: currentBlock.transactions },
      currentBlock.nonce
    );

    if (blockHash.substring(0, 4) !== '0000') {
      validChain = false;
    }

    console.log(currentBlock.previousBlockHash);
    console.log(previousBlock.hash);
    if (currentBlock.previousBlockHash !== previousBlock.hash) {
      validChain = false;
    }
  }

  const genesisBlock = blockchain[0];
  if (!(genesisBlock.nonce === 100 &&
    genesisBlock.previousBlockHash === '0' &&
    genesisBlock.hash === '0' &&
    genesisBlock.transactions.length === 0)) {
    validChain = false;
  }

  return validChain;
}

module.exports = Blockchain;
