const gpuProviderModule = require('bindings')('dawn');
// const tf = require('@tensorflow/tfjs');
// const tfwebgl = require('@tensorflow/tfjs-backend-webgl')
const tfwebgpu = require('@tensorflow/tfjs-backend-webgpu');
const tf = require('@tensorflow/tfjs-core');
console.log(tfwebgpu);
console.log(tfwebgpu.webgpu_util.isWebGPUSupported());

console.log(tf.engine().backendNames());
let gpuProvider = null;
function setGPUProvider() {
  const gpuProviderFlags = ['disable-dawn-features=disallow_unsafe_apis'];
  gpuProvider = () => gpuProviderModule.create(gpuProviderFlags);
}
let gpuImpl = null;
function getGPU() {
  if (gpuImpl) {
    return gpuImpl;
  }
  gpuImpl = gpuProvider();
  return gpuImpl;
}

(async function main() {
  setGPUProvider();
  const GPU = getGPU();
  const adapter = await GPU.requestAdapter();
  const device = await adapter.requestDevice();
  tf.env().set('WEBGPU_CPU_FORWARD', false);
  await tf.setBackend('webgpu');
  await tf.ready();

  const a = tf.tensor1d([1, 2, 3, 4]);
  const b = tf.tensor1d([10, 20, 30, 40]);
  const result = tf.add(a, b);
  console.log(await result.data());
})();
