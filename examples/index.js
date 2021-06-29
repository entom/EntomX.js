const server = require('../server')
const app = server()
const port = 3000

app.get('/user/:id', (req, res) => {
  console.log('user-get')
  res.json({status: 'ok'})
})

app.post('/user', (req, res) => {

})

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
