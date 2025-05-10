import { existsSync } from "fs"
import { mkdir } from "fs/promises"
import { join } from "path"

export async function ensureUploadDir(path: string): Promise<void> {
  const fullPath = join(process.cwd(), "public", path)
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true })
  }
}
