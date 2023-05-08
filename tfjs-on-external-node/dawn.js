const tfwebgpu = require('@tensorflow/tfjs-backend-webgpu');
const tf = require('@tensorflow/tfjs-core');

const addSpec = {
  'name': 'add',
  'inputs':
      [{'shape': [6], 'dtype': 'float32'}, {'shape': [6], 'dtype': 'float32'}]
};

function test() {
  const shader = tf.backend().getShader(addSpec);
  printShader(shader);
}

function printShader(shader) {
  for (const key in shader) {
    console.group(key);
    console.debug(shader[key]);
    console.groupEnd();
  }
}

(async function main() {
  await tf.setBackend('webgpu');
  await tf.ready();
  test();
})();
