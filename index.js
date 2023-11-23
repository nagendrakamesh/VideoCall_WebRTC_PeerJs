const express = require('express')
const fs = require('fs');
const app = express()
const server = require('https').createServer({
    cert : fs.readFileSync('certificates/server.crt'),
    key : fs.readFileSync('certificates/key.pem'),
    ca : fs.readFileSync('certificates/ca-certificate.crt')
}, app)
// const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect("/100")
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId : req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(5000)