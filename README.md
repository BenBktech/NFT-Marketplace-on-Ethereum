# NFT Marketplace

## General instructions 

### Backend 

Rename .env.example to .env and put your private key, the rpc url and your etherscan API key

### Frontend 

Rename .env.example to .env and put your NFT.storage API KEY and your Web3Modal ID

## Infos 

* The tests have a 100% coverage

## Scripts 

### Deploy on local network

```
yarn hardhat deploy 
```

### Deploy on goerli network and verify automaticaly the smart contract

```
yarn hardhat deploy --network goerli
```
### Run all the tests 


```
yarn hardhat test
```

### Check the coverage of the tests


```
yarn hardhat coverage
```

