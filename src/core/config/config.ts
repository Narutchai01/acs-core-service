export interface Config {
  APP_PORT: number;
}

export const config: Config = {
  APP_PORT: process.env.APP_PORT
    ? Number.parseInt(process.env.APP_PORT, 10)
    : 8000,
};
