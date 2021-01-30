#!/bin/bash

echo "Trying to compile ts sources into js"
npm run compile

echo "Starting index file"
node build/index.js