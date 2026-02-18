import requestHandler from '../server/index.mjs'

export default async function handler(req, res) {
  return requestHandler(req, res)
}
