#!/bin/bash
CLIENT_PID=$(ps -ef | grep "http-server . -c-1" | grep -v grep | tr -s " "| cut -d' ' -f2)
SERVER_PID=$(ps -ef | grep "node index.js" | grep -v grep | tr -s " "| cut -d' ' -f2)
BOOL=0
 
if [ "$1" == "server" ] || [ "$1" == "all" ]; then
	kill $SERVER_PID
	BOOL=1
fi

if [ "$1" == "client" ] || [ "$1" == "all" ]; then
	kill $CLIENT_PID
	BOOL=1
fi

if [ "$1" == "db" ] || [ "$1" == "all" ]; then
	sudo service mongod stop
	BOOL=1
fi

if [ $BOOL == 0 ]; then
	echo "Usage: ./Stop arg1, where arg1 == {server, client, db}"
fi
