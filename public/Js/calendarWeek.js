var now = new Date;
var dd = now.getDate();
var mm = now.getMonth();
var dow = now.getDay();
var yyyy = now.getFullYear();


//----Couleurs des cases----//
var colorOtherMonth = "lightgray";
var colorMonth = "#ececec";
var colorToday = "deepskyblue";
var colorSelectDay = "white";

var arrM = new Array("Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre");

var windowWidth = parseInt(document.body.clientWidth);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////Calcul nb de jour de le mois/////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function maxDays(mm, yyyy){
	var arrD = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var annBissex = ((yyyy%4==0 && yyyy%100!=0)||yyyy%400==0)?1:0; //Si c'est une année bisextile, annBissex = 1 sinon = 0
	return arrD[mm]+((mm==1)?(annBissex?1:0):0); 
}

function nbWeek(dd, mm, yyyy){
	var nbJour = 0;
	for(var i= 0; i < mm; i++)
		nbJour += parseInt(maxDays(i, yyyy));
	return Math.trunc((nbJour+dd)/7)+1;
}

//----Date clicker----//
var wDate = new Date();

//---ID de la case précèdente---//
var idPrec = "";

function clickOnCase(id){
	
	//----Si aucun id n'est passé, on prend celui d'aujourd'hui----//
	//if(id.substr(0, 2) != "sp"){
	//	for (var i=0;i<=41;i++){
	//		if(eval("sp"+i).style.backgroundColor == colorToday)id = "sp"+i;
	//	}
	//}
	
	//----Définition du jour clicker----//
	var dw = parseInt(eval(id).innerHTML);
	wDate.setDate(dw);

	if(dw == "")dw = now.getDate();

	//---------------------------Coloriage------------------------------//
	//----Recoloriage de la case clicker précèdament----//
	if (idPrec != ""
		&& eval(idPrec).style.backgroundColor != colorToday
		&& eval(idPrec).style.backgroundColor != colorOtherMonth){
		eval(idPrec).style.backgroundColor = colorMonth;
	}

	
	var aa = 0;

	//----Coloriage de la case clicker et appel de la fonction affichageEvent----//
	for (var i=0;i<14;i++){
		var balise = eval("sp"+i);
		if(parseInt(balise.innerHTML)==dw 
		&& balise.innerHTML != ""	
		&& balise.style.backgroundColor != colorOtherMonth){
			if (balise.style.backgroundColor != colorToday)
				balise.style.backgroundColor = colorSelectDay;
			affichageEvent(balise);
			idPrec = balise;
		}
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////Affichage des evènements///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function affichageEvent(id){
	//----Définition du jour, du mois et de l'année clicker----//
	var mw = eval("month").innerHTML;
	var yw = parseInt(eval("year").innerHTML);			
	dw = parseInt(eval(id).innerHTML);
	wDate.setDate(dw);	
	//wDate.setMonth(mw); 
	wDate.setYear(yw);

	var text = "";

	//----------Affichage de la date clicker-----------//
	//text += "<td>Evènement du ";
	//text += (dw < 10)?"0"+ dw:dw;	//Text prend : la valeur de la case, le jour
	//text += "/";					
	//text += mw;	//Text prend : valeur du mois
	//text += "/";
	//text += yw;						//Text prend : valeur de l'année
	//text += " :</br>";

//---------------Affichage du contenu de l'évènement-----------------//

	var textEvent = "";
	//for(var j=0; j < parseInt(tabEvent.length); j++){
	//	for(var k=0; k<5; k++)
	//	{
	//		if(de[j][k] == dw 
	//			&& me[j][k] == mw
	//			&& ye[j][k] == yw)
	//			textEvent += "<table border=1><tr><td align=left><span id=title>" + tabEvent[j][0] + "</span></td><td><span id=content>" + tabEvent[j][1]+ "</span></td></tr></table>";

	//	}

	//}
	
	//text += (textEvent=="")?"Aucun évènement prévu..."+"</br>":textEvent;
	for (var i=0; i<14; i++){
		eval("ev"+i).innerHTML = text; 	//La balise dont l'id vaut 'eve' affiche le text
	}
}

function changeCalWeek(){
	//---Définition de l'année et de la semaine courante---//
	var currYear = parseInt(eval("year").innerHTML);
	var currWeek = parseInt(document.calWeekForm.selWeek.value);

	//--Définition des variables servant au calcul des jours--//
	var nbMonth = 0; //Futur numéro mois courrant
	//Calcul du premier jour à afficher//
	var firstDayYearSate = new Date();
	firstDayYearSate.setMonth(0);
	firstDayYearSate.setDate(1);
	firstDayYearSate.setFullYear(currYear);
	var D = firstDayYearSate.getDay();

	var firstDay = (currWeek-1)*7-(D-2);//Premier jour à afficher
	while (firstDay > maxDays(nbMonth, currYear))
	{
		firstDay -= maxDays(nbMonth, currYear);
		nbMonth++;	
	}
	var prevM= "";
	var nextM="";
	var currM ="";
	for (var i=0; i<14; i++){
		eval("ev"+i).style.height = "26px";
		(windowWidth < 768)?eval("sp"+i).style.width = windowWidth/2-27+"px":eval("sp"+i).style.width = windowWidth/6+"px";
		
		if(firstDay+i<1){
			eval("sp"+i).innerHTML = firstDay+i+ maxDays((nbMonth==0)?11:nbMonth-1, (nbMonth-1==-1)?currYear-1:currYear);
			prevM=arrM[(nbMonth==0)?11:nbMonth-1];
			eval("sp"+i).style.background = colorOtherMonth;
			eval("ev"+i).style.background = colorOtherMonth;
		}
		else if (firstDay+i> maxDays(nbMonth, currYear)){
			eval("sp"+i).innerHTML = firstDay+i - maxDays(nbMonth, currYear);
			nextM=arrM[(nbMonth==11)?0:nbMonth+1];
			eval("sp"+i).style.background = colorOtherMonth;
			eval("ev"+i).style.background = colorOtherMonth;
		}
		else {
			eval("sp"+i).innerHTML = firstDay+i;
			(eval("sp"+i).innerHTML == dd && currYear == yyyy && nbMonth==mm)?eval("sp"+i).style.backgroundColor = colorToday:eval("sp"+i).style.backgroundColor = colorMonth;
			currM=arrM[nbMonth];
			eval("sp"+i).style.background = colorMonth;
			eval("ev"+i).style.background = colorMonth;
		}
		
	}
	eval("month").innerHTML = ((prevM!="")?prevM+ "-":"")+ currM +((nextM!="")?"-"+nextM+" ":" ");

}

function chWeek(plusOuMoins){
	var currWeek = parseInt(document.calWeekForm.selWeek.value);
	
	if (plusOuMoins == "-")
	{
		if(currWeek == 1){ 	//Si le mois courant est janvier, 
			document.calWeekForm.selWeek.value=52;
			eval("year").innerHTML = parseInt(eval("year").innerHTML)-1;
		}
		else
			document.calWeekForm.selWeek.value--;
	}
	else if (plusOuMoins == "+"){
		if(currWeek == 52){ 	//Si le mois courant est décembre
			document.calWeekForm.selWeek.value=1;
			eval("year").innerHTML = parseInt(eval("year").innerHTML)+1;
		}
		else
			document.calWeekForm.selWeek.value++;
	}
	else if (plusOuMoins == "+-"){
		document.calWeekForm.selWeek.value = nbWeek(dd, mm, yyyy);
		eval("year").innerHTML = yyyy;
	}
	changeCalWeek();

}

function calWeekWhriteHTML(){
	var arrD = new Array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim");
	var arrM = new Array("Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre");

	var text = "";
	text = "<form name=calWeekForm>";
	text += "<table border=1>";
		text += "<tr><td>";
		text += "<table>"
			text += "<tr><td>";
			text += "<span onClick='chWeek(\"+-\")'>    <i style=\"font-size:30px\" class=\"fas fa-calendar-day\"></i></span>";
			text += "</td><td width="+ parseInt(windowWidth/4)+"px"+" align=center>"
			text += "<span onClick='chWeek(\"-\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-left\"></i></span>";
			text += "<select style=\"font-size:20px\" name=selWeek onChange='changeCalWeek()'>"; //Quand on selectionne un mois, la fonction changeCal() est appelé
			for (i=1;i<=52	;i++)		//Remplissage de la balise de selection du mois
				(i==nbWeek(dd, mm, yyyy))?text += "<option value= " + i + " Selected>" + "Sem" + i + "</option>": text += "<option value= " + i + ">" + "Sem" + i + "</option>";//Le mois courant est séléctionné au lancement
			text += "</select>";
			text += "<span onClick='chWeek(\"+\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-right\"></i>     </span>";				
			text += "</td></tr></table><tr align=center><td>";		
			text += "<span id=month>"+arrM[mm]+"</span>";
			text += "<span id=year>   "+yyyy+"</span>";
		text += "</td></tr>";
		text += "<tr><td>";
			text += "<table border=1>";
				text += "<tr><td>";
					text += "<table>";
						for (i=0;i<=6;i++)
							text += "<tr align=center><td ><div style=\"height:50px\">" + arrD[i] + "</div></td></tr>"; //Affiche des jours de la semaine
					text += "</table>";
				text += "</td>";	
				var aa = 0;
				for (j=0; j<=1; j++)
				{
					text += "<td>";
						text += "<table border=1>";
						for (i=0;i<=6;i++, aa++){
							text += "<tr><td onClick='clickOnCase(sp"+aa+")'>";
							text += "<div id=sp"+ aa +">1</div>"
							text += "<div id=ev"+ aa +"></div>"
							text +="</td></tr>"
							
							//alert("sp"+aa);
						}
						text += "</table>";
					text += "</td>";
				}
				text+= "</tr>";
			table += "</table>";
		text += "</td></tr>";
		table += "</table>"
	//text += "<span id = eve><span>"; //Création de la balise, avec l'id 'eve'
	//text = "</form>";
	return text;
}
document.getElementById("btCalWeek").addEventListener("click", function(){
	document.getElementById("tamer").innerHTML = calWeekWhriteHTML(); 	//Ecriture d'une calendirer
	changeCalWeek();
});





window.onresize = function resize(){
	windowWidth = parseInt(document.body.clientWidth);
	if(windowWidth < 768)
		for (i=0;i<14;i++)eval("sp"+i).style.width = windowWidth/2-27+"px";
	else
		for (i=0;i<14;i++)eval("sp"+i).style.width = windowWidth/6+"px";
};