import createContainer from "./containerFactory";
// import { TestCases } from "../types/testcases";
import { Java_Image } from "../utils/constants";
import {
  CodeEvaluationStrategy,
  ExecutionResponseType,
} from "./codeEvaluatorStrategy";
import { fetchDecodedStream } from "./dockerHelper";

class JavaExecutor implements CodeEvaluationStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponseType> {
    const rawLogBuffer: Buffer[] = [];

    console.log("Initializing new java container");
    // eslint-disable-next-line quotes
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}'> Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
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
    try {
      const codeResponse = await fetchDecodedStream(loggerStream, rawLogBuffer);
      return { output: codeResponse, status: "COMPLETED" };
    } catch (error) {
      return { output: error as string, status: "REJECTED" };
    } finally {
      javaDockerContainer.remove();
    }
  }
}
export default JavaExecutor;
