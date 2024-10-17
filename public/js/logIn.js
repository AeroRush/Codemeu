$(function(){
//Definición de variables//
let opEye=$("#opEye");
let opEye2=$("#opEye2");
let passwordInput=$("#password");
let passwordInputCreate=$("#passwordCreate");
let isClosed=true;
let goToSignIn= $("#goToSignIn");
let goToSignUp= $("#goToSignUp");
let signUpForm= $("#signUpForm");
let signInForm= $("#signInForm");
let infoMsg= $("#info-msg");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let info = urlParams.get('info');


//Funcionalidades//

//Comprobación usuarios

    ///Login
    if(info=="nl"){
        infoMsg.html("You need log in to access this page")
        infoMsg.removeClass("text-green-500");
        infoMsg.addClass("text-red-500");
    }else if(info=="bn"){
        infoMsg.html("This account is banned")
        infoMsg.removeClass("text-green-500");
        infoMsg.addClass("text-red-500");
    }else if(info=="fnm"){
        infoMsg.html("This account does not exist or the password is incorrect")
        infoMsg.removeClass("text-green-500");
        infoMsg.addClass("text-red-500");
    }else if(info=="acss"){
        infoMsg.html("Account created successfully")
        infoMsg.removeClass("text-red-500");
        infoMsg.addClass("text-green-500");
    }else if(info=="ae"){
        infoMsg.html("This user alredy exists")
    }






//Ocultar y mostrar contraseña//

opEye.on("click", function(){
    if(isClosed==true){
        opEye.attr("src","/public/img/eye2.svg");
        passwordInput.attr("type","text");
        isClosed=false;
    }else{
        isClosed=true
        opEye.attr("src","/public/img/eye1.svg");
        passwordInput.attr("type","password");

    }
})

opEye2.on("click", function(){
    if(isClosed==true){
        opEye2.attr("src","/public/img/eye2.svg");
        passwordInputCreate.attr("type","text");
        isClosed=false;
    }else{
        isClosed=true
        opEye2.attr("src","/public/img/eye1.svg");
        passwordInputCreate.attr("type","password");

    }
})

//Cambiar entre formulario de registro y de inicio de sesión//

goToSignIn.on("click", function(){
    signUpForm.fadeOut(2200);
    signUpForm.hide();
    signInForm.fadeIn(1900);
    signInForm.show();

});

goToSignUp.on("click", function(){
    signInForm.fadeOut(2200);
    signInForm.hide();
    signUpForm.fadeIn(1900);
    signUpForm.show();

})

//Comprobacion contraseña1 == contraseña2 creando usuarios

let contraseña1= $("#passwordCreate");
let contraseña2= $("#password2");
let btnSignUp= $("#btnSignUp");
let confirmTxt= $("#confirm");


contraseña1.on("input", function(e){



    if(contraseña1.val() != contraseña2.val() && contraseña1.val() != "" && contraseña2.val() != ""){
        e.preventDefault();
        confirmTxt.html("Confirm your password: both passwords doesen't match");
        confirmTxt.removeClass("text-green-500");
        confirmTxt.addClass("text-red-500");
        btnSignUp.addClass("cursor-not-allowed");
        btnSignUp.attr("disabled", true);
    }else if(contraseña1.val() == contraseña2.val() && contraseña1.val() != "" && contraseña2.val() != ""){
        confirmTxt.html("Both passwords match");
        confirmTxt.removeClass("text-red-500");
        confirmTxt.addClass("text-green-500");
        btnSignUp.removeClass("cursor-not-allowed");
        btnSignUp.removeAttr("disabled");
    }else{
        confirmTxt.html("Confirm your password :");
        confirmTxt.removeClass("text-red-500");
        confirmTxt.removeClass("text-green-500");
        btnSignUp.addClass("cursor-not-allowed");
        btnSignUp.attr("disabled", true);
    }

})

contraseña2.on("input", function(e){



    if(contraseña1.val() != contraseña2.val() && contraseña1.val() != "" && contraseña2.val() != ""){
        e.preventDefault();
        confirmTxt.html("Confirm your password: both passwords doesen't match");
        confirmTxt.removeClass("text-green-500");
        confirmTxt.addClass("text-red-500");
        btnSignUp.addClass("cursor-not-allowed");
        btnSignUp.attr("disabled", true);
    }else if(contraseña1.val() == contraseña2.val() && contraseña1.val() != "" && contraseña2.val() != ""){
        confirmTxt.html("Both passwords match");
        confirmTxt.removeClass("text-red-500");
        confirmTxt.addClass("text-green-500");
        btnSignUp.removeClass("cursor-not-allowed");
        btnSignUp.removeAttr("disabled");
    }else{
        confirmTxt.html("Confirm your password :");
        confirmTxt.removeClass("text-red-500");
        confirmTxt.removeClass("text-green-500");
        btnSignUp.addClass("cursor-not-allowed");
        btnSignUp.attr("disabled", true);
    }

})


});



