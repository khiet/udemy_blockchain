## A demo blockchain app based on [Learn Blockchain By Building Your Own In JavaScript](https://www.udemy.com/course/build-a-blockchain-in-javascript/)

### Summary of concepts

* Create *transactions*.
* Use *proof of work* to mine a new *block*.
* View *blockchain* and *transaction*.
* Create a network of *nodes* and use *broadcast* to synchronize the blockchain.
* Use *consensus* with "Longest Chain Rule" to keep nodes up-to-date.

### How to run

```
# Start servers (localhost with differnt ports)
npm run node_1
npm run node_2
npm run node_3
npm run node_4
npm run node_5

# Run the script to pre-fill data
./curlrequests.sh
```
