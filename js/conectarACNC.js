// chrome.exe --user-data-dir="C:/chrome dev sesion" --disable-web-security
var est_conexion;
var dataXML;
var urlAgente;
var btnConectar,tooltipbtnconnectar;
var fechaMenu;
var idCNC, namepCNC, sampleInterval, uuidCNC;
var ejeX, ejeY, ejeZ, extrusor, tempExtrusor, tempBase;

function onLoad(){
    est_conexion = document.getElementById("estCNC");
    urlAgente = document.getElementById("urlAgente");
    btnConectar = document.getElementById("btnConectar");
    tooltipbtnconnectar = document.getElementById("tooltip-btn-connect");
    fechaMenu = document.getElementById("fechaMenu");
    idCNC = document.getElementById("idCNC");
    namepCNC = document.getElementById("nameCNC");
    sampleInterval = document.getElementById("sampleInterval");
    uuidCNC = document.getElementById("uuidCNC");
    ejeX = document.getElementById("ejeX");
    ejeY = document.getElementById("ejeY");
    ejeZ = document.getElementById("ejeZ");
    extrusor = document.getElementById("extrusor");
    tempExtrusor = document.getElementById("tempExtrusor");
    tempBase = document.getElementById("tempBase");
    
    loadVarConexion();
    
    dataXML = new Array();
    conf_SolicitudXML();
}

function conectar(){
    if(tooltipbtnconnectar.innerHTML == "Conectar"){
        var request = new resquestAjax();
        request.onreadystatechange = function(){
            if(request.readyState == 4 && request.status == 200){
                if(request.responseXML != null){
                    est_conexion.style.color = "green";
                    est_conexion.innerHTML = "Connected";
                    btnConectar.classList.replace("icon-link","icon-unlink");
                    tooltipbtnconnectar.innerHTML = "Desconectar";
                    tooltipbtnconnectar.style.left = "-190%";
                    fechaMenu.style.display = "flex";
                    urlAgente.disabled = true;
                    inicioCronometro();
                    
                    dataXML[0] = request.responseXML.getElementsByTagName("Device").item(0);
                    
                    if(dataXML[0].hasAttribute("id")){
                        idCNC.innerHTML = dataXML[0].getAttribute("id");
                    }
                    if(dataXML[0].hasAttribute("name")){
                        nameCNC.innerHTML = dataXML[0].getAttribute("name");
                    }
                    if(dataXML[0].hasAttribute("sampleInterval")){
                        sampleInterval.innerHTML = dataXML[0].getAttribute("sampleInterval");
                    }
                    if(dataXML[0].hasAttribute("uuid")){
                        uuidCNC.innerHTML = dataXML[0].getAttribute("uuid");
                    }
                    // Campos a rojo
                    ejeX.style.background = "rgba(255,0,0,0.8)";
                    ejeY.style.background = "rgba(255,0,0,0.8)";
                    ejeZ.style.background = "rgba(255,0,0,0.8)";
                    extrusor.style.background = "rgba(255,0,0,0.8)";
                    tempExtrusor.style.background = "rgba(255,0,0,0.8)";
                    tempBase.style.background = "rgba(255,0,0,0.8)";
                    // Dispositivos disponibles
                    dataXML[1] = request.responseXML.getElementsByTagName("Axes").item(0);
                    var componentes = dataXML[1].getElementsByTagName("Linear");
                    var nComp = componentes.length;
                    for(i=0;i<nComp;i++){
                        var idComp = componentes[i].getAttributeNode("id");
                        if(idComp.value === "PrusaMendel-X"){
                            ejeX.style.background = "rgba(36,231,17,0.7)";
                        }
                        if(idComp.value === "PrusaMendel-Y"){
                            ejeY.style.background = "rgba(36,231,17,0.7)";
                        }
                        if(idComp.value === "PrusaMendel-Z"){
                            ejeZ.style.background = "rgba(36,231,17,0.7)";
                        }
                        if(idComp.value === "PrusaMendel-E"){
                            extrusor.style.background = "rgba(36,231,17,0.7)";
                        }
                    }
                    // Sensores disponibles
                    dataXML[2] = request.responseXML.getElementsByTagName("Components").item(0);
                    var sensores = request.responseXML.getElementsByTagName("Sensor");
                    var nSen = sensores.length;
                    for(i=0;i<nSen;i++){
                        var idSen = sensores[i].getAttributeNode("id");
                        if(idSen.value === "extruderSensor"){
                            tempExtrusor.style.background = "rgba(36,231,17,0.7)";
                        }
                        if(idSen.value === "bedSensor"){
                            tempBase.style.background = "rgba(36,231,17,0.7)";
                        }
                    }
                    // Iniciar solicitus de datos al agente
                    iniciarSolicitudDatos();
                }else{
                    alert("No se pudo conectar a la fuente de datos solicitada");
                }
            }
        }
        request.addEventListener("error", errorXML);
        request.open("GET",urlAgente.value,true); //urlAgente.value
        request.send();
    }else{
        finalizarSolicitudDatos();
        pararCornometro();
        reiniciarCampos();
    }
}

function errorXML(event){
    alert("Error conectandoce al origen de datos: \n"+urlAgente.value);
}

function resquestAjax(){            
    try{
        var request = new XMLHttpRequest();
    }catch(error1){
        try{
            var resquest = ActiveXObject("Msxm12.XMLHTTP")
        }catch(error2){
            try{
                var request = ActiveXObject('Microsoft.XMLHTTP')
            }catch(error3){
                var request = false;
            }
        }
    }
    
    return request;
}

function reiniciarCampos(){
    est_conexion.innerHTML = "Disconnected";
    est_conexion.style.color = "red";
    tooltipbtnconnectar.innerHTML = "Conectar";
    btnConectar.classList.replace("icon-unlink","icon-link");
    tooltipbtnconnectar.style.left = "-100%";
    fechaMenu.style.display = "none";
    urlAgente.disabled = false;
    idCNC.innerHTML = "";
    nameCNC.innerHTML = "";
    sampleInterval.innerHTML = "";
    uuidCNC.innerHTML = "";
    ejeX.style.background = "white";
    ejeY.style.background = "white";
    ejeZ.style.background = "white";
    extrusor.style.background = "white";
    tempExtrusor.style.background = "white";
    tempBase.style.background = "white";
    setTimeout(camposACero,500);
}

function camposACero(){
    ejeX.innerHTML = "0.0";
    ejeY.innerHTML = "0.0";
    ejeZ.innerHTML = "0.0";
    extrusor.innerHTML = "0.0";
    tempExtrusor.innerHTML = "0";
    tempBase.style.innerHTML = "0";
}