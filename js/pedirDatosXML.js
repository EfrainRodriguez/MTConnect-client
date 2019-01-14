function conf_SolicitudXML(){
    request = new resquestAjax();
        request.onreadystatechange = function(){
            if(request.readyState == 4 && request.status == 200){
                if(request.responseXML != null){
                    // Datos obtenidos de la posision de ejes y estrusor
                    var dataPosicion = request.responseXML.getElementsByTagName("Position");
                    var nPos = dataPosicion.length;
                    for(i=0;i<nPos;i++){
                        var idPos = dataPosicion[i].getAttributeNode("dataItemId");
                        if(idPos.value === "PrusaMendel-x"){
                            ejeX.innerHTML = dataPosicion[i].childNodes.item(0).nodeValue;
                        }
                        if(idPos.value === "PrusaMendel-y"){
                            ejeY.innerHTML = dataPosicion[i].childNodes.item(0).nodeValue;
                        }
                        if(idPos.value === "PrusaMendel-z"){
                            ejeZ.innerHTML = dataPosicion[i].childNodes.item(0).nodeValue;
                        }
                        if(idPos.value === "PrusaMendel-e"){
                            extrusor.innerHTML = dataPosicion[i].childNodes.item(0).nodeValue;
                        }
                    }
                    // Datos obtenidos del valos de las temperaturas
                    var dataTempeartura = request.responseXML.getElementsByTagName("Temperature");
                    var nTemp = dataTempeartura.length;
                    for(i=0;i<nTemp;i++){
                        var idtemp = dataTempeartura[i].getAttributeNode("dataItemId");
                        if(idtemp.value === "extruderTemp"){
                            tempExtrusor.innerHTML = dataTempeartura[i].childNodes.item(0).nodeValue;
                        }
                        if(idtemp.value === "bedTemp"){
                            tempBase.innerHTML = dataTempeartura[i].childNodes.item(0).nodeValue;
                        }
                    }
                }else{
//                    alert("No se pudo conectar a la fuente de datos solicitada");
                }
            }
        }
    request.addEventListener("error", errorXML);
}

function solicitarDatos(){
        request.open("GET",urlAgente.value+"/current",true); //urlAgente.value
        request.send();
}

function iniciarSolicitudDatos(){
    controlSolicutudXML = setInterval(solicitarDatos,10);
}

function finalizarSolicitudDatos(){
    clearInterval(controlSolicutudXML);
}