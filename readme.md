# readme.md

### User Info
*Please note* only community members who followed campaign rules correctly will be able to claim tokens. We've made sure that the people sending eth to the contract is reverted and not accepted however we are not responsible for any lost ETH if accidentally to our airdrop address.

*Please note* this contract can be paused and resumed, but also load/reload tokens for later campaigns.  When tokens run out, the contract will not honor any airdrop awards but can still perform proper functionality, have tokens added and continue using the contract for other giveaways. 

#### How to Claim Tokens with MyEtherWallet 

[A detailed guide on how to claim your Sparkle Airdrop on MyEtherWallet](https://www.linkedin.com/pulse/detailed-guide-how-claim-your-sparkle-airdrop-jonah-glasgow/)


#### How to Claim tokens with Etherscan + Metamask

[A detailed guide on how to claim your Sparkle Airdrop on Etherscan + Metamask](https://www.linkedin.com/pulse/detailed-guide-how-claim-your-sparkle-airdrop-using-metamask-glasgow/)

__________________________________________________________________________________________________________________________________



### Airdrop Info
[Airdrop Contract Address: *0x33D9Eb04442b7711cec632384DF6BbA45B141d3A*](https://etherscan.io/address/0x33d9eb04442b7711cec632384df6bba45b141d3a)

* isAddressInAirdropList: Approved Address
```html
 bool :  True
```

* isAddressInAirdropList: Non Approved Address
```html
 bool :  false
```

* If you address has been verified you can only claim 30 SPRKL or the custom amount set 1 time until your address has been removed from the list and reapproved 

### Airdrop Prize Amount 

* Standard Prize Amount
```html
Reward: 30 SPRKL
```
* Custom Prize Amount
```html
Reward: No cap set 
```

__________________________________________________________________________________________________________________________________


### Unclaimed Tokens 

Tokens that are not redeemed within an appropriate time frame will be given to new winners during the following campaigns leaving one of two scenarios. 
 1. All tokens are eventually redeemed by active participants 
 2. All remaining tokens are kept in the contract address until our next airdrop campaign where new participants will be added and most likely redeem the remaining tokens. 



__________________________________________________________________________________________________________________________________

### Setup

#### This project was built using NodeJS. Please ensure you install NodeJS and Node Package Manager. For more information follow this [link](https://nodejs.org/en/download/package-manager/).

---
# webpack-dev-server
To use:

* Install NodeJS
```html
** See link above for more information **
```
* Clone the repo
```html
git clone https://<YOUR_USER_NAME>@bitbucket.org/devmbk/dapp-sparkleairdrop.git
```
* Initialize and install dependancies from the node project
```html
npm install
```
* Start Webpack development server
```html
npx webpack-dev-server --https
```
* Open browser and connect
```html
https://localhost:8080
```
