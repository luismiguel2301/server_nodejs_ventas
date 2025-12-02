const mysql = require("mysql2")

//configuracion para la conexion a la base de datos
const dbConfig = {
    host:"localhost",
    user:"root",
    password: "",
    database:"db_inv_ti"
}

const db = mysql.createConnection(dbConfig)

//conectar a la base de datos
db.connect((err)=>{
    if(err){
        console.error("Error al conectarse a la base de datos: ", err);
        return;
    }

    console.log("Conectado a la base de datos MYSQL")
})

module.exports = db