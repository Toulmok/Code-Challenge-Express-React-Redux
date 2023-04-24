//https://codingbeautydev.com/blog/javascript-dirname-is-not-defined-in-es-module-scope/
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export default function fileDirName(meta) {
  const __filename = fileURLToPath(meta.url)
  const __dirname = dirname(__filename)
  return { __dirname, __filename }
}

//https://codingbeautydev.com/blog/javascript-dirname-is-not-defined-in-es-module-scope/
//import fileDirName from './file-dir-name.js'
//const { __dirname, __filename } = fileDirName(import.meta)