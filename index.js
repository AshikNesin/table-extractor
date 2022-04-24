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

  return new Promise((resolve, reject) => {
    let output = "";
    const executor = {};

    args.forEach(async (item, index) => {
      const argString = Object.keys(item)
        .map((key) => `-${key}=${item[key]}`)
        .join(" ");

      executor[index] = await shelljs.exec(
        `java -jar ${jarPath} ${argString} ${filePath}`,
        {
          async: true,
          silent: true,
        }
      );

      executor[index].stdout.on("data", (chunk) => {
        output += chunk.toString();
      });

      if (args.length === index + 1) {
        executor[index].on("exit", async (code) => {
          if (code === 0) {
            resolve(output);
          } else {
            reject("Something went wrong");
          }
        });
      }
    });
  });
}
