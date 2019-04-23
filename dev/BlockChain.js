const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function BlockChain() {
    this.chain = [];
    this.pendingTransactions = [];

    //Creating starting block of the chain.

    this.currentNodeUrl = currentNodeUrl;
    this.networKNodes = [];

    this.createNewBlock(100, '0', '0');
}

//TODO finish this course
//nonce: is just a number

BlockChain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = [];

    //Push our new block to the chain.
    this.chain.push(newBlock);

    //Return just created block.
    return newBlock;
};

//We want to make sure that very block that is added to the chain is legitimate and it has the correct transactions and the correct data inside of it.
//Because if it doesn't have the correct transactions in the correct data then people could fake how much bitcoin they have and steal money from other people.

BlockChain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData);

    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
};

BlockChain.prototype.createNewTransaction = function (amount, sender, recipient) {
    return {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    };
};


BlockChain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
};

BlockChain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    //Concatenating the data into one string.

    const dataAsString =
        previousBlockHash +
        nonce +
        JSON.stringify(currentBlockData);

    return sha256(dataAsString);
};

BlockChain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};

BlockChain.prototype.chainIsValid = function(blockChain){
    let validChain = true;

    for(let i = 1; i < blockChain.length; i++){
        const currentBlock = blockChain[i];
        const previousBlock = blockChain[i - 1];
        const blockHash = this.hashBlock(previousBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce']);

        if(blockHash.substring(0, 4) !== '0000') validChain = false;

        if(currentBlock['previousBlockHash'] !== previousBlock['hash']) validChain = false; //If chain is not valid

        // Just for testing
        /*
            console.log('currentBlockHash => ', previousBlock['hash']);
            console.log('previousBlockHash => ', currentBlock['hash']);
        */
    }

    const genesisBlock = blockChain[0];
    const correctNonce  =  genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash  =  genesisBlock['previousBlockHash'] === '0';
    const correctHash  = genesisBlock['hash'] = '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

    return validChain;
};

BlockChain.prototype.getBlock = function(blockHash){
    let correctBlock = null;

    this.chain.forEach(block =>{
        if(block.hash === blockHash) correctBlock = block;
    });

    return correctBlock;
};

BlockChain.prototype.getTransaction = function(transactionId){
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block =>{
        block.transactions.forEach(transaction => {
            if(transaction.transactionId === transactionId){
                correctTransaction = transaction;
                correctBlock = block;
            }
        });
    });

    return {
        transaction: correctTransaction,
        block:  correctBlock
    }
};


BlockChain.prototype.getAddressData = function(address){
    const balance = this.getAddressBalance(address);
    const addressTransactions = this.getAddressTransactions(address);

    return {
        addressTransactions: addressTransactions,
        balance: balance
    };
};

BlockChain.prototype.getAddressTransactions = function(address){
    const addressTransactions = [];

    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.sender === address || transaction.recipient === address) addressTransactions.push(transaction);
        });
    });

    return addressTransactions;
};

BlockChain.prototype.getAddressBalance = function(address){
    let balance = 0;

    this.chain.forEach(block => {
       block.transactions.forEach(transaction => {
           if(transaction.recipient === address) balance += transaction.amount;
           else if(transaction.sender === address) balance -= transaction.amount;
       });
    });

    return balance;
};

module.exports = BlockChain;