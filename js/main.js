let global = {};
global.web = $("#web");
global.pass = $("#pass");
global.alerta = $("#alerta");
global.btnSave = $('#btnSave');
global.textAreaJson = $('#textAreaJson');
global.generateCode = $('#generateCode');
global.jsonData = {};

global.showAlert = function (type, message) {
    let alert = `<div class="alert alert-${type}" role="alert" id="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <strong>${message}</strong>
        </div>`
    global.alerta.empty();
    global.alerta.html(alert);
}
global.connect = function (pass) {
    firebase.auth().signInWithEmailAndPassword("lm.perezpacheco@gmail.com", pass).then(function (result) {
        global.user = result.user;
        global.userUid = result.user.uid;
        global.userEmail = result.user.email;
        //console.log(result);
        //console.log(global.userUid);

        let message = "Configuración de " + global.userEmail + " guardada correctamente.";
        global.showAlert("success", message);

        let json = global.textAreaJson.val();
        let qr = $('#qrCode img').attr('src');
        let web = global.web.val();

        global.saveData(json, qr, web);

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
        let message = " Error: (" + errorCode + ") " + errorMessage;
        global.showAlert("danger", message);
    });
}

global.initFirebase = function () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDc2aK2DuZUW7Iw_WuValYq9o0Y7a_TTTs",
        authDomain: "test-bar-qrcode.firebaseapp.com",
        databaseURL: "https://test-bar-qrcode.firebaseio.com",
        projectId: "test-bar-qrcode",
        storageBucket: "test-bar-qrcode.appspot.com",
        messagingSenderId: "1085750921277",
        appId: "1:1085750921277:web:001764db5c058c11bac254",
        measurementId: "G-TFXHZDFRFY"
    };
// Initialize Firebase
    firebase.initializeApp(firebaseConfig);

}
global.loadData = function (callback) {
    firebase.database().ref('data/yOVx8ZDrx0eqKlwbsDmWx90sbOt1').once('value').then(function (snapshot) {
        global.jsonData = snapshot.val();
        if (callback && typeof callback == "function") {
            callback();
        }
    });
}
global.setDataConfig = function () {
    global.jsonData.hasOwnProperty("carta") ? global.textAreaJson.val(global.jsonData.carta).trigger('change') : global.textAreaJson.val("");
    global.jsonData.hasOwnProperty("web") ? global.web.val(global.jsonData.web).trigger('change') : global.web.val("");

    global.web.val() ? global.generateCode.attr('disabled', false).click() : false;
}
global.saveData = function (json, qr, web) {
    let data = {};

    if(json)data.carta = json;
    if(qr)data.code = qr;
    if(json)data.web = web;

    if (data && web && json) {
        let task = firebase.database().ref("data/" + global.userUid);
        task.set(data);
    } else {
        global.showAlert("danger", "Hay un dato incorrecto");
    }
}

global.createCode = function (idElement, web) {
    $('#' + idElement).empty();
    return new QRCode(idElement, {
        text: web,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

global.printCarta = function () {
    let cart = '';
    let count = 1;
    let carta = JSON.parse(global.jsonData.carta)
    $.each(carta, function (key, val) {
        const elements = val.reduce((acc, value) => acc + createContentCarta(value), "");
        const list =
            `<div class="card bg-secondary">
                <div class="card-header" id="heading${count}">
                    <h2 class="mb-0">
                        <button class="btn btn-link text-white" type="button" data-toggle="collapse" data-target="#collapse${count}" aria-expanded="true" aria-controls="collapse${count}">
                            ${key}
                        </button>
                    </h2>
                </div>
                <div id="collapse${count}" class="collapse show" aria-labelledby="heading${count}" data-parent="#accordionExample">
                    <ul class="list-group">
                        ${elements}
                    </ul>
                </div>
            </div>`;
        count++;
        cart += list;
    })
    $('#cartaAc').html(cart);
}

function createContentCarta(com) {

    return `<li class="list-group-item d-flex  flex-column">
            <span>${com.nombre}</span>
            <span class="text-secondary font-italic text-07">&nbsp;&nbsp;&nbsp;&nbsp;${com.tapa? 'tapa  '+ com.tapa +'€':''}${com.tapa && com.media?' / ':''}${com.media? 'media  '+ com.media +'€':''}${com.media && com.racion?' / ':''}${com.racion? 'ración  '+ com.racion +'€':''}</span>
            </li>`;
}