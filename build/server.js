"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
//routes:
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const dreams_routes_1 = __importDefault(require("./routes/dreams.routes"));
const comments_routes_1 = __importDefault(require("./routes/comments.routes"));
const reactions_routes_1 = __importDefault(require("./routes/reactions.routes"));
const follows_routes_1 = __importDefault(require("./routes/follows.routes"));
const searchs_routes_1 = __importDefault(require("./routes/searchs.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const conversations_routes_1 = __importDefault(require("./routes/conversations.routes"));
const messages_routes_1 = __importDefault(require("./routes/messages.routes"));
const app = (0, express_1.default)();
//Const
app.set('port', process.env.PORT || 3503);
//Middlawares:
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ type: "*/*" }));
app.use((0, cors_1.default)());
//Variables Globales
//Variables Estaticas:
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes:
app.use(users_routes_1.default);
app.use(dreams_routes_1.default);
app.use(comments_routes_1.default);
app.use(reactions_routes_1.default);
app.use(follows_routes_1.default);
app.use(searchs_routes_1.default);
app.use(notifications_routes_1.default);
app.use(conversations_routes_1.default);
app.use(messages_routes_1.default);
app.get('/', (_req, res) => {
    res.status(201).send(`<h1>Iniciado</h1>`);
});
// app.use(dreamsRouter)
// app.use(commentsRouter)
exports.default = app;
