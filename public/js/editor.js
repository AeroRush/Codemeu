const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

const downloadAll = document.getElementById("downloadAll")
const downloadCode = document.getElementById("downloadCode")
const reloadCode = document.getElementById("reload")
const uploadCode = document.getElementById("uploadCode")
const uploadCodeInput = document.getElementById("uploadCodeInput")
const btnUsuario = document.getElementById("dropdownInformationButton");
const tierInfo = document.getElementById("tierInfo");

const pusher = new Pusher('b73d868c1e97c18d9977', {
    cluster: 'eu',
    authEndpoint: "/pusher/user-auth"
});

let channel = pusher.subscribe("private-" + id);
let uploading = false;
channel.bind('pusher:subscription_succeeded', () => {
    channel.trigger('client-askCode', "askCode");
})

const svgUsername = '<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>' +
    '</svg>';



function getCookieValue(cookiename) {
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "").slice(2);
}

btnUsuario.innerHTML = JSON.parse(getCookieValue("auth")).username + svgUsername;
if (JSON.parse(getCookieValue("auth")).tier == 1) {
    tierInfo.textContent = "PREMIUM"
} else {
    tierInfo.textContent = "NO PREMIUM"
}



//////////////////////////EDITOR//////////////////////////////////////////

let colorPicker = $("#nativeColorPicker");

colorPicker.on("input", function () {

    return navigator.clipboard.writeText(colorPicker.val());

})

let htmlEditor = {

    mode: {
        name: "htmlmixed",
        globallets: true
    },
    theme: 'yonce',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
}

let cssEditor = {

    mode: 'css',
    theme: 'yonce',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    hint: true,
    autohint: true,
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    },

}

let jScriptEditor = {
    mode: {
        name: "javascript",
        globallets: true
    },
    theme: 'yonce',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    },
}


let themeSelector = document.getElementById("theme-selector");

let editorHTML = CodeMirror.fromTextArea(document.getElementById('editorHTML'), htmlEditor)
let editorCSS = CodeMirror.fromTextArea(document.getElementById('editorCSS'), cssEditor)
let editorJS = CodeMirror.fromTextArea(document.getElementById('editorJS'), jScriptEditor)

themeSelector.addEventListener("click", (e) => {
    let selectedTheme = themeSelector.value;
    editorHTML.setOption("theme", selectedTheme)
    editorCSS.setOption("theme", selectedTheme)
    editorJS.setOption("theme", selectedTheme)
})


document.body.onload = function () {

    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        let defaultTheme = "base16-light"

        editorHTML.setOption("theme", defaultTheme)
        editorCSS.setOption("theme", defaultTheme)
        editorJS.setOption("theme", defaultTheme)
        themeSelector.innerHTML = '<option value="base16-light">Base16-Light</option>\n              <option value="yonce">Yonce</option>\n              <option value="dracula">Dracula</option>\n              <option value="abbott">Abbott</option>\n              <option value="lucario">Lucario</option>\n              <option value="monokai">Monokai</option>\n              <option value="erlang-dark">Andy</option>\n              \n        …'

    }
}




//////////////////////////CHANGE EDITOR//////////////////////////////////////////

let htmlBtn = document.getElementById("htmlEditor");
let cssBtn = document.getElementById("cssEditor");
let jsBtn = document.getElementById("jScriptEditor");

let txtHTML = document.getElementById('HTML');
let txtCSS = document.getElementById('CSS');
let txtJS = document.getElementById('JS');

let oculto = "px-4 py-2 bg-white rounded-b-lg dark:bg-stone-600 hidden";
let visible = "px-4 py-2 bg-white rounded-b-lg dark:bg-stone-600";
let editing = "html"

htmlBtn.addEventListener("click", (e) => {
    htmlBtn.className = "bg-orange-400  border-s border-t border-gray-400 hover:bg-orange-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    cssBtn.className = "bg-slate-100 dark:bg-neutral-700 border-x border-t border-gray-400 hover:bg-blue-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    jsBtn.className = "bg-slate-100 dark:bg-neutral-700 border-e border-t border-gray-400 hover:bg-amber-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    txtCSS.className = oculto;
    txtJS.className = oculto;
    txtHTML.className = visible;
    editorHTML.refresh();
    editing = "html"


})

cssBtn.addEventListener("click", (e) => {
    htmlBtn.className = "bg-slate-100 dark:bg-neutral-700 border-s border-t border-gray-400 hover:bg-orange-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    cssBtn.className = "bg-blue-400  border-x border-t border-gray-400 hover:bg-blue-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    jsBtn.className = "bg-slate-100 dark:bg-neutral-700 border-e border-t border-gray-400 hover:bg-amber-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    txtJS.className = oculto;
    txtHTML.className = oculto;
    txtCSS.className = visible;
    editorCSS.refresh();
    editing = "css"
})

jsBtn.addEventListener("click", (e) => {
    htmlBtn.className = "bg-slate-100 dark:bg-neutral-700 border-s border-t border-gray-400 hover:bg-orange-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    cssBtn.className = "bg-slate-100 dark:bg-neutral-700 border-x border-t border-gray-400 hover:bg-blue-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    jsBtn.className = "bg-amber-400 border-e border-t border-gray-400 hover:bg-amber-400 transition duration-500 ease-in-out text-black dark:text-white font-bold py-2 px-4 rounded-t-lg";
    txtHTML.className = oculto;
    txtCSS.className = oculto;
    txtJS.className = visible;
    editorJS.refresh();
    editing = "js"
})




