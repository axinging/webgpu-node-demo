const gpuProviderModule = require('bindings')('dawn');
const tfwebgpu = require('@tensorflow/tfjs-backend-webgpu');
const tf = require('@tensorflow/tfjs-core');

(async function main() {
  tf.env().set('WEBGPU_CPU_FORWARD', false);
  tf.env().set('WEBGPU_PRINT_SHADER', 'binary');
  await tf.setBackend('webgpu');
  await tf.ready();

  const a = tf.tensor1d([1, 2, 3, 4]);
  const b = tf.tensor1d([10, 20, 30, 40]);
  const result = tf.add(a, b);
  console.log(await result.data());
})();
