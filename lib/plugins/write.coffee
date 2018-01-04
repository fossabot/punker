path = require 'path'
fs   = require 'fs-extra'

module.exports = (punk) ->
	reporter = punk.reporter
	plugin = {}
	plugin.pipes =
		write: (setting) ->

			# PIPE #
			(files, cond) ->
				workdir = setting.workdir or cond.workdir or './'

				if (files.length is 1) and (setting.outFile?)

					if setting.outFile[0] is punk.s.entry
						setting.outFile = setting.entry

					await punk.d.eachAsync setting.outFile, (pth) ->
						out = path.resolve   workdir, pth
						to  = punk.d.getExt  out
						rg  = punk.d.getType files[0]

						if to isnt rg
							files = await punk.p.to(to)(files, cond)

						await fs.remove out
						await fs.writeFile out, files[0].contents

				else if files.length is 0
				else if (setting.outDir or setting.outDirectory)
					out = (setting.outDir or setting.outDirectory)
					# if there are multiple files, write they to directory, which specified in setting.outDir
					await punk.d.eachAsync files, (file) ->
						# absolute path
						realPath = path.resolve(workdir, out, file.path)

						await fs.remove realPath
						await fs.mkdirp path.dirname realPath
						await fs.writeFile realPath, file.contents
						await return
				files

		outFile: (setting) ->
			(files, cond) ->
				await plugin.pipes.write(outFile: setting)(files, cond)

		outDir: (setting) ->
			(files, cond) ->
				await plugin.pipes.write(outDir: setting)(files, cond)

	plugin.pipes.outDirectory = plugin.pipes.outDir
	plugin.pipes.dest = plugin.pipes.write

	plugin
