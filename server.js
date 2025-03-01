//--------------LIBRERIAS IMPORTADAS---------------------
const {
    default: axios
} = require("axios");
const {
    Octokit
} = require("@octokit/core");
const express = require("express");
const app = express();
const Pusher = require("pusher");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const session = require('cookie-session');
var cookieParser = require('cookie-parser')
var path = require("path");
require("dotenv").config();
const Discord = require('discord.js');
let botListo = false;
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages
    ]
})

const saltRounds = 10;
/*client.on('message', msg => {
    if (msg.content == 'ping') {
        msg.reply('Pong!');
    }
});



client.login(process.env.DISCORD_TOKEN);


client.once('ready', () => {
    console.log('Ready');
    botListo = true;
});

*/
let httpServer = app.listen(8080, () => console.log(`Listening on ${ 8080 }`));

const pusherServer = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: process.env.CLUSTER,
});



//-------------CONEXION-----------------------/
let conexion;


conexion = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 3306,
    typeCast: function castField(field, useDefaultTypeCasting) {
        if ((field.type === "BIT") && (field.length === 1)) {

            var bytes = field.buffer();


            return (bytes[0] === 1);

        }

        return (useDefaultTypeCasting());

    }

});

/*conexion.connect((error) => {
    if (error) throw error;
    console.log("Conectado a la base de datos")
});*/
//----------USE-------------------------------

app.use(express.json());

app.use(cors());

app.use(cookieParser())

app.use(session({
    resave: true,
    secret: process.env.SECRETSESSION,
    saveUninitialized: true
}));

app.use(express.urlencoded({
    extended: false
}));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'static')));

const generateAccessToken = require("./generarTokenAuth.js")


//----------------RUTAS GET--------------------------
app.get('/', rutaDefault);
app.get("/login", login);
app.get("/logingithub", loginGithub)
app.get('/editor', editor);
app.get("/logout", logout);
app.get("/githubauth", githubAuth)


//----------------RUTAS POST--------------------------
app.post("/signup", signup)
app.post('/auth', auth);

app.post("/pusher/user-auth", pusherAuth);

//-------------------FUNCIONES RUTAS---------------------
function rutaDefault(request, response) {
    // Comprobamos si el usuario está logeado
    if (request.cookies.auth) {
        //Guardamos su token para comprobarlo
        var token = request.cookies.auth.token;
    }
    //Si tiene un token
    if (token) {
        //Comprobamos que se haya generado por nosotros
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, token_data) {
            if (err) {
                //Si hay algún error lo mandamos al login
                response.sendFile(__dirname + "/public/html/logIn.html");
            } else {
                //Si no hay errores enviamos el html del home
                response.sendFile(__dirname + "/public/html/home.html")
            }
        })

    } else {
        // En caso de no estar logeado lo reenviamos al login
        response.redirect("/login");
    }

}

function editor(request, response) {
    // Comprobamos si el usuario está logeado
    if (request.cookies.auth) {
        //Guardamos su token para comprobarlo
        var token = request.cookies.auth.token;
    }
    // Comprobamos si el usuario está intentando acceder a una sala
    if (request.query.id) {
        //Guardamos la id de la sala en la sesión
        request.session.channel = request.query.id
    } else {
        //En caso de no haber id los redirigimos al home
        request.session.channel = ""

    }

    //Si tiene un token
    if (token) {
        //Comprobamos que se haya generado por nosotros
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, token_data) {
            if (err) {
                //Si hay algún error lo mandamos al login
                response.sendFile(__dirname + "/public/html/logIn.html");
            } else {

                if (request.query.id == null) {
                    nuevaID = getUniqueId();
                    if (botListo) {
                        client.channels.cache.get("1080887729837068391").send(request.cookies.auth.username + " se ha unido a la sala " + nuevaID);
                    }
                    response.redirect("/editor?id=" + getUniqueId());
                } else {
                    if (botListo) {
                        client.channels.cache.get("1080887729837068391").send(request.cookies.auth.username + " se ha unido a la sala " + request.session.channel);
                    }
                    if (request.session.tier == 0) {
                        response.sendFile(__dirname + "/public/html/editorNoPremium.html");
                    } else {
                        response.sendFile(__dirname + "/public/html/editor.html");
                    }

                }
            }
        })

    } else {
        // En caso de no estar logeado lo reenviamos al login
        response.redirect("/login?info=nl");
    }
}

function login(request, response) {
    if (request.cookies.auth) {
        var token = request.cookies.auth.token;
    }

    // Comprobamos si el usuario está logeado
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, token_data) {
            if (err) {
                response.sendFile(__dirname + "/public/html/logIn.html");
            } else {
                response.redirect("/");
            }
        })
    } else {
        // En caso de no estar logeado cargamos el login
        response.sendFile(__dirname + "/public/html/logIn.html");
    }

}

