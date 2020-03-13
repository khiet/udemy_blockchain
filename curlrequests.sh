curl -X POST -H "Content-Type: application/json" -d '{"newNodeUrl": "http://localhost:3002"}' http://localhost:3001/register-and-broadcast-node
curl -X POST -H "Content-Type: application/json" -d '{"newNodeUrl": "http://localhost:3003"}' http://localhost:3001/register-and-broadcast-node
curl -X POST -H "Content-Type: application/json" -d '{"newNodeUrl": "http://localhost:3004"}' http://localhost:3001/register-and-broadcast-node
curl -X POST -H "Content-Type: application/json" -d '{"newNodeUrl": "http://localhost:3005"}' http://localhost:3001/register-and-broadcast-node

curl -X POST -H "Content-Type: application/json" -d '{"amount": 100,"sender": "7fd063e0651a11ea82860fcd3429d301","recipient": "807cd080651a11ea82860fcd3429d301"}' http://localhost:3001/transaction/broadcast
curl -X POST -H "Content-Type: application/json" -d '{"amount": 200,"sender": "807cd080651a11ea82860fcd3429d301","recipient": "90513e60651a11ea82860fcd3429d301"}' http://localhost:3002/transaction/broadcast
curl -X POST -H "Content-Type: application/json" -d '{"amount": 300,"sender": "7fd063e0651a11ea82860fcd3429d301","recipient": "90513e60651a11ea82860fcd3429d301"}' http://localhost:3003/transaction/broadcast

curl http://localhost:3001/mine

curl -X POST -H "Content-Type: application/json" -d '{"amount": 10,"sender": "7fd063e0651a11ea82860fcd3429d301","recipient": "807cd080651a11ea82860fcd3429d301"}' http://localhost:3001/transaction/broadcast
curl http://localhost:3002/mine
curl -X POST -H "Content-Type: application/json" -d '{"amount": 20,"sender": "807cd080651a11ea82860fcd3429d301","recipient": "90513e60651a11ea82860fcd3429d301"}' http://localhost:3005/transaction/broadcast
curl http://localhost:3003/mine
curl -X POST -H "Content-Type: application/json" -d '{"amount": 30,"sender": "d6531d00655811ea981a9114a6a1cc6c","recipient": "90513e60651a11ea82860fcd3429d301"}' http://localhost:3005/transaction/broadcast
curl http://localhost:3004/mine
curl -X POST -H "Content-Type: application/json" -d '{"amount": 40,"sender": "d6a386f0655811ea981a9114a6a1cc6c","recipient": "90513e60651a11ea82860fcd3429d301"}' http://localhost:3005/transaction/broadcast
curl http://localhost:3005/mine
curl -X POST -H "Content-Type: application/json" -d '{"amount": 50,"sender": "d7ebbe60655811ea981a9114a6a1cc6c","recipient": "90513e60651a11ea82860fcd3429d301"}' http://localhost:3005/transaction/broadcast
curl http://localhost:3005/mine
