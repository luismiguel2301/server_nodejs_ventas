const mysql = require("mysql2")

//configuracion para la conexion a la base de datos
const dbConfig = {
    const DB_SERVER="31.22.4.11";
/* const DB_NAME="dem";
const DB_USER="root";
const DB_PASS=""; */
const DB_NAME="curmayha_inventario";
const DB_USER="curmayha_cur";
const DB_PASS="luis2301+-";

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
