import createContainer from "./containerFactory";
// import { TestCases } from "../types/testcases";
import { Cpp_Image } from "../utils/constants";

import { pullImage } from "./pullImage";
import {
  CodeEvaluationStrategy,
  ExecutionResponseType,
} from "./codeEvaluatorStrategy";
import { fetchDecodedStream } from "./dockerHelper";

class CppExecutor implements CodeEvaluationStrategy {
  async execute(
    code: string,
    testCases: string,
  ): Promise<ExecutionResponseType> {
    const rawLogBuffer: Buffer[] = [];
    await pullImage(Cpp_Image);
    console.log("Initializing new cpp container");
    // eslint-disable-next-line quotes
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}'> main.cpp && g++ main.cpp -o main && echo '${testCases.replace(/'/g, `'\\"`)}' | ./main`;
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

    try {
      const codeResponse = await fetchDecodedStream(loggerStream, rawLogBuffer);
      return { output: codeResponse, status: "Completed " };
    } catch (error) {
      return { output: error as string, status: "Rejected" };
    } finally {
      await cppDockerContainer.remove();
    }
  }
}
export default CppExecutor;
