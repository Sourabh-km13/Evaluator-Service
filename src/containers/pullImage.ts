import Docker from "dockerode";
import logger from "../config/logger.config";

export async function pullImage(imageName: string) {
  try {
    const docker = new Docker();
    return new Promise((res, rej) => {
      console.log("pulling image");
      docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream) => {
        if (err) throw err;
        docker.modem.followProgress(
          stream,
          (err, response) => (err ? rej(err) : res(response)),
          (event) => console.log(event.status),
        );
      });
    });
  } catch (error) {
    logger.error(error);
  }
}
