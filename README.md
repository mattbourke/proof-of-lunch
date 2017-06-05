# Proof of Lunch  

> verifiable randomness in a decentralised network  

## Brief Explanation
This app is an on going hobby project with the 3 following goals. 
1. To build a [HashCash](https://en.wikipedia.org/wiki/Hashcash/) inspired decentralised random selection tool, that can randomly select my lunch when I can't decide.
2. To learn the basics of VUE.JS step by step, commit by commit.
3. To not bother working on the look and feel of the app.  

This app allows for a completely random selection from a list, verifiable as random to all remote participating parties.  
  
This app uses the Bitcoin Blockchain as a source of entropy.  
We build a simple list of items that the user has input, then we take the hash of the most recent Bitcoin block and perform [Proof Of Work](https://en.wikipedia.org/wiki/Proof-of-work_system) on all of the items in the specified list, the proof of work function takes the 3 following values for each item.  
1. Hash of the most recent Bitcoin Block
2. The List item
3. [Nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce)  

The list will be ordered by the items having the highest nonce, so the highest nonce found wins!.  
Any remote party can validate the winning result via the validate link.  

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
