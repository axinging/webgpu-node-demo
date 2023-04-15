webgpu-node supports running webgpu and TensorflowJS(WIP) on NodeJS.
(Currently only Linux is supportted)
## Building: 
1. Build dawn.node
https://source.chromium.org/chromium/chromium/src/+/main:third_party/dawn/src/dawn/node/README.md
(Only tried Ubuntu/Linux)

2. Build tfjs

```
git clone https://github.com/axinging/tfjs.git -b tfjswebgpu_on_node
cd  tfjs
git checkout master
git branch -D tfjswebgpu_on_node
git pull --all
git checkout tfjswebgpu_on_node
yarn
yarn bazel clean
cd link-package && yarn build-deps-for tfjs-backend-webgpu tfjs-core tfjs-backend-cpu  tfjs-backend-webgl tfjs-converter
cd ../tfjs-backend-webgpu && rm -fr node_modules && yarn && yarn build-npm
yarn --cwd .. bazel build //tfjs-backend-webgpu/src:tests
ln -s ../dist/bin/tfjs-backend-webgpu/src/tests.ts tests
yarn && yarn build-npm
```

3. Run
git clone https://github.com/axinging/webgpu-node.git
cd webgpu-node
npm install
mkdir build
cp dawn.node ./build
mkdir ./node_modules/@tensorflow/tfjs-backend-webgpu/build/
cp dawn.node ./node_modules/@tensorflow/tfjs-backend-webgpu/build/
cp tf-backend-webgpu.node.js node_modules/@tensorflow/tfjs-backend-webgpu/dist/tf-backend-webgpu.node.js 
node .

