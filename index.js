import shelljs from "shelljs";
import path from "path";
const jarFile = "tabula-1.0.5-jar-with-dependencies.jar";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jarPath = path.resolve(__dirname, "lib", jarFile);

export default async function tableExtractor(filePath, options) {
  if (typeof filePath !== "string") {
    throw new TypeError(`Expected a string, got ${typeof input}`);
  }

  let args = [];

  if (Array.isArray(options)) {
    args = options;
  } else if (typeof options === "object") {
    args.push(options);
  }

  return new Promise(async (resolve, reject) => {
    let output = "";
    const executorPromises = [];

    args.forEach(async (item, index) => {
      const argString = Object.keys(item)
        .map((key) => `-${key}=${item[key]}`)
        .join(" ");

      const jobPromise = new Promise(async (localResolve, reject) => {
        const cmd = await shelljs.exec(
          `java -jar ${jarPath} ${argString} "${filePath}"`,
          {
            async: true,
            silent: true,
          }
        );
        let stdOut = "";

        cmd.stdout.on("data", (chunk) => {
          stdOut += chunk.toString();
        });

        cmd.stderr.on("data", (error) => {
          console.log(error);
          reject(error);
        });

        cmd.stderr.on("error", (error) => {
          console.log(error);
          reject(error);
        });

        cmd.on("exit", async (code) => {
          if (code === 0) {
            localResolve(stdOut);
          } else {
            reject("Something went wrong");
          }
        });
      });
      executorPromises.push(jobPromise);
    });

    const executor = await Promise.allSettled(executorPromises);
    executor.map((item) => {
      if (item.status === "fulfilled") {
        output += item.value;
      }
    });

    resolve(output);
  });
}
