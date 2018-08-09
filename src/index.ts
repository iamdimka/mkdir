import { mkdir as mk } from "fs"
import { dirname } from "path"

function mkdir(path: string, recurse?: boolean): Promise<boolean>
function mkdir(path: string, mode: number | string | undefined | null, recurse?: boolean): Promise<boolean>
function mkdir(path: string, mode?: number | string | undefined | null | boolean): Promise<boolean> {
  let recurse: boolean = arguments[2]

  if (typeof mode === "boolean") {
    recurse = mode
    mode = undefined
  }

  return new Promise((resolve, reject) => mk(path, mode as any, e => {
    if (!e) {
      return resolve(true)
    }

    if (e.code === "EEXIST") {
      return resolve(false)
    }

    if (e.code !== "ENOENT" || !recurse) {
      return reject(e)
    }

    const parent = dirname(path)
    if (parent === path) {
      return reject(e)
    }

    mkdir(parent, mode as any, true)
      .then(() => mkdir(path, mode as any))
      .then(resolve, reject)
  }))
}

export default mkdir