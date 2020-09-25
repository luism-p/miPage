

let success = `<div class="alert alert-success" role="alert" id="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <strong></strong>
        </div>`

$(function (){

    global.pass.on('keyup', function (){
        let value = $(this).val();
        global.btnSave.attr('disabled', !value);
    });

    global.btnSave.on('click', function (){
        let pass = global.pass.val();
        global.connect(pass);
    });
    global.web.on('keyup', function (){
        let value = $(this).val();
        global.generateCode.attr('disabled', !value);
    });
    global.generateCode.on('click', function (){
        let web = global.web.val();
        global.createCode("qrCode", web);
    });

    global.initFirebase();
    global.loadData(global.setDataConfig);

});
