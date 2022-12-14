const esbuild = require("esbuild");

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require("esbuild-node-externals");

// Find all .ts files - alternative is to just include ./src/index.ts and
// esbuild will recursively find all dependencies from that single file
//const glob = require("glob");
//const entryPoints = glob.sync("./src/**/*.ts");
const entryPoints = ["./src/index.ts"];

const config = {
  entryPoints,
  outfile: "./lib/index.js",
  bundle: true,
  minify: false,
  platform: "node",
  sourcemap: true,
  target: "node18",
  format: "esm",
  tsconfig: "./tsconfig.build.json",
  plugins: [nodeExternalsPlugin()],
};

esbuild.build(config).catch(() => process.exit(1));
