import fs from "node:fs"
import path from "node:path"
import archiver from "archiver"
import { defineConfig, type Plugin, type ResolvedConfig } from "vite"
import manifest from "./public/manifest.json"
import { fileURLToPath } from "node:url"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: "src",

    publicDir: "../public",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: mode === "development",
      rolldownOptions: {
        input: {
          content: "content.ts"
        },
        output: {
          entryFileNames: "[name].js"
        }
      }
    },
    plugins: [zipDistFolder()]
  }
})

function zipDistFolder(): Plugin {
  let resolvedConfig: ResolvedConfig
  return {
    name: "zip-dist-folder",
    configResolved(config) {
      resolvedConfig = config
    },
    async closeBundle() {
      const outDir = resolvedConfig.build.outDir
      const distPath = path.resolve(resolvedConfig.root, outDir)
      const zipName = `${manifest.name.toLowerCase().replaceAll(" ", "-")}-${
        manifest.version
      }.zip`
      const zipPath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        zipName
      )

      if (!fs.existsSync(distPath)) return

      const output = fs.createWriteStream(zipPath)
      const archive = archiver("zip", { zlib: { level: 9 } })

      output.on("close", () => {
        console.log(
          `\n📦 [Zip] ${outDir} -> ${zipName} (${archive.pointer()} bytes)`
        )
      })
      archive.on("error", (err) => {
        throw err
      })

      archive.pipe(output)
      archive.directory(distPath, false)
      await archive.finalize()
    }
  }
}
