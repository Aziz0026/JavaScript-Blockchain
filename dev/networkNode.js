const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const BlockChain = require('./BlockChain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');

const bitCoin = new BlockChain();

//Don't forget the brackets "json()" otherwise it won't work.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function (req, res) {
    res.send(bitCoin);
});

app.post('/transaction', function (req, res) {
    const newTransaction = req.body;
    const blockIndex = bitCoin.addTransactionToPendingTransactions(newTransaction);
    res.json({note: "Transaction will be added in block " + blockIndex + " ."});
});

app.post('/transaction/broadcast', function (req, res) {
    const senderAddress = req.body.sender;
    const amount = req.body.amount;
    const recipient = req.body.recipient;

    if(senderAddress === '00' || bitCoin.getAddressBalance(senderAddress) >= amount){
        const newTransaction = bitCoin.createNewTransaction(
            amount,
            senderAddress,
            recipient
        );

        bitCoin.addTransactionToPendingTransactions(newTransaction);

        const requestPromises = [];
        bitCoin.networKNodes.forEach(networkNodeUrl => {
            const requestOptions = {
                uri: networkNodeUrl + '/transaction',
                method: 'POST',
                body: newTransaction,
                json: true
            };

            requestPromises.push(rp(requestOptions));
        });

        Promise.all(requestPromises).then(data => {
            res.json({note: 'Transaction created and broadcast successfully.'});
        });
    }else{
        res.json({
            note: 'Sender have no enough money.'
        });
    }
});

app.get('/mine', function (req, res) {
    const lastBlock = bitCoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];

    const currentBlockData = {
        transactions: bitCoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    const nonce = bitCoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitCoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    bitCoin.createNewTransaction(12.5, '00', nodeAddress);

    const newBlock = bitCoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
    bitCoin.networKNodes.forEach(networkNodeUrl => {
       const requestOptions = {
           uri: networkNodeUrl + '/receive-new-block',
           method: 'POST',
           body: {newBlock: newBlock},
           json: true
       };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises).then(
        data => {
            const requestOptions = {
                uri: bitCoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true
            };

            return rp(requestOptions)
        }
    ).then(data =>{
        res.json({
            note: "New block mined successfully,",
            block: newBlock
        });
    });
 });

//  register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;

    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitCoin.networKNodes.indexOf(networkNodeUrl) === -1;
        const notCurrentNode = bitCoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) bitCoin.networKNodes.push(networkNodeUrl);
    });

    res.json({note: "Bulk registration successfully."});
});

//This method is just for testing.
app.get('/register-and-broadcast-nodes', function(req, res){
    const promises = [];

    const allNodesUrl = [
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004'
    ];

    allNodesUrl.forEach(nodeUrl => {
        const requestOptions = {
            uri: 'http://localhost:3001/register-and-broadcast-node',
            method: 'POST',
            body: {newNodeUrl: nodeUrl},
            json: true
        };

        promises.push(rp(requestOptions));
    });

    Promise.all(promises).then(res.json({note: 'All nodes are registered in the network.'}));
});

// New node
// Register a node and broadcast it the network
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;

    if (bitCoin.networKNodes.indexOf(newNodeUrl) === -1) {
        bitCoin.networKNodes.push(newNodeUrl);
    }

    const regNodesPromises = [];

    bitCoin.networKNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl},
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: {allNetworkNodes: [...bitCoin.networKNodes, bitCoin.currentNodeUrl]},
                json: true
            };

            return rp(bulkRegisterOptions);
        })

        .then(data => {
            res.json({note: 'New node registered with network successfully.'});
        });
});

// Accepting new nodes when they are connecting
// Register a node with the network
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeAlreadyPresent = bitCoin.networKNodes.indexOf(newNodeUrl) === -1;
    const notCurrentNode = bitCoin.currentNodeUrl !== newNodeUrl;

    if (nodeAlreadyPresent && notCurrentNode) bitCoin.networKNodes.push(newNodeUrl);

    res.json({
        note: 'New node registered & broadcast successfully.'
    });
});

app.post('/receive-new-block', function(req, res){
    const newBlock =  req.body.newBlock;
    const lastBlock = bitCoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    //Response message for user
    let message = 'New block received and accepted.';

    if (correctHash && correctIndex){
        bitCoin.chain.push(newBlock);
        bitCoin.pendingTransactions = [];
    }else{
        message = 'New block rejected.';
    }

    res.json({
        note: message,
        newBlock: newBlock
    });
});

app.get('/consensus', function(req, res){
    const requestPromises = [];

    bitCoin.networKNodes.forEach(networkNodeUrl =>{
       const requestOptions = {
           uri: networkNodeUrl + '/blockchain',
           method: 'GET',
           json: true
       };

       requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises).then(
        blockChains => {
            const currentChainLength = bitCoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockChains.forEach(blockChain => {
                if(blockChain.chain.length > maxChainLength) {
                    maxChainLength = blockChain.chain.length;
                    newLongestChain = blockChain.chain;
                    newPendingTransactions = blockChain.pendingTransactions;
                }
            });

            if(!newLongestChain || (newLongestChain && !bitCoin.chainIsValid(newLongestChain))){
                res.json({
                    note: 'Current chain is not been replaced.',
                    chain: bitCoin.chain
                });
            }else {
                bitCoin.chain = newLongestChain;
                bitCoin.pendingTransactions = newPendingTransactions;

                res.json({
                    note: 'This chain has been replaced.',
                    chain: bitCoin.chain
                });
            }
        });
});

app.get('/block/:blockHash', function (req, res) { // localhost:3001/block/0f0d909a9s0d90s9a9d -> last one is hash
    const blockHash =  req.params.blockHash;
    const correctBlock = bitCoin.getBlock(blockHash);

    res.json({
        block: correctBlock
    });
});

app.get('/transaction/:transactionId', function (req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitCoin.getTransaction(transactionId);

    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
});

app.get('/block-explorer', function(req, res){
    res.sendFile('./block-explorer/index.html', {root: __dirname});
});

app.get('/address/:address', function (req, res) {
    const address = req.params.address;
    const addressData = bitCoin.getAddressData(address);

    res.json({
        addressData: addressData
    });
});

app.get('/balance/:address', function(req, res){
    const address = req.params.address;
    const addressBalance = bitCoin.getAddressBalance(address);

    res.json({
        balance: addressBalance
    });
});

app.listen(port, function () {
    console.log('Listening on port ' + port + '....');
});