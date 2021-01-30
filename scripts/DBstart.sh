#!/bin/bash

echo "Starting MongoDB process"

#Please change theese directories when using it on other pc
MONGODB_EXE_PATH="../../../../mongoDB/bin"
MONGODB_DATA_PATH="../../../.."
##########################

$MONGODB_EXE_PATH/mongod.exe --dbpath=$MONGODB_DATA_PATH/mongoDB-data 
