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
    try {
        const { id, nombre, email } = JSON.parse(event.body); // Asume que el cuerpo de la solicitud contiene el ID, nombre y email del usuario a actualizar
        const result = await new Promise((resolve, reject) => {
            const query = 'UPDATE Usuarios SET nombre = ?, email = ? WHERE id = ?';
            connection.query(query, [nombre, email, id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (result.affectedRows > 0) {
            response = {
                statusCode: 200,
                body: JSON.stringify({ message: "Usuario actualizado con éxito" }),
            };
        } else {
            response = {
                statusCode: 404,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }
    } catch (error) {
        console.error(error);
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al actualizar el usuario" }),
        };
    }

    return response;
};
