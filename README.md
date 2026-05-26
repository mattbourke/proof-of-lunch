# Proof of Lunch  

> verifiable randomness in a decentralised network  

## Brief Explanation
This app produces a deterministic ordering of a list that is unknown in advance and verifiable by all remote participating parties.  
This is a hobby project with the 3 following goals. 
1. To build a [HashCash](https://en.wikipedia.org/wiki/Hashcash) inspired decentralised random selection tool, that can randomly select my lunch when I can't decide.
2. To learn the basics of React/Next.js step by step, commit by commit.
3. To not bother working on the look and feel of the app.   
  
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

# serve with hot reload at localhost:3000
npm run dev

# build for production
npm run build

# start production server
npm run start
```
