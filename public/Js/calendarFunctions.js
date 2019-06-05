/*var tabEvent = new Array();
//tabEvent[0]  = new Array();


tabEvent[0][0] = 1;
tabEvent[0][3] = "NULL";
tabEvent[0][1] = "Brosser les chiottes";
tabEvent[0][2] = "Penser à récurer le dessous";
tabEvent[0][4] = 1;
tabEvent[0][5] = "2019-04-27";
tabEvent[0][6] = 1;
tabEvent[0][7] = 7;
*/
//----------------------Variables globales----------------------//
//----Date d'aujourd'hui----//
var now = new Date;
var dd = now.getDate();
var mm = now.getMonth();
var dow = now.getDay();
var yyyy = now.getFullYear();

var nbYear = 6;

var caseHeight = "50px"; //Hauteur de la case
var windowWidth = parseInt(document.body.clientWidth)-30; //Définition de la taille de la fenêtre

//----Couleurs des cases----//
var colorOtherMonth = "lightgray";
var colorMonth = "#ececec";
var colorToday = "deepskyblue";
var colorSelectDay = "white";

var isItToday = new Boolean();
//----Date clicker----//
var wDate = new Date();

//---ID de la case précèdente---//
var idPrec = "";

var arrM = new Array("Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre");
var arrY = new Array();

for (var i=0;i<=nbYear;i++){				//5 années serront sélèctionnable
	arrY[i] = yyyy - nbYear/2 + i;
}

var arrD = new Array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim");


var windowWidth = parseInt(document.body.clientWidth);

function syntaxe(arg, add){
	return ((parseInt(add+arg)<10)?"0"+parseInt(add+arg):parseInt(add+arg));
}

function nbWeeks(dd, mm, yyyy){
	var nbJour = 0;
	for(var i= 0; i < mm; i++)
		nbJour += parseInt(nbDays(i, yyyy));
	return Math.trunc((nbJour+dd)/7)+1;
}


////////////////////////////////////////////Calcul nb de jour de le mois/////////////////////////////////////////////
function nbDays(mm, yyyy){
	var arrD = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var annBissex = ((yyyy%4==0 && yyyy%100!=0)||yyyy%400==0)?1:0; //Si c'est une année bisextile, annBissex = 1 sinon = 0
	return arrD[mm]+((mm==1)?(annBissex?1:0):0); 
}


//----------Evènements----------//

var user = table.GetCurrentUser();
//console.log(user);

var tabEvent ="";
var de = new Array();
var me = new Array();
var ye = new Array();

var frequenceDay;
var frequenceMonth;
var frequenceYear;

