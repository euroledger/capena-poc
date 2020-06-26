# Repository of the indy client (front+client)

The original demonstration can be found at https://github.com/hyperledger/education/tree/master/LFS171x/indy-material/nodejs

## Build

To build the base image used to buid the different agent, run first:
```docker build -f Dockerfile.ubuntu -t front-agent .```

Then launch ```docker-compose up``` to start one node, one client and one webserver.
