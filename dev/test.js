const Bockchain = require('./blockchain');

const bitcoin = new Bockchain();
bitcoin.createNewTransaction(100, 'khiet', 'nami');
bitcoin.createNewTransaction(200, 'khiet', 'keiko');

// mining
let nonce = bitcoin.proofOfWork(bitcoin.getLastBlock()['hash'], bitcoin.pendingTransactions);
let hash = bitcoin.hashBlock(bitcoin.getLastBlock()['hash'], bitcoin.pendingTransactions, nonce)
// add to blockchain
bitcoin.createNewBlock(nonce, bitcoin.getLastBlock()['hash'], hash)

bitcoin.createNewTransaction(500, 'yoko', 'nami');
bitcoin.createNewTransaction(900, 'nami', 'keiko');

// mining
nonce = bitcoin.proofOfWork(bitcoin.getLastBlock()['hash'], bitcoin.pendingTransactions);
hash = bitcoin.hashBlock(bitcoin.getLastBlock()['hash'], bitcoin.pendingTransactions, nonce)
// add to blockchain
bitcoin.createNewBlock(nonce, bitcoin.getLastBlock()['hash'], hash)

console.log(bitcoin);
console.log(bitcoin.getLastBlock().transactions);