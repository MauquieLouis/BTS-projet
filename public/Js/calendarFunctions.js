//----------------------Variables globales----------------------//
//----Date d'aujourd'hui----//
var now = new Date;
var dd = now.getDate();
var mm = now.getMonth();
var dow = now.getDay();
var yyyy = now.getFullYear();

var nbYear = 6; //Nombre paire
var caseHeight = "50px"; //Hauteur de la case
var windowWidth = parseInt(document.body.clientWidth)-30; //Définition de la taille de la fenêtre

//----Couleurs des cases----//
var colorOtherMonth = "lightgray";
var colorMonth = "#ececec";
var colorToday = "deepskyblue";
var colorSelectDay = "white";


//----Date clicker----//
var wDate = new Date();

//---ID de la case précèdente---//
var idPrec = "";

var arrM = new Array("Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre");
var arrY = new Array();
for (i=0;i<=nbYear;i++)				//5 années serront sélèctionnable
	arrY[i] = yyyy - nbYear/2 + i;
var arrD = new Array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim");


var windowWidth = parseInt(document.body.clientWidth);


function nbWeek(dd, mm, yyyy){
	var nbJour = 0;
	for(var i= 0; i < mm; i++)
		nbJour += parseInt(maxDays(i, yyyy));
	return Math.trunc((nbJour+dd)/7)+1;
}


////////////////////////////////////////////Calcul nb de jour de le mois/////////////////////////////////////////////
function maxDays(mm, yyyy){
var arrD = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var annBissex = ((yyyy%4==0 && yyyy%100!=0)||yyyy%400==0)?1:0; //Si c'est une année bisextile, annBissex = 1 sinon = 0
return arrD[mm]+((mm==1)?(annBissex?1:0):0); 
}


//----------Evènements----------//

//table.init("event");
//console.log(table.retour);
var tabEvent = "";//table.retour;
var de = new Array();
var me = new Array();
var ye = new Array();

var frequenceDay = 7;
var frequenceMonth;
var frequenceYear;
//alert(maxDays(parseInt(tabEvent[0][4].date.substr(5, 2))-1, parseInt(tabEvent[0][4].date.substr(0, 4))));
//----Dates evènement----//

for(var j=0; j < parseInt(tabEvent.length); j++){

	var frequenceDay = tabEvent[j][6];
	de[j] = new Array();
	me[j] = new Array();
	ye[j] = new Array();
	frequenceMonth = 0;
	frequenceYear = 0;
	de[j][0]=parseInt(tabEvent[j][4].date.substr(8, 2));
	me[j][0]=parseInt(tabEvent[j][4].date.substr(5, 2));
	ye[j][0]=parseInt(tabEvent[j][4].date.substr(0, 4));
	//itteration = (nbYear/2*365)/frequenceE*7
	var l = 0
	for(var k=1; k < 2; k++, l++){
		//alert(me[j][1]);
		var nbDays = maxDays(parseInt(me[j][l]-1+frequenceMonth), parseInt(ye[j][l]+frequenceYear));
		//alert(nbDays);
		//alert(parseInt(me[j][l])-1+frequenceMonth + ", " + parseInt(ye[j][l])+frequenceYear);
		if(de[j][l]+frequenceDay > parseInt(nbDays)){
			frequenceMonth = Math.trunc((de[j][l]+frequenceDay)/nbDays);
			de[j][k] = de[j][l]-nbDays+frequenceDay;
		}	
		else{
			de[j][k] = de[j][l]+frequenceDay;
			frequenceMonth = 0;
		}
		if (parseInt(me[j][l])+frequenceMonth > 12){
			me[j][k] = frequenceMonth;
			frequenceYear++;
		}
		else{
			me[j][k] = parseInt(me[j][l])+frequenceMonth;
		}
		ye[j][k] = parseInt(ye[j][l])+frequenceYear;
	}
	//alert(de[j][1] + "/" + me[j][1] + "/" + ye[j][1] + "---" + de[j][2] + "/" + me[j][2] + "/" + ye[j][2]);
	//alert(de[j][3] + "/" + me[j][3] + "/" + ye[j][3] + "---" + de[j][4] + "/" + me[j][4] + "/" + ye[j][4]);
}
//------------------------------//


