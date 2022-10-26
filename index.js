//Para usar el .gitignore
//primero tines que inciar un repositorio

// importar las librerias que vamos a usar
// http, path, fs (leyendo archivos)

const http = require("http");
// sirve para crear un servidor
// y usar los metodos pertinentes
const path = require("path");
const fs = require("fs/promises");

//Quiero leer data.json

const PORT = 3001;

const app = http.createServer(async (request, response) => {
  // aqui va el código para el funcionamiento
  // obtener la ruta absoluta de data.json

  // necesito saber que metodo se esta realizando
  const method = request.method;
  const url = request.url;
  // todos los verbos / metodos en peticiones htttp
  // van en mayusculas
  if (url === "/tasks") {
    const jsonPath = path.resolve("./data.json");
    const jsonFile = await fs.readFile(jsonPath, "utf8");
    if (request.method === "GET") {
      response.setHeader("Content-Type", "application/json");
      response.write(jsonFile);
    }

    if (method === "POST") {
      // que necesitamos leer para obtener la infromación
      // eventEmmiter
      //addEventListener
      request.on("data", (data) => {
        // recibo un json
        // necesito agregar la data a data.json
        // necesito obetener la informacion     *
        // necesito escribir en el archivo
        // primero leer el archivo            *
        // necesito la ruta del archivo     *
        // escribir en el archivo
        const newTask = JSON.parse(data);
        const arr = JSON.parse(jsonFile);
        arr.push(newTask);
        fs.writeFile(jsonPath, JSON.stringify(arr));
      });
      response.statusCode = 201;
      response.statusMessage = 'Tarea creada';
    }
    if(method === "PUT") {
      request.on("data", (data) => {
        const {id, status} = JSON.parse(data);
        const arr = JSON.parse(jsonFile);
        const taskIndex = arr.findIndex((task) => task.id === id);
        arr[taskIndex].status = status;
        fs.writeFile(jsonPath, JSON.stringify(arr));
      });
        response.statusCode = 204;
        response.statusMessage = 'Tarea actualizada';
    }
    if(method === "DELETE") {
      request.on("data", (data) => {
        const arr = JSON.parse(jsonFile);
        const {id} = JSON.parse(data);
        const filteredTasks = arr.filter((task) => task.id !== id);
        fs.writeFile(jsonPath, JSON.stringify(filteredTasks));
      });
      response.statusMessage = 'Tarea borrada';
    }
  }
  response.end();
});

app.listen(PORT);

console.log("servidor corriendo");