function logout(request, response) {
    if (request.cookies.auth) {
        var token = request.cookies.auth.token;
    }
    if (token) {
        response.clearCookie("auth")
        pusherServer.terminateUserConnections("" + request.cookies.auth.id);
        request.session.channel = ""
        request.session.tier = ""
    }
    response.redirect("/login");
}

function signup(request, response) {
    let username = request.body.usernameCreate;
    let passwd = request.body.passwordCreate
    if (username && passwd) {
        conexion.query('SELECT * FROM users WHERE username = ?', [username], async (error, results, fields) => {
            if (error) throw error;
            else if (results.length > 0) {
                response.redirect("/login?info=ae");
            } else {
                let encryptedPasswd = await bcrypt.hash(passwd, saltRounds);
                conexion.query('INSERT into users (username,passwd,accountTier,banned,fechaCreacion) values(?,?,0,0,curdate())', [username, encryptedPasswd])
                response.redirect("/login?info=acss");
            }
        })
    } else {
        response.redirect("/login?info=nl");
        response.end();
    }
}

function pusherAuth(request, response) {


    const socketId = request.body.socket_id;
    const channelName = request.body.channel_name;
    console.log(socketId)
    console.log(channelName)
    console.log(request.cookies.auth)
    // if (request.cookies.auth.id == undefined || request.cookies.auth.username == undefined) {
    //     response.sendStatus(403)
    // } else {

        const user = {
            id: request.cookies.auth.id,
            username: request.cookies.auth.username,
        };
        const authResponse = pusherServer.authenticate(socketId, channelName, user);

        response.send(authResponse);
        console.log(authResponse)
    //}



}

async function auth(request, response) {
    // Extraemos los campos del formulario 
    let username = request.body.username;
    let passwd = request.body.password;
    // Comprobamos si el usuario ha introducido ambos
    if (username && passwd) {
        // Ejecutamos la consulta para comprobar si ese usuario y contraseña existen
        conexion.query('SELECT * FROM users WHERE username = ? ', [username], async function (error, results, fields) {
            // Si ocurre algún error lanzamos el error
            if (error) throw error;
            // Comprobamos si la consulta devolvió algún usuario
            if (results.length > 0) {
                if (await bcrypt.compare(passwd, results[0].passwd)) {
                    var token = generateAccessToken(username)
                    console.log(results[0])
                    if (results[0].banned == true) {
                        response.redirect("/login?info=bn");
                    } else {
                        request.session.tier = results[0].accountTier;
                        response.cookie('auth', {
                            "token": token,
                            "username": username,
                            "id": results[0].Id,
                            "tier": results[0].accountTier
                        });
                        if (request.session.channel) {
                            response.redirect("/editor?id=" + request.session.channel);
                        } else {
                            response.redirect('/');
                        }
                    }
                } else {
                    response.redirect("/login?info=fnm");
                }
            } else {
                //En caso de no haber un usuario con esa contraseña lo enviamos otra vez al login con un mensaje de error
                response.redirect("/login?info=fnm");
            }
            response.end();
        });
    } else {
        //En caso de no haber introducido algún campo lo enviamos otra vez al login con un mensaje de error
        response.redirect("/login?error=nl");
        response.end();
    }
}

function loginGithub(request, result) {
    result.redirect(`https://github.com/login/oauth/authorize?client_id=416a5d17121e3d57675a`);
}

function githubAuth(request, response) {
    let username = ""
    let id = ""
    let error = ""
    let wait = true
    axios.post("https://github.com/login/oauth/access_token", {
        client_id: "416a5d17121e3d57675a",
        client_secret: process.env.GITHUB_SECRET,
        code: request.query.code
    }, {
        headers: {
            Accept: "application/json"
        }
    }).then(async (result) => {
        const octokit = new Octokit({
            auth: result.data.access_token
        })
        await octokit.request('GET /user', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).then((result) => {
            username = result.data.login
            id = result.data.id
            setCookies()
        }).catch((error) => {
            error = true;
        })
    })

    function setCookies() {
        if (error) {
            response.redirect("/login?error=true");
        } else {
            var token = generateAccessToken(username)
            response.cookie('auth', {
                "token": token,
                "username": username,
                "id": id
            });
            if (request.session.channel) {
                response.redirect("/editor?id=" + request.session.channel);
            } else {
                response.redirect('/');
            }
        }
    }

}

function getUniqueId() {
    return Math.random().toString(36).substring(2, 9);

}