import { Command } from "cliffy";
import { $ } from "zx";
import * as YAML from "encoding/yaml.ts";
import * as colors from "colors";
import * as fs from "fs";

interface IOptions {
  force: boolean;
  rm: boolean;
}

/**
 * Main CLI command, as of right now the CLI does not have sub-commands.
 */
export async function run() {
  const cmd = makeCommand();
  await cmd.parse(Deno.args);
}

function makeCommand() {
  return new Command()
    .name("stower")
    .version("v1.0.0")
    .description("Stow your folder using yml")
    .option("-f, --force", "remove conflicting folders")
    .option("--rm", "un-stow folders")
    .arguments("[file:string]")
    .action(stowerHandler);
}

const stowerHandler = async (options: IOptions, file = "./stower.yml") => {
  const stowPaths = getStowPaths(file);

  const promiseArray: Promise<unknown>[] = []
  for (const [context, paths] of Object.entries(stowPaths)) {
    console.log({ context })

    for (const path of paths) {
      promiseArray.push($`stow ${path}`)
    }
  }

  try {
    await Promise.all(promiseArray)
  } catch {
    // none
  }
};

type StowPaths = {
  [context: string]: string[]
};

function getStowPaths(file: string, decoder = new TextDecoder()): StowPaths {
  const content = Deno.readFileSync(file);
  const payload = decoder.decode(content)
  return YAML.parse(payload) as StowPaths;
}
