const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

//crear instancia de express
const app = express();
app.use(express.json())

//permitir solicitudes de otros dominios
app.use(cors())

//middleware para analizar json
//app.use(bodyParser.json())

const usuariosRoutes = require("./usuariosRoutes")
const areasRoutes = require("./areasRoutes")
const equiposRoutes = require("./equiposRoutes")
const productosRoutes = require("./productosRoutes")
const ventasRoutes = require("./ventasRoutes")
//middleware para analizar json

//app.use(bodyParser.json())

//importar el uso de las rutas
app.use("/",usuariosRoutes)
app.use("/",areasRoutes)
app.use("/",equiposRoutes)
app.use("/",productosRoutes)
app.use("/",ventasRoutes)

//iniciar el servidor
const port = 10000
app.listen(port, () =>{
    console.log(`Servidor en http://localhost:${port}`)
})