//////////////////////////OUTPUT EDITOR//////////////////////////////////////////

function run() {
    try {
        let htmlCode = editorHTML.getValue();
        let cssCode = "<style>" + editorCSS.getValue() + "</style>";
        let scriptCode = editorJS.getValue();
        let output = document.querySelector(".outputeditor #output-frame");
        output.contentDocument.body.innerHTML = htmlCode + cssCode;
        output.contentWindow.eval(scriptCode);
    } catch (e) {

    }
}



/////////////////////////CAMBIOS A ORDENAR/////////////////////////////////////
editorHTML.on("keyup", (cm, event) => {

    let templateCheckString = editorHTML.getValue().replace("\n", "")
    if (event.key == "Enter" && templateCheckString == "!") {
        uploading = true;
        editorHTML.setValue(`<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        
    </body>
</html>`);
    }
    uploading = false;
})


editorHTML.on("change", sendHTMLData)

editorCSS.on("change", sendCSSData)

editorJS.on("change", sendJSData)


channel.bind('client-askCode', function (msg) {
    sendAllData()
})

channel.bind('client-editHTML', function (htmlData) {
    editorHTML.getDoc().replaceRange(htmlData.text, htmlData.from, htmlData.to);
    run();
})

channel.bind('client-editCSS', function (cssData) {
    editorCSS.getDoc().replaceRange(cssData.text, cssData.from, cssData.to);
    run();
})

channel.bind('client-editJS', function (jsData) {
    editorJS.getDoc().replaceRange(jsData.text, jsData.from, jsData.to);
    run();
})

channel.bind('client-initialData', (initialData) => {
    initialData = initialData.replace("\n", "\\n")
    initialData = initialData.replace("\r", "\\t")
    initialData = initialData.replace("\t", "\\t")
    let initialDataJson = JSON.parse(initialData)
    editorHTML.setValue(initialDataJson.html);
    editorCSS.setValue(initialDataJson.css);
    editorJS.setValue(initialDataJson.js);
    run();
})

function sendHTMLData(cm, change) {
    if ((change.origin != undefined && change.origin != "setValue") || (change.origin != undefined && uploading == true)) {
        channel.trigger('client-editHTML', JSON.stringify(change));

    }
    run();
}

function sendCSSData(cm, change) {
    if ((change.origin != undefined && change.origin != "setValue") || (change.origin != undefined && uploading == true)) {
        channel.trigger('client-editCSS', JSON.stringify(change));

    }
    run();
}

function sendJSData(cm, change) {
    if ((change.origin != undefined && change.origin != "setValue") || (change.origin != undefined && uploading == true)) {
        channel.trigger('client-editJS', JSON.stringify(change));

    }
    run();
}

function sendAllData() {
    let textHTML = editorHTML.getValue();

    if (textHTML == "undefined") {
        textHTML = ""
    }
    textHTML = textHTML.replaceAll("\"", '\\"')

    let textCSS = editorCSS.getValue();
    textCSS = textCSS.replaceAll("\"", '\\"')
    let textJS = editorJS.getValue();
    textJS = textJS.replaceAll("\"", '\\"')
    let message = `{"html": "${textHTML}","css": "${textCSS}","js": "${textJS}"}`
    message = message.replaceAll(/\n/g, "\\n");
    channel.trigger('client-initialData', JSON.stringify(message));

}

function download(filename, textInput) {

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
}

downloadAll.addEventListener("click", () => {
    let text = editorHTML.getValue();
    let filename = "index.html";
    download(filename, text);
    text = editorCSS.getValue();
    filename = "style.css";
    download(filename, text);
    text = editorJS.getValue();
    filename = "index.js";
    download(filename, text);
})

downloadCode.addEventListener("click", () => {
    let filename = ""
    let text = ""
    if (editing == "html") {
        text = editorHTML.getValue();
        filename = "index.html";
    } else if (editing == "css") {
        text = editorCSS.getValue();
        filename = "style.css";
    } else if (editing == "js") {
        text = editorJS.getValue();
        filename = "index.js";
    } else {
        alert("Ocurrió un error al intentar la descarga")
    }
    download(filename, text);
}, false);

reloadCode.addEventListener("click", () => {
    channel.trigger('client-askCode', "askCode");
})

uploadCode.addEventListener("click", () => {
    uploadCodeInput.click();
}, false);

uploadCodeInput.addEventListener("change", () => {
    uploading = true;
    let file = uploadCodeInput.files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (fichero) => {
            let textoFichero = fichero.target.result;
            if (editing == "html") {
                editorHTML.setValue(textoFichero)
            } else if (editing == "css") {
                editorCSS.setValue(textoFichero)
            } else if (editing == "js") {
                editorJS.setValue(textoFichero)
            } else {
                alert("Ocurrió un error al intentar la subida")
            }
            uploadCodeInput.value = ""
            sendAllData()
            run();
        }
        reader.onerror = () => {
            alert("Ocurrió un error al intentar la subida")
        }
    }
    uploading = false;
})