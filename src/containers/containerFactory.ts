import Docker from "dockerode";

async function createContainer(
  imageName: string,
  cmdExecutable: Array<string>,
) {
  const docker = new Docker();
  const container = await docker.createContainer({
    Image: imageName,
    Cmd: cmdExecutable,
    AttachStdin: true, //enable input stream
    AttachStdout: true, //enable output stream
    AttachStderr: true, // enable error stream
    Tty: false,
    OpenStdin: true,
  });
  return container;
}
export default createContainer;
