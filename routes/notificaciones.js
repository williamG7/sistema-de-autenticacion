import express from 'express'
import fs from 'fs'

const routes = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("./notificacionesDb.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error); 
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./notificacionesDb.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

routes.get('/',(req, res) =>{
    const user = {name: "william g"}
    const htmlMessage = `<a href="http://localhost:3000/">Home</a>`;
    const data = readData()
    res.render("notificaciones",{user, htmlMessage, data})
});


routes.get('/:id',(req, res) =>{
    const data = readData()
    const user = {name: "william G"}
    const id = parseInt(req.params.id);
    const notificacion = data.notificaciones.find((notificacion) => notificacion.id === id)

     if (!notificacion) {
        return res.status(404).send("Notificacion no encontrada");
    }

    res.render("notificacionesDetalle", { user, notificacion });
});


export default routes;