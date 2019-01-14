var centesimas = 0;
var segundos = 0;
var minutos = 0;
var horas = 0;
var dias = 0;
var segundosTXT = "00";
var minutosTXT = "00";
var horasTXT = "00";
var diasTXT = "00";
var tiempoSesion;

function loadVarConexion(){
    tiempoSesion = document.getElementById("tiempoSesion");
}

function inicioCronometro () {
	control = setInterval(cronometro,10);
}
function pararCornometro() {
	var centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	dias = 0;
	clearInterval(control);
}
function reinicio () {
	clearInterval(control);
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	tiempoSesion.innerHTML = "00:00:00:00"
}
function cronometro () {
	if (centesimas < 99) {
		centesimas++;
	}
	if (centesimas == 99) {
		centesimas = -1;
	}
	if (centesimas == 0) {
		segundos ++;
        if (segundos < 10) { segundosTXT = "0"+segundos }else{ segundosTXT = segundos }
	}
	if (segundos == 59) {
		segundos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0) ) {
		minutos++;
        if (minutos < 10) { minutosTXT = "0"+minutos }else{ minutosTXT = minutos }
	}
	if (minutos == 59) {
		minutos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0) ) {
		horas ++;
        if (horas < 10) { horasTXT = "0"+horas }else{ horasTXT = horas }
	}
    if (horas == 59) {
		horas = -1;
	}
    if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0)&&(horas == 0) ) {
		dias ++;
        if (dias < 10) { diasTXT = "0"+dias }else{ diasTXT = dias }
	}
    
    tiempoSesion.innerHTML = diasTXT+":"+horasTXT+":"+minutosTXT+":"+segundosTXT;
}