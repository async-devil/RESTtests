if [ ! -d "build" ]; then
  echo "Build directory does not exists"
    echo "Trying to compile ts"
    npx tsc
fi

echo "Running build/index.js"
node build/index.js
