webgpu-node supports running webgpu and TensorflowJS(WIP) on NodeJS.

## Building: 
1. Build dawn.node
https://source.chromium.org/chromium/chromium/src/+/main:third_party/dawn/src/dawn/node/README.md
(Only tried Ubuntu/Linux)

2. npm install
3. copy dawn.node to build/folder.
mkdir build
cp dawn.node ./build
mkdir ./node_modules/@tensorflow/tfjs-backend-webgpu/build/
cp dawn.node ./node_modules/@tensorflow/tfjs-backend-webgpu/build/
4. cp tf-backend-webgpu.node.js node_modules/@tensorflow/tfjs-backend-webgpu/dist/tf-backend-webgpu.node.js 
5. node .
