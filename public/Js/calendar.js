//----------------------Variables globales----------------------//
//----Date d'aujourd'hui----//
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

//----------Evènements----------//
table.init("event");
var tabEvent = table.retour;
var de = new Array();
var me = new Array();
var ye = new Array();
//----Dates evènement----//
for(var j=0; j < parseInt(tabEvent.length); j++){
	de[j] = parseInt(tabEvent[j][4].date.substr(8, 2));
	me[j] = parseInt(tabEvent[j][4].date.substr(5, 2));
	ye[j] = parseInt(tabEvent[j][4].date.substr(0, 4));
}
//------------------------------//

//----Date clicker----//
var wDate = new Date();

//---ID de la case précèdente---//
var idPrec = "";

//var maVariable = <?php echo $_SESSION["mavariable"]; ?>;

//alert(maVariable);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////Calcul nb de jour de le mois/////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function maxDays(mm, yyyy){
	var arrD = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var annBissex = ((yyyy%4==0 && yyyy%100!=0)||yyyy%400==0)?1:0; //Si c'est une année bisextile, annBissex = 1 sinon = 0
	return arrD[mm]+((mm==1)?(annBissex?1:0):0); 
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////Au click sur une case/////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function clickOnCase(id){
	
	//----Si aucun id n'est passé, on prend celui d'aujourd'hui----//
	if(id.substr(0, 2) != "sp"){
		
		for (var i=0;i<=41;i++){
			if(eval("sp"+i).style.backgroundColor == colorToday)id = "sp"+i;
		}
	}
	
	//----Définition du jour clicker----//
	var dw = parseInt(eval(id).innerHTML);
	wDate.setDate(dw);

	if(dw == "")dw = now.getDate();

	//----------Si la case clicker fait partis d'un autre mois, alors on change de mois----------//
	if(parseInt(id.slice(2)) > (42-15)  && eval(id).style.backgroundColor == colorOtherMonth)chMonth("+");
	else if(parseInt(id.slice(2)) < 15 && eval(id).style.backgroundColor == colorOtherMonth)chMonth("-");
	
	
	//---------------------------Coloriage------------------------------//
	//----Recoloriage de la case clicker précèdament----//
	if (idPrec != ""
		&& eval(idPrec).style.backgroundColor != colorToday
		&& eval(idPrec).style.backgroundColor != colorOtherMonth)
		eval(idPrec).style.backgroundColor = colorMonth;
	
	var aa = 0;

	//----Coloriage de la case clicker et appel de la fonction affichageEvent----//
	for (var i=0;i<=41;i++, aa++){
		var balise = eval("sp"+aa);
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
	var mw = parseInt(document.calForm.selMonth.value)+1;
	var yw = parseInt(document.calForm.selYear.value);			
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
	var frequenceE = tabEvent[1][6];
	var textEvent = "";
	for(var j=0; j < parseInt(tabEvent.length); j++){
		if(de[j] == dw 
		&& me[j] == mw
		&& ye[j] == yw)
			textEvent += "<table><tr><td align=left><span id=title>" + tabEvent[j][0] + "</span></td><td><span id=content>" + tabEvent[j][1]+ "</span></td></tr></table>";

	}
	
	text += (textEvent=="")?"Aucun évènement prévu pour le moment..."+"</br>":textEvent;
	eval("eve").innerHTML = text; 	//La balise dont l'id vaut 'eve' affiche le text
}