///////////////////////////////////////////////Au click sur une case/////////////////////////////////////////////////
function clickOnCase(id, cal){
	//alert(calendarWeek.currWeek);
	//----Si aucun id n'est passé, on prend celui d'aujourd'hui----//
	//=======>Calendrier mois
	//if(id.substr(0, 2) != "sp"){
	//	for (var i=0;i<=41;i++){
	//		if(eval("sp"+i).style.backgroundColor == colorToday)id = "sp"+i;
	//	}
	//}
	
	//----Définition du jour clicker----//
	var dw = parseInt(eval(id).innerHTML);
	wDate.setDate(dw);

	if(dw == "")dw = now.getDate();

	//----------Si la case clicker fait partis d'un autre mois, alors on change de mois----------//
	if(cal == calendarMonth){
		if(parseInt(id.slice(2)) > (42-15)  && eval(id).style.backgroundColor == colorOtherMonth)chMonth("+");
		else if(parseInt(id.slice(2)) < 15 && eval(id).style.backgroundColor == colorOtherMonth)chMonth("-");
	}

	
	//---------------------------Coloriage------------------------------//
	//----Recoloriage de la case clicker précèdament----//
	if (idPrec != ""
		&& eval(idPrec).style.backgroundColor != colorToday
		&& eval(idPrec).style.backgroundColor != colorOtherMonth)
		eval(idPrec).style.backgroundColor = colorMonth;
	
	var aa = 0;

	//----Coloriage de la case clicker et appel de la fonction affichageEvent----//
	for (var i=0;i<cal.nbCases;i++){
		var balise = eval("sp"+i);
		if(parseInt(balise.innerHTML)==dw 
		&& balise.innerHTML != ""	
		&& balise.style.backgroundColor != colorOtherMonth){
			if (balise.style.backgroundColor != colorToday)
				balise.style.backgroundColor = colorSelectDay;
			affichageEvent(balise, cal);
			idPrec = balise;
		}
		//----Recoloration du jour sélèctionné----//
		if(parseInt(eval("sp"+i).innerHTML) == wDate.getDate() 
		&& this.currMonth+1 == wDate.getMonth()
		&& this.currYear == wDate.getFullYear()
		&& eval("sp"+i).style.backgroundColor != colorOtherMonth
		&& eval("sp"+i).style.backgroundColor != colorToday)
			eval("sp"+i).style.backgroundColor = colorSelectDay;
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////Affichage des evènements///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function affichageEvent(id, val){
	//----Définition du jour, du mois et de l'année clicker----//
	//======>Pas pareil
	var mw = val.currMonth+1;
	var yw = val.currYear;
	//var mw = currM;
	//var ym = currY;
	dw = parseInt(eval(id).innerHTML);
	wDate.setDate(dw);
	wDate.setMonth(mw); 
	wDate.setYear(yw);
	
	var text = "";
	
	//----------Affichage de la date clicker-----------//
	text += "<td>Evènement du ";
	text += (dw < 10)?"0"+ dw:dw;	//Text prend : la valeur de la case, le jour
	text += "/";					
	text += (mw < 10)?"0"+ mw:mw;	//Text prend : valeur du mois
	text += "/";
	text += yw;						//Text prend : valeur de l'année
	text += " :</br>";

	//---------------Affichage du contenu de l'évènement-----------------//

	var textEvent = "";
	for(var j=0; j < parseInt(tabEvent.length); j++){
		for(var k=0; k<5; k++)
		{
			if(de[j][k] == dw 
			&& me[j][k] == mw
			&& ye[j][k] == yw)
				textEvent += "<table border=1><tr><td align=left><span id=title>" + tabEvent[j][0] + "</span></td><td><span id=content>" + tabEvent[j][1]+ "</span></td></tr></table>";
		}
		
	}
	
	text += (textEvent=="")?"Aucun évènement prévu pour le moment..."+"</br>":textEvent;
	//eval("ev"+i).innerHTML = text; 	//La balise dont l'id vaut 'eve' affiche le text
	document.getElementById("calPlace").innerHTML = text;
}
