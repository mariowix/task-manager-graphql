#bin/bash!

cd server;
docker build . -t task-api;
cd ..;
docker compose up;
