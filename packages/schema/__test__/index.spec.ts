import { test, describe, expect } from 'vitest'
import path from 'path'
import fs from 'fs-extra'

describe('schema test', () => {
  test('index.json is exits.', () => {
    const schema = path.resolve(__dirname, '../index.json')
    const content = fs.readJSONSync(schema)
    expect(content).toMatchSnapshot()
  })
})
