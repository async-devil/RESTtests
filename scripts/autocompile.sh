#!/bin/bash

######################
target="es6"
module="commonjs"
outDir="build"
watchPath="./src/*.ts"
######################

echo "Starting tsc in watch mode with parametrs: -t $target -m $module --outDir $outDir --watch $watchPath"

npx tsc -t $target -m $module --outDir $outDir --esModuleInterop true --skipLibCheck true --watch $watchPath
