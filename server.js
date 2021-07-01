const http = require('http')
const router = require('./utils/router')

const server = () => {
  const routing = router()
  let srv = null;

  srv = http.createServer(async (req, res) => {
    await routing.handleRequest(req, res)
  })

  return {
    get: (path, ...rest) => {
      if (rest.length === 1) {
        routing.registerPath(path, rest[0], 'get')
      } else {
        routing.registerPath(path, rest[1], 'get', rest[0])
      }
    },
    post: (path, ...rest) => {
      if (rest.length === 1) {
        routing.registerPath(path, rest[0], 'post');
      } else {
        routing.registerPath(path, rest[1], 'post', rest[0]);
      }
    },
    put: (path, ...rest) => {
      if (rest.length === 1) {
        routing.registerPath(path, rest[0], 'put');
      } else {
        routing.registerPath(path, rest[1], 'put', rest[0]);
      }
    },
    delete: (path, ...rest) => {
      if (rest.length === 1) {
        routing.registerPath(path, rest[0], 'delete');
      } else {
        routing.registerPath(path, rest[1], 'delete', rest[0]);
      }
    },
    listen: (port, cb) => {
      srv.listen(port, cb)
    },
    _server: srv
  }
}

module.exports = server;
