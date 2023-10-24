import child_process from "child_process";

const wait = async ms => {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

const spawn = child_process.spawn;

const rootPath = process.cwd();

const commands = [
  `${rootPath}/socket-server.js`,
  ...Array(25)
    .fill(null)
    .map((_, i) => `${rootPath}/index.js ${i + 1}`)
];

for (const command of commands) {
  await wait(5000);
  const cmd = command.split(" ");
  const proc = spawn("node", cmd);

  proc.stdout.on("data", function(data) {
    console.log("stdout: " + data.toString());
  });

  proc.stderr.on("data", function(data) {
    console.log("stderr: " + data.toString());
  });

  proc.on("exit", function(code) {
    console.log("child process exited with code " + code.toString());
  });
}
