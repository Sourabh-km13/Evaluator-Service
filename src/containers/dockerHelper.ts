import { dockerStreamType } from "../types/dockerStreamType";
import { Header_Size } from "../utils/constants";

//every chunk has a header and a value header has the informaiton about type of stream
// first chunk is a header which will determine wheter a string is input or error.
export function decodeDockerStream(buffer: Buffer) {
  let offset = 0;
  const output: dockerStreamType = { stdout: "", stderr: "" };

  while (offset < buffer.length) {
    const chanel = buffer[offset];
    //reading header
    const length = buffer.readUint32BE(offset + 4);
    //reading data
    offset += Header_Size;
    if (chanel === 1) {
      // stdout stream
      output.stdout += buffer.toString("utf-8", offset, offset + length);
    }
    if (chanel === 2) {
      output.stderr += buffer.toString("utf-8", offset, offset + length);
    }
    offset += length;
  }
  return output;
}
export async function fetchDecodedStream(
  loggerStream: NodeJS.ReadableStream,
  rawLogBuffer: Buffer[],
): Promise<string> {
  return new Promise((res, rej) => {
    loggerStream.on("end", () => {
      console.log(rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      console.log(completeBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream);
      if (decodedStream.stderr) {
        rej(decodedStream.stderr);
      } else {
        res(decodedStream.stdout);
      }
    });
  });
}
