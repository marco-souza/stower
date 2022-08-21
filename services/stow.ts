import { $ } from "zx";
import { StowPaths, CLIOptions } from "@entities/domain.ts";
import * as logging from "@services/logging.ts";
import * as YAML from "encoding/yaml.ts";

export const stowCLIHandler = async (options: CLIOptions, file = "./stower.yml") => {
  const stowPaths = getStowPaths(file);

  try {
    await Promise.all([
      ...stowConfigs(stowPaths.config),
      ...stowFolders(stowPaths.folders),
      ...stowLinks(stowPaths.links),
    ])
  } catch {
    // none
  }
};

function getStowPaths(file: string, decoder = new TextDecoder()): StowPaths {
  const content = Deno.readFileSync(file);
  const payload = decoder.decode(content)
  return YAML.parse(payload) as StowPaths;
}

function stowConfigs(configs: StowPaths['config']) {
  logging.debug("[info] stowing configs...")
  return configs.map((config) => (
    $`stow ${config}`
  ))
}

function stowFolders(folders: StowPaths['folders']) {
  logging.debug("[info] stowing folders...")
  return folders.map((folder) => (
    $`ln -s ./${folder} $HOME/${folder}`
  ))
}

function stowLinks(links: StowPaths['links']) {
  logging.debug("[info] creating links...")
  return  Object.entries(links).map(([dest, source]) => (
    $`ln -s ${dest} ${source}`
  ))
}
