#!/bin/bash

echo "Rebuild?"

while read ANSW; do
  if [[ "$ANSW" == 'N' ]] || [[ "$ANSW" == 'n' ]]; then
    break;
  elif [[ "$ANSW" == 'Y' ]] || [[ "$ANSW" == 'y' ]]; then
    echo "Trying to compile ts"
    npx tsc
    break;
  else
    echo "Unknown command"
  fi
done

echo "Running build/index.js"
node build/index.js
