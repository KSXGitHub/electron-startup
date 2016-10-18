[[ -d ./app ]] || (
  rm -rf ./app && mkdir ./app && cd ./app && ( npm install & )
)
node ./build
