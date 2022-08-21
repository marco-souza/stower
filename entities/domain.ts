export type CLIOptions = {
  force: boolean,
  rm: boolean,
}

export type StowConfigs = {
  config: string[],
  folders: string[],
  links: {
    [dest: string]: string[],
  },
};
