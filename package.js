#!/usr/bin/env node
import shell from 'shelljs'
import exec from 'shelljs.exec'
import archiver from 'archiver'
import fs from 'node:fs'
import process from 'node:process'

(async() => {
   const args = process.argv.slice(2)
   if (args.length === 0 ) {
      console.log('no arguments, packaging for deployment')
      const dist  = './dist'
      shell.rm('-rf',dist)
      shell.mkdir('-p',dist)
      exec("bun run build")

      const cdir=shell.pwd()
      exec(`open -n -b com.google.chrome --args --pack-extension=${cdir}/dist --pack-extension-key=${cdir}/dist.pem`)

      const DEFZIP = "htve.zip"
      const output = fs.createWriteStream(DEFZIP)
      const archive = archiver('zip')
      archive.pipe(output)
      archive.directory('dist', false)
      archive.file('auto-update.xml', false)
      archive.file('dist.crx', false)
      await archive.finalize()
      console.log(`archive created: ${DEFZIP}`)
   } else {
      if(args[0] === 'patch') {
         const nargs='ncu -u -t patch'
         console.log(nargs)
         console.log(await exec(nargs).stdout)

      } else if(args[0] === 'minor') {
         const nargs='ncu -u -t minor'
         console.log(nargs)
         console.log(await exec(nargs).stdout)

      } else if(args[0] === '-v') {
         const nargs='ncu'
         console.log(nargs)
         console.log(await exec(nargs).stdout)

      } else if(args[0] === '-f') {
         const nargs = `npx ncu -u -f ${args[1]}`
         console.log(nargs)
         console.log(await exec(nargs).stdout)
      }
      else {
         console.log('htve package utility')
         console.log('usage: package [patch | minor | -v | -f packagename]]')
      }
   }

})()
