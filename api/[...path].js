export default async function handler(req, res) {
  try {
    const module = await import('../server/index.mjs')
    return module.default(req, res)
  } catch (error) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        message: error?.message || 'Internal server error',
      }),
    )
  }
}
