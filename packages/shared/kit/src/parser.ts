import stripJsonComments from 'strip-json-comments'
// replace JSON.parse
export function jsoncParse(data: string) {
  try {
    // eslint-disable-next-line
    return new Function('return ' + stripJsonComments(data).trim())()
  } catch {
    return {}
  }
}
