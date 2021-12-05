require("dotenv").config();
const bigInt = require("./bigInt");
const crypto = require("crypto");
const app = require("express")();
// Servidor HTTP
const http = require("http").Server(app);
// Servidor para socket.io, aquí RECIBIMOS mensajes
// Nos aseguramos que podemos recibir referencias cruzadas
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/*

  {
    function: 1,
    data: ""
  }


  {
    function: 2 || 3,
    data: {
      q: Number,
      a: Number,
      y: Number
    },
    MAC: string
  }

*/

var isAlice = false;

// diffie hellman variables
var q = bigInt(2426697107);
var a = bigInt(17123207);
var randomX = bigInt(Math.floor(Math.random() * q)).value;
var dfKey;
var publicKey;

var customMAC;

//diffie hellman compute
function computeDiffieHellman(a, exp, qr) {
  var res = a.modPow(exp, qr);
  return res;
}

// funciones de encripcion
function encodeDesECB(textToEncode, keyString) {
  var key = new Buffer.from(keyString.substring(0, 8), "utf8");

  var cipher = crypto.createCipheriv("des-ecb", key, "");

  var c = cipher.update(textToEncode, "utf8", "base64");
  c += cipher.final("base64");

  return c;
}

function decodeDesECB(textToDecode, keyString) {
  var key = new Buffer.from(keyString.substring(0, 8), "utf8");

  var decipher = crypto.createDecipheriv("des-ecb", key, "");

  var d = decipher.update(textToDecode, "base64", "utf8");

  d += decipher.final("utf8");

  return d;
}

// Argumentos de linea de comandos
var myArgs = process.argv.slice(2);
// Puerto es el primer argumento que se pasa
const port = myArgs[0] || process.env.PORT;
// const port = myArgs[0];
// Se almacenan los mensajes recibidos
var mensajes = [];
// Se usa para ENVIAR mensajes
var socketOut = null;
app.get("/", (req, res) => {
  res.send("ASCP framework");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Cliente
const ioc = require("socket.io-client");

// Conectar a otro host
app.get("/conectar", (req, res) => {
  res.send("Host " + req.query.host);
  socketOut = ioc(req.query.host);
  console.log(socketOut);
});

// Enviar mensaje al host al que se encuentra conectado
app.get("/enviar_mensaje", (req, res) => {
  let encodedMessage = encodeDesECB(req.query.msg, dfKey.value.toString());
  req.query.msg = encodedMessage;
  res.send("Mensaje " + req.query.msg);
  socketOut.emit("Mensaje ASCP", { function: 1, data: req.query.msg });
});
// Obtener el último mensaje
app.get("/obtener_ultimo_mensaje", (req, res) => {
  res.send("Ultimo: " + mensajes[mensajes.length - 1]);
});
// Recibir mensajes
io.on("connection", (socket) => {
  socket.on("Mensaje ASCP", (payload) => {
    switch (payload.function) {
      case 1:
        console.log("Encriptado: ", payload);
        mensajes.push(payload.data);
        // desencriptar payload.data
        payload.data = decodeDesECB(payload.data, dfKey.value.toString());
        console.log("desencriptado: ", payload);

        //calcular mac y comparar
        let MAC = crypto.createHmac("sha1", dfKey.value.toString());
        MAC.update(payload.data);

        let decryptedMAC = decodeDesECB(payload.MAC, dfKey.value.toString());
        if (decryptedMAC === MAC.digest("base64")) {
          console.log("integrity confirmed");
          io.emit("ToClient", payload);
        } else {
          console.log("message has been modified");
          // send something to react
          io.emit("InvalidIntegrity");
        }

        break;
      case 2:
        if (!isAlice) {
          console.log("bob is creating keys");
          publicKey = computeDiffieHellman(a, randomX, q);
          dfKey = computeDiffieHellman(bigInt(payload.data.y), randomX, q);
          console.log(publicKey, dfKey);
          socketOut.emit("Mensaje ASCP", {
            function: 3,
            data: { q: q.value, a: a.value, y: publicKey.value },
          });
        }
        break;
      case 3:
        if (isAlice) {
          console.log(payload);
          dfKey = computeDiffieHellman(bigInt(payload.data.y), randomX, q);
        }
        break;
      default:
        break;
    }
  });
});

io.on("connection", (socket) => {
  socket.on("create-key", (payload) => {
    if (isAlice) {
      console.log("alice creating keys...");
      let y = computeDiffieHellman(a, randomX, q);
      socketOut.emit("Mensaje ASCP", {
        function: 2,
        data: { q: q.value, a: a.value, y: y.value },
      });
    }
  });
});

io.on("connection", (socket) => {
  socket.on("FromClient", (payload) => {
    // encriptar payload.data
    console.log(payload);
    let MAC = crypto.createHmac("sha1", dfKey.value.toString());
    if (customMAC) {
      // calcular MAC falsa antes de encriptar
      console.log("usando MAC rara");
      MAC.update(payload.data + "una wea");
    } else {
      // calcular MAC antes de encriptar
      MAC.update(payload.data);
    }
    let digestedMAC = MAC.digest("base64");
    console.log(digestedMAC);
    let encodedMAC = encodeDesECB(digestedMAC, dfKey.value.toString());

    let encodedMessage = encodeDesECB(payload.data, dfKey.value.toString());
    payload.data = encodedMessage;
    payload = { ...payload, MAC: encodedMAC };
    console.log("sending mac: ", payload);
    socketOut.emit("Mensaje ASCP", payload);
  });
});

io.on("connection", (socket) => {
  socket.on("Custom MAC", (MAC) => {
    customMAC = MAC;
  });
});

io.on("connection", (socket) => {
  socket.on("ConnectionURL", (payload) => {
    socketOut = ioc(payload.url);
    isAlice = payload.isAlice;
    console.log("Connected: ", socketOut);
  });
});
// Escuchar en el puerto especificado en la línea de comandos
http.listen(port, () => {
  console.log(`Escuchando en http://localhost:${port}/`);
});
