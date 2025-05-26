import express from "express";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

import recursosRoutes from './routes/recursos.js'
import notificacionesRoutes from './routes/notificaciones.js'
import reservasRoutes from './routes/reservas.js'
import usuariosRoutes from './routes/usuarios.js'

import { SECRET_JWT_KEY } from "./config.js";
import { UserRepository } from "./userRepository.js"

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public")); // carpeta para el css

app.set('view engine', 'ejs');// motor ejs
app.set('views', './views'); // archivos ejs

//manejo de sesiones
app.use((req, res, next) => {
    const token = req.cookies.access_token;
    req.session = { user: null };
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        req.session.user = data;
    } catch (error) {
        req.session.user = null;
    }
    next(); // Seguir a la siguiente ruta
})

// endopints
app.get('/', (req, res) => {
    const { user } = req.session
    res.render('home', user);
})

// Endopoint para login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await UserRepository.login({ username, password })
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_KEY,
            {
                expiresIn: '1h'
            })
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        })
            .send({ user, token })
    } catch (error) {
        res.status(401).send(error.message)
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const id = await UserRepository.create({ username, password });
        res.send({ id })
    } catch (error) {
        res.status(400).send(error.message)
    }
});

//endopint para logout
app.post("/logout", (req, res) => {
    res.clearCookie('access_token')
       .json({ message: 'logout completado' });
});

// endopoint protegido  
app.get("/protected", (req, res) => {
    const { user } = req.session;
    if (!user) return res.status(404).send('acceso no autorizado');
    res.redirect("/home");
});


app.get("/home", (req, res) => {
    res.render("home");
});

// rutas
app.use("/recursos", recursosRoutes);
app.use("/notificaciones", notificacionesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/reservas", reservasRoutes);

const puerto = 3000;
app.listen(puerto, () => {
    console.log("servidor iniciado en http://localhost:" + puerto);
});