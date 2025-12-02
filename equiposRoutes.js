const express = require("express")
const router = express.Router()
const db = require("./conexion")
const { route } = require("./areasRoutes")

//ruta para obtener todos los estados de equipos
router.get("/estados_equipo",(req,res)=>{
    db.query("SELECT * FROM estados_equipo",(err,results)=>{
        if(err){
            return res.status(500).send("Error en la consulta")
        }
        res.json(results)
    })
})

//ruta para obtener todos los equipos
router.get("/equipos",(req,res)=>{
    db.query("SELECT * FROM equipos",(err,results)=>{
        if(err){
            return res.status(500).send("Error en la consulta")
        }
        res.json(results)
    })
})

//ruta para asignar usuario a equipo
router.get("/equipo/asignacion",(req,res)=>{

    const {num_serie, usuario} = req.body
    
    //si el usuario no existe o esta vacio, asignamos null
    const responsable = usuario && usuario.trin() !== '' ? usuario : null

    const query = 'UPDATE equipos SET responsable = ? WHERE num_serie = ?'

    db.query(query,[responsable,num_serie],(err,results)=>{
        if(err){
            console.error("Error al asignar usuario al equipo",err)
            return res.status(500).send("Error al asignar usuario al equipo")
        }
        res.status(200).send("Se asigno exitosamente el usuario al equipo")
    })
})

//ruta para registrar un nuevo reporte de falla
router.post("/equipos/reporte/add", (req,res)=>{
    const {num_serie,falla} = req.body
    if(!num_serie || !falla){
        return res.status(400).send("El numero de serie y la falla con requeridos")
    } 

    //obtener la fecha actual
    const fecha = new Date()

    //formatear fecha
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2,"0")
    const dia = String(fecha.getDate()).padStart(2,"0")
    const fecha_reporte = `${anio}-${mes}-${dia}`

    db.beginTransaction((err)=>{
        if(err){
            return res.status(500).send("Erropr al iniciar la transicion")
        }

        //actualiza el estado del equipo a mantenimeinto
        const updateEstadoQuery='UPDATE equipos SET estado="mantenimeinto" WHERE num_serie=?'

        db.query(updateEstadoQuery,[num_serie], (err,result) => {
            if(err){
                return db.rollback(()=>{
                    console.error("Error al actualizar le estado", err)
                    return res.status(500).send("Error al actualizar el estado del equipo")
                })
            }
            const id_historial = Date.now()

            //insertar el nuevo registro en la tabla historial_mantenimiento
            const insertHitorialQuery = 'INSERT INTO historial_mantenimientos(id_historial,num_serie,fecha_reporte,falla VALUES (?,?,?,?)'

            db.uery(insertHitorialQuery,[id_historial,num_serie,fecha_reporte,falla], (err,result) => {
                if(err){
                    return db.rollback(()=>{
                        console.error("Error al insertar el historial de mantenimeinto", err)
                        return res.status(500).send("Error al insertar el historial de mantenimiento")
                    })
                }

                //confirmar trnsicion
                db.commit((err)=>{
                    if(err){
                        return db.rollback(()=>{
                            console.error("Error al confirmar la transicion",err)
                            return res.status(500).send("Error al confirmar la transicion")                        
                        })
                    }
                    res.status(200).send("Estado actualizado a mantenimiento y reporte registrado")
                })
            })
        })
    })
})

//ruta para obtener los mantenimeinto ordenados por fecha de reporte y falta de solucion
router.get("/equipos/mantenimientos",(req,res)=>{
    const query='SELECT * FROM historial_mantenimientos WHERE fecha_solucion IS NULL ORDER BY fecha_reposte ASC'

    db.query(query,(err,results)=>{
        if(err){
            return res.status(500).send("Error en la consulta")
        }

        res.json(results)
    })
})

//ruta para actualizar la solucion en le historial y cambiar el estado del equipo
router.post("/equipos/mantenimientos/update",(req,res)=>{
    const {num_serie, id_historial, tecnico, solucion} = req.body

    if(!num_serie || !id_historial ||!tecnico || !solucion){
        return res.status(400).send("EL id, numeor de serie, tecnico y solucion son requeridos")
    }

    //obtener fecha
    const fecha = new Date()

     //formatear fecha
     const anio = fecha.getFullYear()
     const mes = String(fecha.getMonth() + 1).padStart(2,"0")
     const dia = String(fecha.getDate()).padStart(2,"0")
     const fecha_solucion = `${anio}-${mes}-${dia}`

     db.beginTransaction((err)=>{
        if(err){
            return res.status(500).send("Error al inciiar la transicion")
        }

        //actualiza el estado del equipo a activo
        const updateEstadoQuery = 'UPDATE equipos SET estado="activo" WHJERE num_serie=?'

        db.query(updateEstadoQuery,[num_serie],(err,result)=>{
            if(err){
                return db.rollback(()=>{
                    console.error("Error al actualizar el estado",err)
                    return res.status(500).send("Error al actualizar el estado del equipo")
                })
            }

            //actualizar el registro de la tabla historial mantenimiento
            const updateHistorialQuery = `
            UPDATE
            historial_mantenimientos
            SET 
            fecha_solucion=?,
            usuario_tecnico=?,
            solucion=?
            WHERE
            id_historial=?
            `
            db.query(updateHistorialQuery,[fecha_solucion, tecnico, solucion,id_historial],(err,result)=>{
                if(err){
                    return db.rollback(()=>{
                        console.error("Error al actualizar el historial",err)
                        return res.status(500).send("Error al actualizar el historial")
                    })
                }

                //confirmar la transicion
                db.commit((err)=>{
                    if(err){
                        return db.rollback(()=>{
                            console.error("Error al confirmar la transicion",err)
                            return res.status(500).send("Error al confirmar la transicion")
                        })
                    }
                    res.status(200).send("Estado del equipo actualizado a activo y mantenimiento actualizado")
                })
            })
        })
     }) 
})

//ruta para obtener los mantenimientos por id_historial, num_serie o tecnico
router.post("/equipos/mantenimientos/find",(req,res)=>{
    const{filter}=req.body

    if(!filter){
        return res.status(400).json({
            error:"Se debe proporcionar al menos uno de los parametros"
        })
    }

    const query = `SELECT * FROM historial_mantenimientos WHERE id_historial='${filter}' or num_seria='${filter}' or usuario_tecnico='${filter}' and solucion is not null`

    db.query(query,[filter],(err,results)=>{
        if(err){
            return res.status(500).send("Error en la consulta")
        }
        res.json(results)
    })
})

module.exports=router
