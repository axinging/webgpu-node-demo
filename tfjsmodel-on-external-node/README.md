webgpu-node supports running webgpu and TensorflowJS(WIP) on NodeJS.
(Currently only Linux is supportted)
## Building: 
1. Build dawn.node
https://source.chromium.org/chromium/chromium/src/+/main:third_party/dawn/src/dawn/node/README.md
(Only tried Ubuntu/Linux)

2. Build tfjs

(If you are in Linux, you can skip this and use tf-backend-webgpu.node.js in the root folder.)
```
git clone https://github.com/axinging/tfjs.git -b tfjswebgpu_on_node
cd  tfjs
yarn
yarn bazel clean
cd link-package && yarn build-deps-for tfjs-backend-webgpu tfjs-core tfjs-backend-cpu  tfjs-backend-webgl tfjs-converter
cd ../tfjs-backend-webgpu && rm -fr node_modules && yarn && yarn build-npm
yarn --cwd .. bazel build //tfjs-backend-webgpu/src:tests
ln -s ../dist/bin/tfjs-backend-webgpu/src/tests.ts tests
yarn && yarn build-npm
```

3. Get model data:

Download https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_075_224/classification/5/default/1?tfjs-format=compressed, 
Unzip it, then put it into a web server, so it can be accessed by : http://127.0.0.1:8080/model.json


4. Run

(Currently some webgpu APIs are not fully supported in dawn, so this can be only used for dump shader, the predict results are invalid.)
```
git clone https://github.com/axinging/webgpu-node.git
cd webgpu-node/tfjsmodel-on-external-node
npm install
mkdir build
cp dawn.node ./build
mkdir ./node_modules/@tensorflow/tfjs-backend-webgpu/build/
cp dawn.node ./node_modules/@tensorflow/tfjs-backend-webgpu/build/
cp tf-backend-webgpu.node.js node_modules/@tensorflow/tfjs-backend-webgpu/dist/tf-backend-webgpu.node.js 
node .
```
