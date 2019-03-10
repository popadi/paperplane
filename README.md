# partikip

## Pregatire pentru server
0. cd /server
1. sudo apt-get install nodejs nodejs-legacy
2. sudo apt-get install npm
3. wget -qO- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
4. nvm install 8.9.4
5. nvm use 8.9.4
6. npm install

## Rulare server
1. node index.js

## Rulare client
0. cd /client
1. npm install -g gulp-server-livereload
2. npm install -g browserify
3. browserify app.js > bundle.js; livereload
4. Access http://localhost:8000

## Daca vreti sa ridicati o instanta de MongoDB locala, trebuie sa procedati astfel:
1. Downloadati si instalati asta: https://www.mongodb.com/download-center#community; aveti rabdare, o sa dureze ceva
2. Mergeti in C:\ si creati folderul /data in care creati alte doua foldere, /log si /db; in /log, creati un fisier gol si numiti-l mongo.log
3. Deschideti MongoDB Compass Community; chestia asta e ca sa putem vedea datele foarte dragut (cele existente deja); nu merge sa pornim conexiunea de aici, pentru ca este nevoie de drepturi de administrator, asa ca Start -> scrieti 'cmd' -> Click dreapta -> Run as administrator
4. Scrieti "cd C:\Program Files\MongoDB\Server\3.6\bin"
5. .\mongod.exe si se va rula o instanta locala a bazei de date; daca reveniti in Compass, o sa vedeti ca se updateaza si o sa va arate cele doua tabele default (admin si local)

## Cloud
1. Pentru a va conecta la VM-ul de pe Amazon folositi 
2. ssh -i "AdminKeyPair.pem" ubuntu@ec2-18-130-4-138.eu-west-2.compute.amazonaws.com
3. AdminKeyPair.pem il gasiti in conversatia de pe fb IP BOSSES

## Install MongoDB Linux
In caz ca vreti sa va instalati MongoDB pe Linux (probabil o sa folosim asta cand o sa portam aplicatia pe alt VM in caz de ceva).
Si pun aici si instructiunile pentru a face accesibila baza de date remote.
Nu e nevoie sa rulati comenzile astea pentru dezvoltare locala, backendul e deja conectat la baza asta de date 

### Install
1. sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
2. echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
3. sudo apt-get update
4. sudo apt-get install -y mongodb-org

### Remote fix
1. sudo vim /etc/mongod.conf -> comenteaza linia "bindIp: 127.0.0.1"
2. Regula de input in IPtables: <br />
    sudo iptables -A INPUT -i eth0 -p tcp -m tcp --dport 27017 -j ACCEPT
3. Verificare listen port (cred): <br />
    sudo netstat -anltp|grep :27017
4. Autentificare ssh port exter 27018 mapat la port intern 27017: <br />
    sudo ssh -fNg -L 27018:127.0.0.1:27017 awsuser@servername
5. Adauga la inbound rules in Azure sau AWS portul 27018 <br />

Pentru mai multe detalii -> https://stackoverflow.com/questions/39158719/connect-to-mongodb-on-azure-vm-from-another-azure-vm<br />
Obs: Acolo sunt interschimbate porturile 27017 cu 27018. Comanda corecta e mai sus. Vezi (4).

### Rulare server mongodb
1. sudo service mongod start
2. sudo service mongod stop
3. sudo service mongod restart

### Conectare cu MongoDB Compass Community la baza de date de pe azure 
1. Hostname: ec2-18-130-4-138.eu-west-2.compute.amazonaws.com
2. Port: 27018
3. /*Restul ramane neschimbat*/

## Rulare nou!
Daca ati facut cel putin o data pasii de mai sus pentru instalare client, server si bd, de acum puteti folosi cele 3 scripturi <br />
1. Start.sh -> primeste ca parametru arg1 == {client, server, db, all} si porneste clientul serverul sau baza de date
1. Stop.sh -> primeste ca parametru arg1 == {client, server, db, all} si opreste clientul serverul sau baza de date
1. Restart.sh -> primeste ca parametru arg1 == {client, server, db, all} si restarteaza clientul serverul sau baza de date

## Disclaimer:
Consider ca e ok sa lucram momentan local pentru ca o sa se produca multe schimbari si ar fi enervant sa tot mutam pe un server noile fisiere. Cand o sa punem proiectul pe un server, o sa mutam cu totul (baza de date + back-end). Daca aveti idee de alta baza de date care s-ar folosi mai usor, testati local o instalare + functionare si putem schimba.
