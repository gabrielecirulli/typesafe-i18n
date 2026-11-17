import { mkdtemp, readFile, rm, writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { transpileWithTsc } from './parse-language-file.mjs'

const test = suite('parse-language-file')

const requireFromHere = createRequire(join(process.cwd(), 'package.json'))

// 'typescript-6' and 'typescript-7' are aliases for newer releases. Version 7 has no JavaScript compiler API.
// The tests run in 'packages/generator', which has a 'tsconfig.json', like a project that calls the generator.
const packages = ['typescript', 'typescript-6', 'typescript-7']

packages.forEach((name) =>
	test(`transpileWithTsc emits the locale file as JavaScript with '${name}'`, async () => {
		const typescriptPath = resolve(requireFromHere.resolve(`${name}/package.json`), '..')
		const directory = await mkdtemp(join(tmpdir(), 'typesafe-i18n-'))
		const languageFilePath = join(directory, 'index.ts')
		const tempPath = join(directory, 'out')
		await writeFile(
			languageFilePath,
			`const en = { hi: 'Hello {name:string}' } satisfies Record<string, string>\nexport default en\n`,
		)

		transpileWithTsc(typescriptPath, languageFilePath, tempPath)

		const output = await readFile(join(tempPath, 'index.js'), 'utf8')
		await rm(directory, { recursive: true })

		assert.ok(output.includes(`'Hello {name:string}'`), output)
		assert.not.ok(output.includes('satisfies'), output)
	}),
)

test.run()
