const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Aquí asumimos que tu script está en algún lugar dentro de la carpeta 'lambda'
// y que el archivo .env está en la raíz de tu proyecto.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Ajusta tus configuraciones como antes
const config = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME
};

const connection = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
});

exports.handler = async (event) => {
    let response;

    console.log(event.body);
    console.log(connection);

    try {
        const { nombre, email } = JSON.parse(event.body);
        const result = await new Promise((resolve, reject) => {
            const query = 'INSERT INTO Usuarios (nombre, email) VALUES (?, ?)';
            connection.query(query, [nombre, email], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        
        response = {
            statusCode: 200,
            body: JSON.stringify({ message: "Usuario creado con éxito", id: result.insertId }),
        };
    } catch (error) {
        console.error(error);
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al crear el usuario" }),
        };
    }
    
    return response;
};