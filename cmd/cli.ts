import { Command } from "cliffy";
import { stowCLIHandler } from "@services/stow.ts";

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
    .action(stowCLIHandler);
}
