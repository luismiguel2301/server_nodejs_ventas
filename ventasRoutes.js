const express = require("express")
const router = express.Router()
const db = require("./conexion")
const { route } = require("./usuariosRoutes")

//ruta para obtenr todas las ventas
/* router.get("/venta",(req,res)=>{
    db.query("SELECT * FROM ventas",(err,results)=>{
        if(err){
            return res.status(500).send("Error al obtener la consulta")
        }

        res.json(results)
    })
}) */

//ruta para obtener las ventas en un 
router.get("/ventas",(req,res)=>{
    const {inicio,fin}=req.body

    if(!inicio || !fin){
        return res.status(400).send("Las fechas son requeridas")
    }
    const fechaInicio = new Date(inicio)
    const fechaFin = new Date(fin)

    //validamos que las fechas sean correctas
    if(isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())){
        return res.status(400).send("Las fechas proporcionadas no son validas")
    }

    //asegura que la fecha de inicio no sea mayor a la fecha final
    if(fechaInicio > fechaFin){
        return res.status(400).send("La fecha de inicio no puede ser mayos a la fecha final")
    }

    //formateando fechas
    const fechaInicioStr = fechaInicio.toISOString().split('T')[0]
    const fechaFinStr = fechaFin.toISOString().split('T')[0]

    const query = `SELECT * FROM ventas WHERE fecha_venta BETWEEN ? AND ?`

    db.query(query,[fechaInicioStr,fechaFinStr],(err,results)=>{
        if(err){
            console.error(err)
            return res.status(500).send("Error al obtener las ventas")
        }
        res.status(200).send(results)
    })
})

//ruta para agregar registro de venta
//codigo-producto-pre_publico,cantidad,total_totalventa_usuario
router.post("/ventas",(req,res)=>{
    const {venta} = req.body

    if(!venta){
        return res.status(400).send("No se recibio la venta")
    }

    const fecha = new Date();

    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2,"0")
    const dia = String(fecha.getDate()).padStart(2,"0")
    const id_venta = Date.now().toString()

    //formato deseado
    const fecha_venta = `${anio}-${mes}-${dia}`

    //separar los productos y el total de la venta
    const productosString = venta.split("_")
    const productos =productosString[0]

    const total_venta=parseFloat(productosString[1])

    const vendedor = productosString[2]

    //validad el totaol de la venta
    if(isNaN(total_venta)){
        return res.status(400).send("El total de la venta no es valido")
    }

    //insertar la venta en la base de dtos
    const query = `INSERT INTO ventas (id_venta,productos,total_venta,fecha_venta,vendedor) VALUES (?,?,?,?,?)`

    db.query(query, [id_venta,productos,total_venta,fecha_venta,vendedor],(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).send("Error al registrar la venta")
        }

        res.status(201).send({
            mensaje:"Venta registrada ccon exito",
            id_venta
        })
    })

})

module.exports = router