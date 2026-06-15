// 88CN PM2 Ecosystem Configuration
// Usage: pm2 start ecosystem.config.cjs
// Copy to /var/www/88cn/deploy/pm2/ on production server

module.exports = {
  apps: [
    {
      name: "88cn-web",
      cwd: "/var/www/88cn",
      script: "node_modules/.bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        // Set these on the server via `pm2 env` or a .env file — do NOT commit real values:
        // NEXT_PUBLIC_SUPABASE_URL
        // NEXT_PUBLIC_SUPABASE_ANON_KEY
        // SUPABASE_SERVICE_ROLE_KEY
        // APP_URL
      },
      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/88cn/error.log",
      out_file: "/var/log/88cn/out.log",
      merge_logs: true,
      // Restart policy
      max_restarts: 10,
      restart_delay: 3000,
      max_memory_restart: "512M",
      // Graceful shutdown
      kill_timeout: 10000,
      listen_timeout: 10000,
    },
  ],
};
