import { describe, expect, test } from 'vitest'
import { jsoncParse } from '../src'

describe('json test.', () => {
  test('jsoncParse test.', async () => {
    expect(jsoncParse(`{}`)).toEqual({})
    expect(jsoncParse(`{a:"1"}`)).toEqual({ a: '1' })
    expect(jsoncParse(`{a:"1"}}`)).toEqual({})
  })
})
