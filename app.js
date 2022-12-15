const express = require('express')
const reload = require('reload')
const http = require('http')
const fs = require('fs')
const app = express()
const port = 3000

const server = http.createServer(app)

app.set('view engine', 'ejs')
app.set('views', 'public/views')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({
  extended: true
})) //form post body

app.get('/', (req, res) => { 
  const config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'))
  const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'))
  posts.sort((a, b) => b.date.localeCompare(a.date));

  res.render('pages/home', {
    config: config,
    title: 'Home',
    posts: posts.slice(0, 4)
  })
})

app.get('/posts', (req, res) => { 
  const config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'))
  const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'))

  res.render('pages/posts', {
    config: config,
    title: 'Explore',
    posts: posts,
    param: ''
  })
})

app.post('/search', (req, res) => { 
  const config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'))
  const string = req.body.search;
  const postsJSON = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'))
  const posts = postsJSON.filter(
    post => 
      post.content.toLowerCase().includes(string.toLowerCase()) ||
      post.title.toLowerCase().includes(string.toLowerCase()) ||
      config.authors[post.author].toLowerCase().includes(string.toLowerCase()) 
  )
  
  res.render('pages/posts', {
    config: config,
    title: 'Riga',
    posts: posts,
    param: posts.length + ' résultat' + (posts.length > 1 ? 's':'') + ' pour la recherche : ' + string
  })
})

app.get('/post/:post', (req, res) => { 
  const config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'))
  const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'))
  let post = posts.filter(post => post.title == decodeURIComponent(req.params.post))

  if
   (post.length == 0) {
    res.redirect('/post/'+posts[0].title) 
  }

  res.render('pages/view', {
    config: config,
    title: post[0].title,
    post: post[0]
  })
})

app.get('/gallery', (req, res) => { 
  const images = JSON.parse(fs.readFileSync('data/images.json', 'utf8'))
  res.render('pages/gallery', {
    title: 'Gallery',
    images: images
  })
})

app.get('/about', (req, res) => { 
  res.render('pages/about', {
    title: 'About us'
  })
})

/*app.get('/*', function(req, res) {
  res.redirect('/')
})*/

server.listen(port, () => {
  console.log('App listening at http://localhost:'+port)
})

reload(app)