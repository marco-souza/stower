import { StowConfigs } from "@entities/domain.ts";
import { Logging } from "@services/logging.ts";
import * as YAML from "encoding/yaml.ts";

export type Shell<T = any> = (pieces: any, ...args: any[]) => Promise<T>

export type StowServiceDeps = {
  sh: Shell;
  file: string;
  logging: Logging;
};

export class StowService {
  config: StowConfigs;
  private decoder: TextDecoder;

  constructor(private deps: StowServiceDeps) {
    this.decoder = new TextDecoder();
    this.config = this.getStowConfigs();
  }

  apply = () => Promise.all([...this.stowConfigs(), ...this.stowFolders(), ...this.stowLinks()]);

  static create = (deps: StowServiceDeps) => new StowService(deps);

  private getStowConfigs(): StowConfigs {
    const { file } = this.deps;

    const content = Deno.readFileSync(file);
    const payload = this.decoder.decode(content);

    return YAML.parse(payload) as StowConfigs;
  }

  private stowConfigs() {
    const { sh, logging } = this.deps;
    const { config } = this.config;

    logging.debug("[info] stowing configs...");

    return config.map((folder) => sh`stow ${folder}`);
  }

  private stowFolders() {
    const { sh, logging } = this.deps;
    const { folders } = this.config;

    logging.debug("[info] stowing folders...");

    return folders.map((folder) => sh`ln -s ./${folder} $HOME/${folder}`);
  }

  private stowLinks() {
    const { sh, logging } = this.deps;
    const { links } = this.config;

    logging.debug("[info] creating links...");

    return Object.entries(links).map(([dest, source]) => sh`ln -s ${dest} ${source}`);
  }
}
