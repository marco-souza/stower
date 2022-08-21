import { assert, assertArrayIncludes } from 'testing/asserts.ts'
import { logging, sh } from '@tests/mocks.ts'

import { StowService } from './stow.ts'
import { returnsNext, stub, spy, assertSpyCall, assertSpyCalls } from 'testing/mock.ts'

const encoder = new TextEncoder()

const fileContent = encoder.encode(`
config:
  - test

folders:
  - folder

links:
  dest: source
`)

stub(Deno, 'readFileSync', returnsNext([fileContent]))
const logDebugSpy = spy(logging.debug)

Deno.test("show create instance", async () => {
  const instance = StowService.create({
    file: 'test',
    logging,
    sh,
  })

  assert(instance != null)
  assertSpyCalls(logDebugSpy, 0)
  assertArrayIncludes(instance.config.config, ['test'])
  assertArrayIncludes(instance.config.folders, ['folder'])
  assertArrayIncludes(Object.entries(instance.config.links).flatMap(i => i), ['dest', 'source'])
})
