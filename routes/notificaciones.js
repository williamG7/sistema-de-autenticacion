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

routes.get('/notificaciones',(req, res) =>{
    const user = {name: "william g"}
    const htmlMessage = "lista de notificaciones"
    const data = readData()
    res.render("recursos",{user, htmlMessage, data})
});


routes.get('/notificaciones/:id',(req, res) =>{
    const data = readData()
    const user = {name: "william G"}
    const id = parseInt(req.params.id);
    const recurso = data.recursos.find((recurso) => recurso.id === id)
    routes.render("notificacionesDetalle",{user, recurso})
});


export default routes;