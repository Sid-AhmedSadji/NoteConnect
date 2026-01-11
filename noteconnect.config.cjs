module.exports = {
    apps: [
      {
        name: "nc-backend",
        script: "npm",
        args: "start:backend",

      },
      {
        name: "nc-proxy",
        script: "npm run",
        args: "run start:proxy",
      },
      {
        name: "nc-frontend",
        script: "npm",
        args: "run start:frontend",
        },
    ]
  };