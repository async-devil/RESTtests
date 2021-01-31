#!/bin/bash

######################
target="es6"
module="commonjs"
outDir="build"
watchPath1="./src/**/*.ts"
watchPath2="./src/*.ts"
######################

echo "Starting tsc in watch mode with parametrs: -t $target -m $module --outDir $outDir --watch $watchPath1 --watch $watchPath2"

npx tsc -t $target -m $module --outDir $outDir --esModuleInterop true --skipLibCheck true --watch $watchPath
