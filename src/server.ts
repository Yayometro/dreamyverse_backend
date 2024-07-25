import express from 'express'
import path from 'path'
import morgan from 'morgan'
import {} from 'dotenv/config'
import cors from 'cors'
//routes:
import usersRouter from './routes/users.routes'
import dreamsRouter from './routes/dreams.routes'
import commentsRouter from './routes/comments.routes'
import reactionsRouter from './routes/reactions.routes'
import followsRouter from './routes/follows.routes'
import searchRouter from './routes/searchs.routes'
import notifyRouter from './routes/notifications.routes'
import conversationRouter from './routes/conversations.routes'
import messageRouter from './routes/messages.routes'

const app = express()

//Const
app.set('port', process.env.PORT || 3503)


//Middlawares:
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json({type: "*/*"}))
app.use(cors({
    origin: '*', // allow any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allow meth
    allowedHeaders: ['Content-Type', 'Authorization'] // allow headers
  }));

//Variables Globales


//Variables Estaticas:
app.use(express.static(path.join(__dirname, 'public')))


// Routes:
app.use(usersRouter)
app.use(dreamsRouter)
app.use(commentsRouter)
app.use(reactionsRouter)
app.use(followsRouter)
app.use(searchRouter)
app.use(notifyRouter)
app.use(conversationRouter)
app.use(messageRouter)

app.get('/', (_req, res) => {
    res.status(201).send(`<h1>Iniciado</h1>`)
})
// app.use(dreamsRouter)
// app.use(commentsRouter)




export default app