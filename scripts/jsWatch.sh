#!/bin/bash

######################
startFile="build/index.js"
watchPath="src"
delay="600ms"
######################

echo "Starting nodemon $startFile with watch $watchPath and delay $delay properties"

npx nodemon $startFile --watch $watchPath --delay $delay