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

routes.get('/',(req, res) =>{
    const user = {nombre: "william g"}
    const htmlMessage =  `<a href="http://localhost:3000/">Home</a>`;
    const data = readData()
    res.render("usuarios",{user, htmlMessage, data})
});


routes.get('/:id',(req, res) =>{
    const data = readData()
    const user = {nombre: "william G"}
    const id = parseInt(req.params.id);
    const usuario = data.recursos.find((usuario) => usuario.id === id)

    if (!usuario) {
        return res.status(404).send("Usuario no encontrado");
    }

    res.render("usuariosDetalle", { user, usuario });
});


export default routes;