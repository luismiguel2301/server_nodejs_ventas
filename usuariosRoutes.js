const express = require("express")
const router = express.Router()
const db = require("./conexion")

router.post('/login', (req,res)=>{
    const {usuario,contrasena}=req.body

    if(!usuario || !contrasena){
        return res.status(400).send("Usuario y contraseña son requeridos")

    }
    //buscar el usuario
    db.query("SELECT * FROM usuarios WHERE usuario=? AND contrasena=?",[usuario,contrasena],(err,results)=>{
        if(err){
            return res.status(500).send("Error en la consulta ")
        }

        if(results.length === 0){
            return res.status(401).send("Usuario no encontrado")
        }

        const usuarioEncontrado = results[0]
        res.status(200).send({
            mensaje:"",
            usuario:{
                usuario:usuarioEncontrado.usuario,
                nombre:usuarioEncontrado.nombre,
                area:usuarioEncontrado.area,
                estado:usuarioEncontrado.estado
            }
        })
    })
})

//ruta para obtener todos los usuarios
router.get("/usuarios",(req,res)=>{
    db.query("SELECT usuario,nombre,area,correo,estado FROM usuarios",(err,results)=>{
        if(err){
            return res.status(500).send("Error en la consulta")
        }
        res.json(results)
    })
})

//ruta para agregar un nuevo usuario
router.post("/usuarios",(req,res)=>{
    const {usuario,contrasena,nombre,area,correo,estado}=req.body

    if(!usuario || !contrasena || !nombre || !area || !correo){
        return res.status(400).send("Todos los campos son requridos")
    }
    const query = `INSERT INTO usuarios(usuario,contrasena,nombre,area,correo,estado)
    VALUE(?,?,?,?,?,'activo')`

    db.query(query,[usuario,contrasena,nombre,area,correo,estado],(err,results)=>{
        if(err){
            console.error("Error al agregar el usuario: ",err)
            return res.status(500).send("Error al agregar el usuario")
        }
        res.status(200).send({
            usuario,contrasena,nombre,area,correo,estado
        })
    })
})

//ruta para editar un usuario
router.put("/usuarios/:usuario",(req,res)=>{
    const {usuario} = req.params
    const {nombre,contrasena,area,correo,estado}=req.body

    const query='UPDATE usuarios SET nombre=?, contrasena=?, area=?,correo=?, estado=? WHERE usuario=?'

    db.query(query,[nombre,contrasena,area,correo,estado],(err,results)=>{
        if(err){
            return res.status(500).send("Error al actualizar el usuario")
        }
        res.send("Usuario actualizado")
    })

})

//ruta para eliminar un usuario
router.delete("/usuarios/:usuario",(req,res)=>{
    const {usuario}=req.params

    const query= 'DELETE FROM usuarios WHERE usuario=?'

    db.query(query,[usuario],(err,results)=>{
        if(err){
            return res.status(500).send("Error al eliminar el usuario")
        }
        res.send("Usuario eliminado")
    })

})

module.exports= router