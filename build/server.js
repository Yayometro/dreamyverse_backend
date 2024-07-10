import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
const app = express();
//Const
app.set('port', process.env.PORT || 3503);
//Middlawares:
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));
app.use(cors());
//Variables Globales
//Variables Estaticas:
app.use(express.static(path.join(__dirname, 'public')));
// Routes:
app.get('/', (_req, res) => {
    res.status(201).send(`<h1>Iniciado</h1>`);
});
app.get('/home', (_req, res) => {
    res.status(201).send(`<h1>Home</h1>`);
});
// app.use(dreamsRouter)
// app.use(usersRouter)
// app.use(commentsRouter)
export default app;
