#!/usr/bin/env -S npx tsx --

import { build } from "esbuild"
import babelPlugin from "esbuild-plugin-babel"

await build({
    entryPoints: ["./dist/index.browser.js"],
    outfile: "./dist/index.browser-bundle.js",
    bundle: true,
    format: "iife",
    globalName: "RPCWebsocket",
    minify: true,
    plugins: [babelPlugin()],
    treeShaking: true,
})
