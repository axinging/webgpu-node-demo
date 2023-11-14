webgpu-node supports running webgpu and TensorflowJS(WIP) on NodeJS.

# Simple steps on Windows/Linux:
```
git clone https://github.com/axinging/webgpu-node-demo.git
cd webgpu-node-demo/tfjs-on-external-node
npm install
cp binary/tf-backend-webgpu.node.js node_modules/@tensorflow/tfjs-backend-webgpu/dist/
node dawn.js
```

# Build from source(Currently only Windows/Linux are supported):

1. Build dawn.node
https://source.chromium.org/chromium/chromium/src/+/main:third_party/dawn/src/dawn/node/README.md
(Only tried Windows and Ubuntu/Linux)

This will create dawn.node file under out-(you name it) folder.

2. Build tfjs

```
git clone https://github.com/axinging/tfjs.git -b tfjswebgpu_on_node
cd  tfjs
yarn
cd link-package && yarn build-deps-for tfjs-backend-webgpu tfjs-core tfjs-backend-cpu  tfjs-backend-webgl tfjs-converter
```

This will create tf-backend-webgpu.node.js under /home/abc/.cache/bazel/_bazel_wp/*************b/execroot/tfjs/bazel-out/k8-fastbuild/bin/tfjs-backend-webgpu/tf-backend-webgpu.node.js

3. Run demo
```
git clone https://github.com/axinging/webgpu-node-demo.git
cd webgpu-node-demo/tfjs-on-external-node
npm install
cp tf-backend-webgpu.node.js node_modules/@tensorflow/tfjs-backend-webgpu/dist/tf-backend-webgpu.node.js 
node dawn.js
```





