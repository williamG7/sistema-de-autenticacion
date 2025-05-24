import express from 'express'
import fs from 'fs'

const routes = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("./reservasDb.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error); 
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./reservasDb.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

routes.get('/reservas',(req, res) =>{
    const user = {name: "william g"}
    const htmlMessage = "lista de reservas"
    const data = readData()
    res.render("reservas",{user, htmlMessage, data})
});


routes.get('/reservas/:id',(req, res) =>{
    const data = readData()
    const user = {name: "william G"}
    const id = parseInt(req.params.id);
    const recurso = data.recursos.find((recurso) => recurso.id === id)
    routes.render("reservasDetalle",{user, recurso})
});


export default routes;