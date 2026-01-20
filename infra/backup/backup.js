  const { execSync } = require("child_process");
  const path = require("path");
  const fs = require("fs");

  // load env
  require("dotenv").config({
    path: path.join(__dirname, "../../packages/backend/.env"),
    quiet: true,
  });

  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const backupDir = `${process.env.VAR_DIR}/backups`;
  const backupLogDir = `${process.env.VAR_DIR}/logs/backups`;
  const backupPath = path.join(backupDir, `${process.env.MONGO_DB_NAME}_${year}_${month}`);

  fs.mkdirSync(backupDir, { recursive: true });
  fs.mkdirSync(backupLogDir, { recursive: true });

  try {
    execSync(`mongodump --uri="${process.env.MONGO_URI}" --db="${process.env.MONGO_DB_NAME}" --out="${backupPath}"`, { stdio: "inherit" });

    console.log("Backup completed:", backupPath);
    console.log("STATUS: OK");
  } catch (error) {
    console.error("Backup failed!");
    console.error(error);
    console.log("STATUS: FAILED");
    process.exit(1);
  }

  // keep only last 3 backups
  const backups = fs.readdirSync(backupDir)
    .filter(f => f.startsWith(process.env.MONGO_DB_NAME))
    .sort((a, b) => {
      const aTime = fs.statSync(path.join(backupDir, a)).mtimeMs;
      const bTime = fs.statSync(path.join(backupDir, b)).mtimeMs;
      return aTime - bTime;
    });

  const maxBackups = 3;

  while (backups.length > maxBackups) {
    const oldest = backups.shift();
    fs.rmSync(path.join(backupDir, oldest), { recursive: true, force: true });
    console.log("Deleted old backup:", oldest);
  }
