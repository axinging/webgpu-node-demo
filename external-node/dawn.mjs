//const gpuProviderModule = require('bindings')('dawn');
import  gpuProviderModule1  from 'bindings';

console.log(gpuProviderModule1);
const gpuProviderModule = gpuProviderModule1('dawn');
console.log(gpuProviderModule);

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


function getComputeShaderCodeWGSLGood() {
  return ` 
    struct Buf {
      data: array<vec4<f32>, 2>,
    };
    @group(0) @binding(0) var<storage, read> inBuf : Buf;
    @group(0) @binding(1) var<storage, read_write> outBuf : Buf; 
    @compute @workgroup_size(1)
    fn main(@builtin(global_invocation_id) globalId : vec3<u32>) {
      
      for (var j = 0; j < 2; j ++) {
          for (var i = 0; i < 4; i = i + 1) {
              outBuf.data[j][i] = inBuf.data[j][i] + 3.0;
          }
      }
    }
`;
}

function defaultGpuBufferUsage() {
  return GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC |
      GPUBufferUsage.COPY_DST;
}

async function runCompute(device, shaderWgsl) {
  // First Matrix
  const inBuf = new Float32Array([0, 1, 2, 3, 4, 5, 6, 98]);

  var gpuBufferFirstMatrix;
  const useWriteBuffer = false;
  if (useWriteBuffer) {
    gpuBufferFirstMatrix = device.createBuffer({
      size: inBuf.byteLength,
      usage: defaultGpuBufferUsage(),
    });
    device.queue.writeBuffer(gpuBufferFirstMatrix, 0, inBuf);
  } else {
    gpuBufferFirstMatrix = device.createBuffer({
      mappedAtCreation: true,
      size: inBuf.byteLength,
      usage: GPUBufferUsage.STORAGE
    });
    const arrayBufferFirstMatrix = gpuBufferFirstMatrix.getMappedRange();
    new Float32Array(arrayBufferFirstMatrix).set(inBuf);
    gpuBufferFirstMatrix.unmap();
  }

  // Result Matrix
  const sizeA = 2;
  const sizeB = 4;
  const resultMatrixBufferSize =
      Float32Array.BYTES_PER_ELEMENT * (sizeA * sizeB);
  const resultMatrixBuffer = device.createBuffer({
    size: resultMatrixBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
  });

  // Compute shader code (GLSL)

  // Pipeline setup
  // const shaderWgsl = getComputeShaderCodeWGSLGood();
  const computePipeline = device.createComputePipeline({
    layout: 'auto',
    compute: {
      module: device.createShaderModule({code: shaderWgsl}),
      entryPoint: 'main'
    }
  });

  const bindGroupLayout = computePipeline.getBindGroupLayout(0);
  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {binding: 0, resource: {buffer: gpuBufferFirstMatrix}},
      {binding: 1, resource: {buffer: resultMatrixBuffer}}
    ]
  });

  // Commands submission
  const commandEncoder = device.createCommandEncoder();

  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(computePipeline);
  passEncoder.setBindGroup(0, bindGroup);
  const workPerThread = 4;
  passEncoder.dispatchWorkgroups(1 /* x */, 1 /* y */);
  passEncoder.end();

  // Get a GPU buffer for reading in an unmapped state.
  const gpuReadBuffer = device.createBuffer({
    size: resultMatrixBufferSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
  });

  // Encode commands for copying buffer to buffer.
  commandEncoder.copyBufferToBuffer(
      resultMatrixBuffer /* source buffer */, 0 /* source offset */,
      gpuReadBuffer /* destination buffer */, 0 /* destination offset */,
      resultMatrixBufferSize /* size */
  );

  // Submit GPU commands.
  const gpuCommands = commandEncoder.finish();
  device.queue.submit([gpuCommands]);

  gpuBufferFirstMatrix.destroy();
  resultMatrixBuffer.destroy();

  // Read buffer.
  await gpuReadBuffer.mapAsync(GPUMapMode.READ);
  const arrayBuffer = gpuReadBuffer.getMappedRange();
  console.log(new Float32Array(arrayBuffer));
}

(async function main() {
  setGPUProvider();
  const GPU = getGPU(); 
  console.log(GPU);
  console.log(typeof GPU);
  const adapter = await GPU.requestAdapter();
  const device = await adapter.requestDevice();
  await runCompute(device, getComputeShaderCodeWGSLGood());
})();
