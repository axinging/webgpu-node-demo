const gpuProviderModule = require('bindings')('dawn');
const tfwebgpu = require('@tensorflow/tfjs-backend-webgpu');
const tf = require('@tensorflow/tfjs-core');
const tfconv = require('@tensorflow/tfjs-converter');

function predictFunction(input) {
  return model => model.predict(input);
}

const benchmarks2 = {
  'MobileNetV3': {
    type: 'GraphModel',
    architectures: ['small_075', 'small_100', 'large_075', 'large_100'],
    load: async (inputResolution = 224, modelArchitecture = 'small_075') => {
      const url = `https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_${
          modelArchitecture}_224/classification/5/default/1`;
      console.log(url);
      return tfconv.loadGraphModel('http://127.0.0.1:8080/model.json');
    },
    predictFunc: () => {
      const input = tf.randomNormal([1, 224, 224, 3]);
      return predictFunction(input);
    },
  }
};

async function modelDemo(model, predict) {
    const result1 = predict(model);
    const promiseRes1 = await result1.data();
    console.log(promiseRes1);
}

(async function main() {
  await tf.setBackend('webgpu');
  await tf.ready();
  tf.env().set('WEBGPU_CPU_FORWARD', false);
  tf.env().set('WEBGPU_PRINT_SHADER', 'binary');

  const benchmark = benchmarks2['MobileNetV3'];
  const model = await benchmark.load();

  console.log(tf.env().get('WEBGPU_PRINT_SHADER'));
  const predict = benchmark.predictFunc();
  await modelDemo(model, predict);
})();
