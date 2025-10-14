import createContainer from "./containerFactory";
// import { TestCases } from "../types/testcases";
import { Python_Image } from "../utils/constants";
import { fetchDecodedStream } from "./dockerHelper";
import {
  CodeEvaluationStrategy,
  ExecutionResponseType,
} from "./codeEvaluatorStrategy";

class PythonExecutor implements CodeEvaluationStrategy {
  async execute(
    code: string,
    testCases: string,
  ): Promise<ExecutionResponseType> {
    const rawLogBuffer: Buffer[] = [];

    console.log("Initializing new python container");
    // eslint-disable-next-line quotes
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}'> test.py && echo '${testCases.replace(/'/g, `'\\"`)}' | python3 test.py`;
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

    try {
      const codeResponse = await fetchDecodedStream(loggerStream, rawLogBuffer);
      return { output: codeResponse, status: "Completed " };
    } catch (error) {
      return { output: error as string, status: "Rejected" };
    } finally {
      await pythonDockerContainer.remove();
    }
  }
}

export default PythonExecutor;
