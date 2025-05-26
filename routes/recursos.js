import express from 'express'
import fs from 'fs'

const routes = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("./recursosDb.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error); 
    }
}; 

const writeData = (data) => {
    try {
        fs.writeFileSync("./recursosDb.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

routes.get('/',(req, res) =>{
    const user = {nombre: "william G"}
    const htmlMessage =  `<a href="http://localhost:3000/">Home</a>`;
    const data = readData()
    res.render("recursos",{user, htmlMessage, data})
});


routes.get('/:id',(req, res) =>{
    const data = readData()
    const user = {nombre: "william G"}
    const id = parseInt(req.params.id);
    const recurso = data.recursos.find((recurso) => recurso.id === id)
    res.render("recursoDetalle",{user, recurso})
});


export default routes;