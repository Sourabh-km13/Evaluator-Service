import createContainer from "./containerFactory";
// import { TestCases } from "../types/testcases";
import { Cpp_Image } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import { pullImage } from "./pullImage";

async function runcpp(code: string, testcases: string) {
  const rawLogBuffer: Buffer[] = [];
  await pullImage(Cpp_Image);
  console.log("Initializing new cpp container");
  // eslint-disable-next-line quotes
  const runCommand = `echo '${code.replace(/'/g, `'\\"`)}'> main.cpp && g++ main.cpp -o main && echo '${testcases.replace(/'/g, `'\\"`)}' | ./main`;
  const cppDockerContainer = await createContainer(Cpp_Image, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);
  await cppDockerContainer.start();
  console.log("cpp container started");
  const loggerStream = await cppDockerContainer.logs({
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
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream);
      res(decodedStream);
    });
  });
  await cppDockerContainer.remove();
  return cppDockerContainer;
}

export default runcpp;
