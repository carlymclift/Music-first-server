const express = require('express')
const app = express()
const music = require('./data')
app.use(express.json())
const { response, request } = require('express')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Music Box'
app.locals.music = music.music

app.get('/', (request, response) => {
  response.send('Hello! Welcome to music!')
})

app.get('/api/v1/music', (request, response) => {
  response.status(200).json(app.locals.music);
})

app.get('/api/v1/music/:id', (request, response) => {
  const id = request.params.id
  const foundSong = app.locals.music.find(song => song.id === +id)
  if (!foundSong) {
    response.status(404).json({
        error: `A song with an id of ${id} doesn't exist`
    })
  }
  response.status(200).json(foundSong)
})

app.delete('/api/v1/music/:id', (request, response) => {
  const id = parseInt(request.params.id)
  const foundSong = app.locals.music.find(song => song.id === id);
  if (!foundSong) {
    return response.status(404).json({error: `Cannot find song with id of ${id} to delete`});
  }
  app.locals.music = app.locals.music.filter(song => song.id !== id);
  response.sendStatus(204).json(app.locals.music);
})

app.post('/api/v1/music', (request, response) => {
  const requiredProperties = ['name', 'artist', 'link', 'releaseYear']

  for (let property of requiredProperties) {
    if(!request.body[property]) {
      return response.status(422).json({error: `Cannot POST: missing property ${property} on request`});
    }
  }
  const { name, artist, link, releaseYear } = request.body;
  let id = Date.now()
  const newSong = { name, artist, link, releaseYear, id }
  app.locals.music.push(newSong)
  response.status(201).json(newSong) 
})

// the line below could be replaced with:
// app.listen(3000, () => { 
// it's saying that app need to listen to changes/requests
// being made on port 3000 once a connection has been made
// BUT we want this to be dynamic so that is can listen 
// on ports BESIDES 3000 if there is one provided
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`)
})
