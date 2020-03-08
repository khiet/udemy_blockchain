const Bockchain = require('./blockchain');

const bitcoin = new Bockchain();
bitcoin.createNewBlock(1234, 'dummyhash1', 'dummyhash2');
bitcoin.createNewTransaction(100, 'khiet', 'nami');
bitcoin.createNewBlock(1234, 'dummyhash1', 'dummyhash2');
bitcoin.createNewTransaction(200, 'nami', 'keiko');
bitcoin.createNewTransaction(300, 'khiet', 'keiko');
bitcoin.createNewTransaction(400, 'hama', 'nami');
bitcoin.createNewBlock(1234, 'dummyhash1', 'dummyhash2');

console.log(bitcoin);
console.log(bitcoin.getLastBlock()['transactions']);

const hash = bitcoin.hashBlock('dummyhash1', bitcoin.getLastBlock()['transactions'], 1234);
console.log(hash);

const currentBlockData = bitcoin.getLastBlock()['transactions'];
const nonce = bitcoin.proofOfWork('dummyhash1', currentBlockData);
console.log(nonce);

const powHash = bitcoin.hashBlock('dummyhash1', bitcoin.getLastBlock()['transactions'], nonce);
console.log(powHash);