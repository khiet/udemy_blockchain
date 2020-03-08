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
