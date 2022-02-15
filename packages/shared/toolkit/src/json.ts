import strip from 'strip-json-comments'

// replace JSON.parse
export function jsoncParse(data: string) {
  try {
    return new Function('return ' + strip(data).trim())()
  } catch {
    return {}
  }
}
