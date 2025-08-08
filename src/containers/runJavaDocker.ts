import createContainer from "./containerFactory";
// import { TestCases } from "../types/testcases";
import { Java_Image } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";

async function runJava(code: string, testcases: string) {
  const rawLogBuffer: Buffer[] = [];

  console.log("Initializing new java container");
  // eslint-disable-next-line quotes
  const runCommand = `echo '${code.replace(/'/g, `'\\"`)}'> Main.java && javac Main.java && echo '${testcases.replace(/'/g, `'\\"`)}' | java Main`;
  const javaDockerContainer = await createContainer(Java_Image, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);
  await javaDockerContainer.start();
  console.log("java container started");
  const loggerStream = await javaDockerContainer.logs({
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
  await javaDockerContainer.remove();
  return javaDockerContainer;
}

export default runJava;
