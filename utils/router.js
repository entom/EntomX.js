const parse = require('./url-to-regex')
const queryParse = require('./query-params')

const router = () => {
  let routeTable = {}
  let parseMethod = 'json'

  const processMiddleware = (middleware, req, res) => {
    if (!middleware) {
      return new Promise((resolve) => resolve(true))
    }

    return new Promise((resolve) => {
      middleware(req, res, function () {
        resolve(true)
      })
    })
  }

  const registerPath = (path, cb, method, middleware) => {
    if (!routeTable[path]) {
      routeTable[path] = {}
    }
    routeTable[path] = {...routeTable[path], [method]: cb, [method + '-middleware']: middleware}
  }

  const readBody = (req) => {
    return new Promise((resolve, reject) => {
      let body = ''
      req.on('data', (chunk) => {
        body += '' + chunk
      })
      req.on('end', () => {
        resolve(body)
      })
      req.on('error', (err) => {
        reject(err)
      })
    })
  }

  const createResponse = (res) => {
    res.send = (message) => res.end(message)
    res.json = (message) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(message))
    };
    res.html = (message) => {
      res.setHeader('Content-Type', 'text/html')
      res.end(message)
    }
    return res
  }

  const handleRequest = async (req, res) => {
    const routes = Object.keys(routeTable)
    let match = false

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const parsedRoute = parse(route)
      if (new RegExp(`^${parsedRoute}$`).test(req.url) && routeTable[route][req.method.toLowerCase()]) {
        let cb = routeTable[route][req.method.toLowerCase()]
        let middleware = routeTable[route][`${req.method.toLowerCase()}-middleware`]

        const m = req.url.match(new RegExp(parsedRoute))

        req.params = m.groups
        req.query = queryParse(req.url)
        let body = await readBody(req);
        if (parseMethod === 'json') {
          body = body ? JSON.parse(body) : {};
        }
        req.body = body;

        const result = await processMiddleware(middleware, req, createResponse(res));
        if (result) {
          cb(req, res);
        }

        match = true;
        break
      }
    }
    if (!match) {
      res.statusCode = 404
      res.end("Not found")
    }
  }

  return {
    handleRequest,
    registerPath
  }
}

module.exports = router
