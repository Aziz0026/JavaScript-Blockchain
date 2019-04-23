//Connecting the BlockChain.js file.
const BlockChain = require('./BlockChain');

//Creating new instance of the class.
const BitCoin = new BlockChain();

const previousBlockHash = 'JH12K3H1K23H1K2H3';
const currentBlockData = [
    {
        amount: 10,
        sender: 'KJ21HK3K1J2H3',
        recipient: '4JK324HK23H4'
    },
    {
        amount: 20,
        sender: '43K2J4H2K3J4HK23J',
        recipient: '4832Y847Y23H4JH234'
    },
    {
        amount: 30,
        sender: '4H2J4HKJ324K23H',
        recipient: '523482343OI2J4OI4J'
    }
];

const blockChainOne =

{
    "chain": [
    {
        "index": 1,
        "timestamp": 1554630777695,
        "transactions": [],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
    },
    {
        "index": 2,
        "timestamp": 1554630817136,
        "transactions": [],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100", //you can change one of the last characters for testing
        "previousBlockHash": "0"
    },
    {
        "index": 3,
        "timestamp": 1554630897321,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "ec1e6ef0591a11e98d1d21ee0d34ad4f",
                "transactionId": "03a64c50591b11e98d1d21ee0d34ad4f"
            },
            {
                "amount": 10,
                "sender": "Alishan Esengulov",
                "recipient": "Aibek Esengulov",
                "transactionId": "249e6460591b11e98d1d21ee0d34ad4f"
            },
            {
                "amount": 20,
                "sender": "Alishan Esengulov",
                "recipient": "Aibek Esengulov",
                "transactionId": "2a1e03f0591b11e98d1d21ee0d34ad4f"
            },
            {
                "amount": 30,
                "sender": "Alishan Esengulov",
                "recipient": "Aibek Esengulov",
                "transactionId": "2cb2b890591b11e98d1d21ee0d34ad4f"
            }
        ],
        "nonce": 6148,
        "hash": "0000d70b9e0971886258e7cbfa3cfcaf41fed4533656ca4547f2a312c8165c9d",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
        "index": 4,
        "timestamp": 1554630940472,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "ec1e6ef0591a11e98d1d21ee0d34ad4f",
                "transactionId": "336c5ec0591b11e98d1d21ee0d34ad4f"
            },
            {
                "amount": 40,
                "sender": "Alishan Esengulov",
                "recipient": "Aibek Esengulov",
                "transactionId": "41d2e4c0591b11e98d1d21ee0d34ad4f"
            },
            {
                "amount": 50,
                "sender": "Alishan Esengulov",
                "recipient": "Aibek Esengulov",
                "transactionId": "4421b6c0591b11e98d1d21ee0d34ad4f"
            },
            {
                "amount": 60,
                "sender": "Alishan Esengulov",
                "recipient": "Aibek Esengulov",
                "transactionId": "4685be70591b11e98d1d21ee0d34ad4f"
            },
            {
                "amount": 70,
                "sender": "Alishan Esengulov",
                "recipient": "Aibek Esengulov",
                "transactionId": "48b8a400591b11e98d1d21ee0d34ad4f"
            }
        ],
        "nonce": 29590,
        "hash": "00007e64c8169a75b8288d8d1319b5d1bfeb10c8d2803fb11d005b18f8d63d7f",
        "previousBlockHash": "0000d70b9e0971886258e7cbfa3cfcaf41fed4533656ca4547f2a312c8165c9d"
    },
    {
        "index": 5,
        "timestamp": 1554630962790,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "ec1e6ef0591a11e98d1d21ee0d34ad4f",
                "transactionId": "4d24b0b0591b11e98d1d21ee0d34ad4f"
            }
        ],
        "nonce": 187584,
        "hash": "00008374679be8cf3ebba47aab689d9bd9821187e9c5eb7d99759430e72d6750",
        "previousBlockHash": "00007e64c8169a75b8288d8d1319b5d1bfeb10c8d2803fb11d005b18f8d63d7f"
    },
    {
        "index": 6,
        "timestamp": 1554630966290,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "ec1e6ef0591a11e98d1d21ee0d34ad4f",
                "transactionId": "5a73d340591b11e98d1d21ee0d34ad4f"
            }
        ],
        "nonce": 12548,
        "hash": "0000429fa0ba13a7c68bddc3cfefe1c907b4135d0396008df8ff0662ee87a2fc",
        "previousBlockHash": "00008374679be8cf3ebba47aab689d9bd9821187e9c5eb7d99759430e72d6750"
    }
],
    "pendingTransactions": [
    {
        "amount": 12.5,
        "sender": "00",
        "recipient": "ec1e6ef0591a11e98d1d21ee0d34ad4f",
        "transactionId": "5c883450591b11e98d1d21ee0d34ad4f"
    }
],
    "currentNodeUrl": "http://localhost:3001",
    "networKNodes": []
};


console.log('Valid: ', BitCoin.chainIsValid(blockChainOne.chain));
// console.log(BitCoin);

//Will return hash that stars with '0000'.
// console.log(BitCoin.hashBlock(previousBlockHash, currentBlockData, 155499));

// console.log(BitCoin.proofOfWork(previousBlockHash, currentBlockData));

// const nonce = 100;

//Logging out the instance to see how much blocks are there.
// console.log(BitCoin.hashBlock(previousBlockHash, currentBlockData, nonce));

/*

BitCoin.createNewBlock(213982, 'DSJKFSDKHJF2893', 'SFHDSJFHK42KJH');
BitCoin.createNewTransaction(100, 'AZIZ36872HDJSHD', 'ALEX1371HDSGFJSHDF');
BitCoin.createNewBlock(32434, 'KJHFKSHD3243H4', 'HK12J3HK12J3H');

BitCoin.createNewTransaction(50, 'AZIZ36872HDJSHD', 'ALEX1371HDSGFJSHDF');
BitCoin.createNewTransaction(300, 'AZIZ36872HDJSHD', 'ALEX1371HDSGFJSHDF');
BitCoin.createNewTransaction(2000, 'AZIZ36872HDJSHD', 'ALEX1371HDSGFJSHDF');

BitCoin.createNewBlock(3213123, 'JH312KH312J', 'JH321K3H12K3HK');

*/

//Creating new blocks for testing.

/*
    BitCoin.createNewBlock(2389, 'DJSHADKJ33', 'DASDHAKJDHKADH2');
    BitCoin.createNewBlock(3312, 'KDHASKJDA', 'DALDALDKA');
    BitCoin.createNewBlock(9784, 'DAKDADKDASKDJA', 'KJDNSAKJDASKJD');
*/

// console.log(BitCoin.getLastBlock());