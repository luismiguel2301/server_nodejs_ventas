const express = require("express")
const router = express.Router()
const db = require("./conexion")

//ruta para obtener los productos de la tabla productos
router.get("/productos",(req,res)=>{
    const query = 'SELECT * FROM productos'

    db.query(query,(err,results)=>{
        if(err){
            return res.status(500).send("Error en la consulta")
        }
        res.json(results)
    })
})

//ruta para obtener el producto usando el codigo del mismo
router.get("/produto",(req,res)=>{
    const {codigo} = req.query

    const query = 'SELECT codigo, nombre.pre_publico FROM productos WHERE codigo=?'


    db.query(query,[codigo],(err,results)=>{
        if(err){
            returnres.status(500).send("Error al obtener el producto")
        }
        res.json(results)
    })
})

//ruta para agregar un nuevo producto
router.post("/productos",(req,res)=>{
    const {codigo,nom_producto,desc_producto,pre_publico,pre_proveedor,existencias}=req.body

    if(!codigo || !nom_producto || !desc_producto || !pre_publico || !pre_proveedor || !existencias){
        return res.status(400).send("Todos los cmapos son requeridos")
    }
    const query = `INSERT INTO productos(codigo,nom_producto,desc_producto,pre_publico,pre_publico,existencias) VALUES (?,?,?,?,?,?)`

    db.query(query,[codigo,nom_producto,desc_producto,pre_publico,pre_proveedor,existencias],(err,results)=>{
        if(err){
            console.error("Error l agregar el producto: ",err)
            return res.status(500).send("Error al agregar el producto")
        }
        res.status(200).send({
            codigo,nom_producto,desc_producto,pre_publico,pre_proveedor,existencias
        })
    })
})

//ruta para editar un produto
router.put("/produtos/:codigo",(req,res)=>{
    const {codigo} =  req.params
    const {nom_producto,desc_producto,pre_publico,pre_proveedor,existencias} = req.body

    const query = 'UPDATE productos SET nom_producto=?, desc_producto=?, pre_publico=?, pre_provvedor=?, existencias=?'

    db.query(query,[nom_producto,desc_producto,pre_publicon,pre_proiveedor,existencias],(err,results)=>{
        if(err){
            return res.status(500).send("Error al actualizar el producto")
        }
        res.send("Producto actualizado")
    })
})

//ruta para eliminar un producto
router.delete("/productos/:producto",(req,res)=>{
    const {producto}= req.params

    const query=`DELETE FROM productos WHERE codigo=?`

    db.query(query,[producto],(err,results)=>{
        if(err){
            return res.status(500).send("Error al eliminar el producto")
        }

        res.send("Producto eliminado")
    })
})

module.exports = router