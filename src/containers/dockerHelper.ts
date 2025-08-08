import { dockerStreamType } from "../types/dockerStreamType";
import { Header_Size } from "../utils/constants";

function decodeDockerStream(buffer: Buffer) {
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

export default decodeDockerStream;
//every chunk has a header and a value header has the informaiton about type of stream
// first chunk is a header which will determine wheter a string is input or error.