function getEvents(nbCases, dateStart, dateEnd){
	
	tabEvent = "";
	console.log(dateStart);
	dateStart = dateStart.substr(6,4) + "-" + syntaxe(dateStart.substr(3,2),-1) + "-" + dateStart.substr(0,2);
	dateEnd = dateEnd.substr(6,4) + "-" + syntaxe(dateEnd.substr(3,2),1) + "-" + dateEnd.substr(0,2);

	tabEvent = table.ByDate(dateStart, dateEnd);
	

	if(tabEvent != ""){
		for(var j=0; j < parseInt(tabEvent.length); j++){
			var frequenceE = tabEvent[j][7];//;
			
			//var unitFrequence = frequenceE.replace(parseInt(frequenceE),"");

			if(frequenceE.indexOf("d") > 0) frequenceDay = parseInt(frequenceE);
			else frequenceDay = 0;
			if(frequenceE.indexOf("w") > 0) frequenceDay = parseInt(frequenceE)*7;
			if(frequenceE.indexOf("m") > 0) frequenceMonth = parseInt(frequenceE);
			else frequenceMonth = 0;
			if(frequenceE.indexOf("y") > 0) frequenceYear = parseInt(frequenceE);
			else frequenceYear = 0;
			
			//console.log(frequenceDay +"/"+ frequenceMonth +"/"+ frequenceYear);
			de[j] = new Array();
			me[j] = new Array();
			ye[j] = new Array();
			de[j][0]=parseInt(tabEvent[j][5].date.substr(8, 2));
			me[j][0]=parseInt(tabEvent[j][5].date.substr(5, 2));
			ye[j][0]=parseInt(tabEvent[j][5].date.substr(0, 4));

			var l = 0;
			for(var k=1; k <= 7; k++, l++){
				var nbDay = nbDays(parseInt(me[j][l]-1+frequenceMonth), parseInt(ye[j][l]+frequenceYear));

				if(parseInt(de[j][l])+frequenceDay > parseInt(nbDay)){
					frequenceMonth = Math.trunc((parseInt(de[j][l])+frequenceDay)/nbDay);
					de[j][k] = parseInt(de[j][l])-nbDay+frequenceDay;
				}	
				else{
					de[j][k] = parseInt(de[j][l])+frequenceDay;
					if(frequenceDay != "")frequenceMonth = 0;
				}
				if (parseInt(me[j][l])+frequenceMonth > 12){
					me[j][k] = frequenceMonth-(12-parseInt(me[j][l]));
					frequenceYear++;
				}
				else{
					me[j][k] = parseInt(me[j][l])+frequenceMonth;
					if((frequenceDay != "" || frequenceMonth != "") && frequenceYear >0) frequenceYear--;
				}
				de[j][k] = syntaxe(de[j][k],0);
				me[j][k] = syntaxe(me[j][k],0);
				ye[j][k] = parseInt(ye[j][l])+frequenceYear;
			}
			de[j][0] = syntaxe(de[j][0],0);
			me[j][0] = syntaxe(me[j][0],0);
			//console.log(de[j][0] + "/" + me[j][0] + "/" + ye[j][0] + "---" + de[j][1] + "/" + me[j][1] + "/" + ye[j][1]);
			//console.log(de[j][2] + "/" + me[j][2] + "/" + ye[j][2] + "---" + de[j][3] + "/" + me[j][3] + "/" + ye[j][3]);
			//console.log(de[j][4] + "/" + me[j][4] + "/" + ye[j][4] + "---" + de[j][5] + "/" + me[j][5] + "/" + ye[j][5]);
		}
	}
	
	for(var i = 0; i < nbCases; i++){
		var nbEvent =0;
		for (var j = 0; j < parseInt(tabEvent.length); j++){
			for (var k = 0; k <= parseInt(de[0].length); k++){
				var dateEvent = de[j][k] + "/" + me[j][k] +"/"+ ye[j][k];
				if(dateEvent == eval("sp"+i).name){
					nbEvent++;
				}	 
			//--------------------------------------//
			}
		}
		var notif = "";
		//nbEvent = 0;
		for(var l=1; l<=nbEvent; l++){
			switch(l){
			case 1 : 
				eval("sp"+i).innerHTML += "<a></br><i style=\"font-size:15px\" class=\"far fa-dot-circle\"></i></a>";
				break;
			case 2 :
				eval("sp"+i).innerHTML += " <i style=\"font-size:15px\" class=\"far fa-dot-circle\"></i>";
				break;
			case 3 :
				if(nbEvent ==3){ 
					eval("sp"+i).innerHTML += " <i style=\"font-size:15px\" class=\"far fa-dot-circle\"></i>";
					break;
				}
			default :
				notif = "+" + parseInt(nbEvent - 2);
				break;
			}
		}
		eval("sp"+i).innerHTML += notif;
	}
} 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////Affichage des evènements///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function affichageEvent(date){
	var text = "";
	calendarMonth.eventAffiche = date;
	calendarWeek.eventAffiche = date;
	//----------Affichage de la date clicker-----------//
	text += "<td><div align=\"center\" class=dayStyle>Evènement ";
	text += (date == syntaxe(dd,0)+"/"+syntaxe(mm,1)+"/"+yyyy)?"d'aujourd'hui":"du "+date;
	text += " :</br></div>";
	
	//---------------Affichage du contenu de l'évènement-----------------//
	var textEvent = "";
	var dateEvent;
	for(var j=0; j < parseInt(tabEvent.length); j++){
		for(var k=0; k <= parseInt(de[0].length); k++)
		{
			dateEvent = de[j][k] + "/" + me[j][k] +"/"+ ye[j][k];

			if(dateEvent == date){
				if (textEvent.indexOf("Titre") == -1){
					textEvent += "<table border=1px class=\"tabEventStyle\"><tr class=\"dayStyle\"><td>Titre</td><td>Descrption</td><td>3D</td></tr>" +
							"<tr color=\"blue\"><td align=left><span id=title>" + tabEvent[j][1] + "</span></td><td><span id=content>" + tabEvent[j][2]+ "</span></td><td><div class=\"acces3D\" onClick=\"document.location.href='/modele/2'\">Accés Modèle 3D</div></td>";
				}
				else{
					textEvent += "<tr><td align=left><span id=title>" + tabEvent[j][1] + "</span></td><td><span>" + tabEvent[j][2]+ "</span></td>" 
					if(tabEvent[j][3] != ""){
						textEvent += "<td><div class=\"acces3D\" onClick=\"document.location.href='/modele/"+	tabEvent[j][3] + "'\">Accés Modèle 3D</div></td>";
					}
					else	textEvent +="<td><div>X</div></td>";
				}		
				textEvent += "</tr>"
			}
		}//																			
	}
	text += (textEvent=="")?"Aucun évènement prévu pour le moment..."+"</br>":textEvent + "</table>";
	//windowWidth = parseInt(document.body.clientWidth);
	//if(windowWidth > 768) 
	eval("EventPlace").innerHTML = text;
	//else eval("EventPlace2").innerHTML = text;
}



