import express from 'express'
import fs from 'fs'

const routes = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("./usuariosDb.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error); 
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./usuariosDb.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

routes.get('/usuarios',(req, res) =>{
    const user = {nombre: "william g"}
    const htmlMessage = "lista de usuarios"
    const data = readData()
    res.render("usuarios",{user, htmlMessage, data})
});


routes.get('/usuarios/:id',(req, res) =>{
    const data = readData()
    const user = {nombre: "william G"}
    const id = parseInt(req.params.id);
    const recurso = data.recursos.find((recurso) => recurso.id === id)
    routes.render("usuariosDetalle",{user, recurso})
});


export default routes;