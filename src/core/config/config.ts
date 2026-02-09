export interface Config {
  APP_PORT: number;
  SUPABASE_URL: string | null;
  SUPABASE_KEY: string | null;
  BUCKET_NAME: string;
}

export const config: Config = {
  APP_PORT: process.env.APP_PORT
    ? Number.parseInt(process.env.APP_PORT, 10)
    : 8000,
  SUPABASE_URL: String(process.env.SUPABASE_URL),
  SUPABASE_KEY: String(process.env.SUPABASE_KEY),
  BUCKET_NAME: String(process.env.SUPABASE_BUCKET),
};
