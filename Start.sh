#!/bin/bash
SERVICE=mongod;
BOOL=0

if [ "$1" == "db" ] || [ "$1" == "all" ]; then
	echo "Checking Database" 
	if ps ax | grep -v grep | grep $SERVICE > /dev/null
	then
	    echo "$SERVICE service running, everything is fine"  
	else
	    echo "$SERVICE is not running, starting"
	    sudo service mongod start
	    sleep 5
	fi
	BOOL=1
fi

if [ "$1" == "server" ] || [ "$1" == "all" ]; then
	cd ./server
	echo "STARTING SERVER" 
	node index.js &
	cd ../ 
	sleep 2
	BOOL=1
fi

if [ "$1" == "client" ] || [ "$1" == "all" ]; then
	cd ./client
	echo "STARTING CLIENT"
	http-server . -c-1 &
	cd ../
	sleep 2
	BOOL=1
fi

if [ $BOOL == 0 ]; then
	echo "Usage: ./Start arg1, where arg1 == {server, client, db}"
fi
