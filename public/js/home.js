function BuscarSala(){
    let sala = $("#txtSearch").val();

    window.location.href= window.location.origin+"/editor?id="+sala;

}

function NuevaSala(){
    window.location.href= window.location.origin+"/editor";
}

$("#btnSearch").on("click",BuscarSala)
$("#btnNew").on("click", NuevaSala);

const svgUsername = '<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>'+
'</svg>';

const btnUsuario = document.getElementById("dropdownInformationButton");
const tierInfo = document.getElementById("tierInfo");



function getCookieValue(cookiename) {
  var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "").slice(2);
  }

btnUsuario.innerHTML=JSON.parse(getCookieValue("auth")).username+svgUsername;
if(JSON.parse(getCookieValue("auth")).tier==1 ){
    tierInfo.textContent = "PREMIUM"
}else{
    tierInfo.textContent = "NO PREMIUM"
}