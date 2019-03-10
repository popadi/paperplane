#!/bin/bash
BOOL=0
if [ "$1" == "db" ] || [ "$1" == "all" ]; then
	./Stop.sh "db"
	./Start.sh "db"
	BOOL=1
fi

if [ "$1" == "server" ] || [ "$1" == "all" ]; then
	./Stop.sh "server"
	./Start.sh "server"
	BOOL=1
fi

if [ "$1" == "client" ] || [ "$1" == "all" ]; then
	./Stop.sh "client"
	./Start.sh "client"
	BOOL=1
fi

if [ $BOOL == 0 ]; then
	echo "Usage ./Restart.sh arg1 where arg1 == {db, server, client, all}"
fi
