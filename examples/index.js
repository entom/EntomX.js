const server = require('../server')
const app = server()
const port = process.env.PORT || 3000

const middle = (req, res, next) => {
  console.log('middle ---')
  next()
}

app.get('/user/:id/profile', (req, res) => {
  console.log('user-get-profile')
  res.html('<h1>Profile</h1>')
})

app.get('/user/:id', (req, res) => {
  console.log('user-get')
  res.json({status: 'ok'})
})

app.post('/user', (req, res) => {

})

app.get('/user', middle, (req, res) => {
  res.json({status: 'ok', page: 'user'})
})

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