///////////////////////////////////////////////Au click sur une case/////////////////////////////////////////////////
function clickOnCase(id, cal){
	//----Définition du jour clicker----//
	var dateClick = eval(id).name;
	
	//----------Si la case clicker fait partis d'un autre mois, alors on change de mois----------//
	if(cal == calendarMonth){
		if(parseInt(eval(id).name.substr(6,4)) > parseInt(cal.currYear) || (parseInt(eval(id).name.substr(3,2)) > parseInt(cal.currMonth+1) && eval(id).name.substr(3,2) != "12"))cal.changeMth("+");
		else if(parseInt(eval(id).name.substr(6,4)) < parseInt(cal.currYear) || (parseInt(eval(id).name.substr(3,2)) < parseInt(cal.currMonth+1) && eval(id).name.substr(3,2) != "01"))cal.changeMth("-");
	}	
	
	//---------------------------Coloriage------------------------------//
	//----Recoloriage de la case clicker précèdament----//
	if(idPrec != ""){
		for (var i=0;i<cal.nbCases;i++){
			var balise = eval("sp"+i);
			if (eval(idPrec).style.backgroundColor != colorToday){
				if (eval("sp"+i).name == cal.eventAffiche){
					eval("sp"+i).style.background = (cal.eventAffiche.substr(3,7) == syntaxe(cal.currMonth,1)+"/"+cal.currYear)?colorMonth:colorOtherMonth;
				}
			}
		}
	}
	//----Coloriage de la case clicker----//
	for (var i=0;i<cal.nbCases;i++){
		var balise = eval("sp"+i);
		if(balise.name == dateClick){
			if(balise.style.backgroundColor != colorToday)balise.style.backgroundColor = colorSelectDay;
			affichageEvent(balise.name);
			idPrec = balise;
		}
	}
	
}

window.onresize = function resize(){
	var whatCal = eval("calPlace").innerHTML.substr(12, 11);
	if(windowWidth < 768){
		if(whatCal == "calWeekForm") {for (i=0;i<14;i++) eval("sp"+i).style.width = windowWidth/2-80+"px";}
		else {for (i=0;i<14;i++) eval("sp"+i).style.width = windowWidth/7-30+ "px";}
	}
	else
		if(whatCal == "calWeekForm") {for (i=0;i<14;i++)eval("sp"+i).style.width = windowWidth/6-30+"px"}
		else {for (i=0;i<14;i++) eval("sp"+i).style.width = windowWidth/21+ "px";}
};
