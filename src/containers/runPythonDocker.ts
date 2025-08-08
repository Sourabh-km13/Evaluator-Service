import createContainer from "./containerFactory";
// import { TestCases } from "../types/testcases";
import { Python_Image } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";

async function runPython(code: string, testcases: string) {
  const rawLogBuffer: Buffer[] = [];

  console.log("Initializing new python container");
  // eslint-disable-next-line quotes
  const runCommand = `echo '${code.replace(/'/g, `'\\"`)}'> test.py && echo '${testcases.replace(/'/g, `'\\"`)}' | python3 test.py`;
  const pythonDockerContainer = await createContainer(Python_Image, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);
  await pythonDockerContainer.start();
  console.log("python container started");
  const loggerStream = await pythonDockerContainer.logs({
    stdout: true,
    stderr: true,
    timestamps: false,
    follow: true,
  });
  loggerStream.on("data", (chunk) => {
    rawLogBuffer.push(chunk);
  });
  await new Promise((res, rej) => {
    loggerStream.on("end", () => {
      console.log(rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      console.log(completeBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream);
      res(decodedStream);
    });
  });
  await pythonDockerContainer.remove();
  return pythonDockerContainer;
}

export default runPython;
