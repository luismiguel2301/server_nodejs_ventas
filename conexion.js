const mysql = require("mysql2")

//configuracion para la conexion a la base de datos
const dbConfig = {
    host:"https://sv11.byethost11.org:2083/cpsess8591958046/3rdparty/phpMyAdmin/index.php",
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