function chMonth(plusOuMoins){
	currM = parseInt(document.calForm.selMonth.value);
	currY = parseInt(document.calForm.selYear.value);
	if (plusOuMoins == "-")
	{
		if(currM == 0){ 	//Si le mois courant est janvier, 
			(document.calForm.selYear.value == parseInt(yyyy)-2)?alert("!"):document.calForm.selYear.value--;
			document.calForm.selMonth.value=11;
		}
		else
			document.calForm.selMonth.value--;
		changeCal();
	}
	else if (plusOuMoins == "+"){
		if(currM == 11){ 	//Si le mois courant est décembre
			(document.calForm.selYear.value == parseInt(yyyy)+2)?alert("!"):document.calForm.selYear.value++;
			document.calForm.selMonth.value=0;
		}
		else
			document.calForm.selMonth.value++;
		changeCal();
		
	}
	else if (plusOuMoins == "+-"){
		document.calForm.selMonth.value = mm;
		document.calForm.selYear.value = yyyy;
		changeCal();
		clickOnCase("none");
	}


}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////Création du fond///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function writeCalendar(){
	var arrM = new Array("Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre");
	var arrY = new Array();
	for (i=0;i<=4;i++)				//5 années serront sélèctionnable
		arrY[i] = yyyy - 2 + i;
	var arrD = new Array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim");

	var text = "";
	text = "<form name=calForm>";
	text += "<table border=1>";
	text += "<tr><td>";
	text += "<table width=100%><tr>";
	text += "<td align=left>";
	text += "<span onClick='chMonth(\"-\")'><i class=\"fas fa-chevron-left\"></i></span>";
	text += "<select name=selMonth onChange='changeCal()'>"; //Quand on selectionne un mois, la fonction changeCal() est appelé
	for (i=0;i<=11;i++)		//Remplissage de la balise de selection du mois
		(i==mm)?text += "<option value= " + i + " Selected>" + arrM[i] + "</option>": text += "<option value= " + i + ">" + arrM[i] + "</option>";//Le mois courant est séléctionné au lancement
	
	text += "</select>";	
	text += "<span onClick='chMonth(\"+\")'><i class=\"fas fa-chevron-right\"></i>     </span>";
	text += "<span onClick='chMonth(\"+-\")'>    <i class=\"fas fa-calendar-day\"></i></span>"
	text += "</td>";
	text += "<td align=right>";
	text += "<select name=selYear onChange='changeCal()'>";	//Quand on selectionne une année, la fonction changeCal() est appelé
	for (i=0;i<=4;i++)		//Remplissage de la balise de selection de l'année
		(i==2)?text += "<option value= " + arrY[i] + " Selected>" + arrY[i] + "</option>": text += "<option value= " + arrY[i] + ">" + arrY[i] + "</option>";//L'année courante est séléctionnée au lancement
	
	text += "</select>";
	text += "</td>";
	text += "</tr></table>";
	text += "</td></tr>";
	text += "<tr><td>";
	text += "<table border=1>";
	text += "<tr>";
	for (i=0;i<=6;i++){
		text += "<td align=center><span>" + arrD[i] + "</span></td>"; //Affiche des jours de la semaine
	
	}
	text += "</tr>";
	aa = 0;
	for (k=0;k<=5;k++){
		text += "<tr>";
		for (i=0;i<=6;i++, aa++)
			text += "<td align=center><div id=sp" + aa + " onClick='clickOnCase(this.id)'></div></td>"; //Affiche des 42 case des jours, quand on séléctionne une case, la fonction affichage event est appelé
		text += "</tr>";
	}
	
	text += "</table>";
	text += "</td></tr>";
	text += "</table>";
	text += "<span id = eve><span>"; //Création de la balise, avec l'id 'eve'
	text += "</form>";
	document.write(text); 	//Ecriture d'une calendirer
	changeCal();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////Affichage du mois//////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function changeCal(){
	var currM = parseInt(document.calForm.selMonth.value); //Mois qui est affiché
	var prevM = (currM==0)?11:currM-1; //Mois précédent au mois affiché
	var nextM = (currM==11)?0:currM+1;
	var currY = parseInt(document.calForm.selYear.value); //Récupération de l'année qui est affichée
	var mmyyyy = new Date();
	mmyyyy.setFullYear(currY);
	mmyyyy.setMonth(currM);
	mmyyyy.setDate(1); //==> mmyyyy = 1/currM/currY
	var day1 = mmyyyy.getDay();
	if (day1 == 0)
		day1 = 7;
	var arrN = new Array(41);
	var aa;
	//------------------Coloration et définition du contenu de chaque case du tableau------------------//
	
	//----Mois précèdent----//
	for (i=0;i<day1-1;i++){
		arrN[i] = maxDays(prevM,currY) - day1 + i+2;
		eval("sp"+i).style.backgroundColor = colorOtherMonth;
	}
	
	//----Mois en court----//
	aa = 1;
	for (i=day1-1;i<=day1+maxDays(currM,currY)-2;i++,aa++){
		arrN[i] = aa ;
		if ((arrN[i]==dd)&&(mm==currM)&&(yyyy==currY)){ //Aujourd'hui
			eval("sp"+i).style.backgroundColor=colorToday;
			clickOnCase("none");
		}
		else
			eval("sp"+i).style.backgroundColor=colorMonth;
	}
	
	//----Mois suivant----//
	aa = 1;
	for (i=day1+maxDays(currM,currY)-1;i<=41;i++,aa++){
		arrN[i] = aa;
		eval("sp"+i).style.backgroundColor = colorOtherMonth;
	}
	//-------------------------------------------------------------------------------------------------//
	
	//------------------------Définition de la taille et remplissage des cases-------------------------//
	var windowWidth = parseInt(document.body.clientWidth)-30; //Définition de la taille de la fenêtre
	//----Parcour de toutes les cases----//
	for (i=0;i<=41;i++){
		eval("sp"+i).style.height = "50px";	//Définition de la hauteur des cases
		eval("sp"+i).style.width = (document.body.clientWidth < 738)?windowWidth/7+"px":windowWidth/21+"px"; //Définition de la largeur des cases en fontion de la taille de la fenêtre
		eval("sp"+i).innerHTML = arrN[i]; //Remplissage des cases
		//----Parcour de tous les évènements----//
		for(var j=0; j < parseInt(tabEvent.length); j++){
			if((eval("sp"+i).innerHTML == de[j] && currY == ye[j]) //Si le jour et l'année de l'évènement sont affiché
			&& (	(currM+1 == me[j] && eval("sp"+i).style.backgroundColor != colorOtherMonth) //Et le mois (avec la bonne couleur)
				||	(((prevM+1 == me[j] && i<15) //Ou le mois precedent 
					||	(nextM+1 == me[j] && i>15)) //Ou le mois suivant 
						&& ( eval("sp"+i).style.backgroundColor == colorOtherMonth))))//(avec la bonne couleur)
					eval("sp"+i).innerHTML += "<a><br><i  class=\"far fa-dot-circle\"></i></br></a>"; //Alort affiché un cercle
		}	  
		//--------------------------------------//
		
		//----Recoloration du jour sélèctionné----//
		if(eval("sp"+i).innerHTML == wDate.getDate() 
		&& currM+1 == wDate.getMonth()
		&& currY == wDate.getFullYear()
		&& eval("sp"+i).style.backgroundColor != colorOtherMonth
		&& eval("sp"+i).style.backgroundColor != colorToday)
			eval("sp"+i).style.backgroundColor = colorSelectDay;
	}						  
	//-------------------------------------------------------------------------------------------------//
}

//-------Redimenssion du calendrier en fonction de la taille de la fenêtre-------//
window.onresize = function resize(){ 
	var windowWidth = parseInt(document.body.clientWidth)-30;
	if(windowWidth < 738)
		for (i=0;i<=41;i++)eval("sp"+i).style.width = windowWidth/7+"px";
	else
		for (i=0;i<=41;i++)eval("sp"+i).style.width = windowWidth/21+"px";
};

writeCalendar();
