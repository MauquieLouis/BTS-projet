var now = new Date;
var dd = now.getDate();
var mm = now.getMonth();
var dow = now.getDay();
var yyyy = now.getFullYear();
var colorOtherMonth = "lightgray";
var colorMonth = "#ececec";
var colorToday = "deepskyblue";
var colorSelectDay = "white";

var event = {
		getTable : function(){
			var tabl = [
				["id","Vidange Bac","Il faut vider le bac",['2','4'],['14','15','16'],"2019-03-31",52],
				["id","Vidange Bac","Il faut vider le bac",['2','4'],['14','15','16'],"2019-03-12",52],
//				["id","Vidange Bac","Il faut vider le bac",['2','4'],['14','15','16'],"2019-03-31",52],
//				["id","Vidange Bac","Il faut vider le bac",['2','4'],['14','15','16'],"2019-03-31",52],
			];
			return tabl;
		},
	};



var tabEvent = event.getTable();

var de = tabEvent[1][5].substr(8, 2);
var me = tabEvent[1][5].substr(5, 2);
var ye = tabEvent[1][5].substr(0, 4);

function maxDays(mm, yyyy){
	var arrD = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var annBissex = ((yyyy%4==0 && yyyy%100!=0)||yyyy%400==0)?1:0; //Si c'est une année bisextile, annBissex = 1 sinon = 0
	return arrD[mm]+((mm==1)?(annBissex?1:0):0); 
}

var wDate = new Date();
var idPrec = "";
function clickOnCase(id){
	var dw = parseInt(eval(id).innerHTML)
	wDate.setDate(dw);

	if(dw == "")dw = now.getDate();


	if(parseInt(id.slice(2)) > (42-15)  && eval(id).style.backgroundColor == colorOtherMonth){ 		//Si la case séléctionée fait partie du mois d'après
		chMonth("+");
	}
	else if(parseInt(id.slice(2)) < 15 && eval(id).style.backgroundColor == colorOtherMonth){ //Si la case séléctionée fait partie du mois d'avant
		chMonth("-");
	}
	
	//-------------------Coloriage des cases----------------------//
	if (idPrec != ""
		&& eval(idPrec).style.backgroundColor != colorToday
		&& eval(idPrec).style.backgroundColor != colorOtherMonth)
		eval(idPrec).style.backgroundColor = colorMonth;
	
	var aa = 0;

	for (var i=0;i<=41;i++, aa++){
		if(eval("sp"+aa).innerHTML==dw 
		&& eval("sp"+aa).innerHTML != ""	
		&& eval("sp"+aa).style.backgroundColor != colorOtherMonth){
			if (eval("sp"+aa).style.backgroundColor != colorToday)
				eval("sp"+aa).style.backgroundColor = colorSelectDay;
			idPrec = "sp"+aa;
			affichageEvent("sp"+aa);
		}
	}
}

function affichageEvent(id){
	
	var mw = parseInt(document.calForm.selMonth.value)+1;	//Initialisation de la variables d'affichage du mois (janvier vaut 0, donc +1)
	var yw = parseInt(document.calForm.selYear.value); //Initialisation de la variables d'affichage de l'année					
	dw = eval(id).innerHTML;
	wDate.setDate(dw);
	wDate.setMonth(mw); 
	wDate.setYear(yw);
	var text = "";
	
	//----------Affichage des évènements avec la date-----------//
	//if(dw < 10) dw = 0+dw;
	text += "<td>Evènement du ";
	text += dw;		//Text prend : la valeur de la case, le jour
	text += "/";					
	if(mw < 10) text += "0"+ mw;	//Text prend : valeur du mois
	text += "/";
	text += yw;						//Text prend : valeur de l'année
	text += " : ";
	//text += "<button align=right onClick=''>+</button>";
	

	//---------------Affichage du contenu de l'évènement-----------------//
	var frequenceE = tabEvent[1][6];
	
	if(de == dw && me == mw){
		text += tabEvent[1][1] + " : " + tabEvent[1][2];
	}
	else text += "Aucun évènement prévu pour le moment...";
	text += "</td>";
	eval("eve").innerHTML = text; 	//La balise dont l'id vaut 'eve' affiche le text
}


function chMonth(plusOuMoins){
	currM = parseInt(document.calForm.selMonth.value);
	if (plusOuMoins == "-")
	{
		if(currM == 0){ 	//Si le mois courant est janvier, 
			document.calForm.selYear.value--;
			document.calForm.selMonth.value=11;
		}
		else{
			document.calForm.selMonth.value--;
		}
	}
	else{
		if(currM == 11){ 	//Si le mois courant est décembre
			document.calForm.selYear.value++;
			document.calForm.selMonth.value=0;
		}
		else{
			document.calForm.selMonth.value++;
		}
	}
	changeCal();
}

function creatEvent(){
	
	
}
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
	for (i=0;i<=11;i++){		//Remplissage de la balise de selection du mois
		if (i==mm){
			text += "<option value= " + i + " Selected>" + arrM[i] + "</option>"; //Le mois courant est séléctionné au lancement
		}
		else{
			text += "<option value= " + i + ">" + arrM[i] + "</option>";
		}
	}
	text += "</select>";	
	text += "<span onClick='chMonth(\"+\")'><i class=\"fas fa-chevron-right\"></i></span>";
	text += "</td>";

	//changeCal();
	text += "<td align=right>";
	text += "<select name=selYear onChange='changeCal()'>";	//Quand on selectionne une année, la fonction changeCal() est appelé
	for (i=0;i<=4;i++){			//Remplissage de la balise de selection de l'année
		if (i==2){
			text += "<option value= " + arrY[i] + " Selected>" + arrY[i] + "</option>"; //L'année courante est séléctionnée au lancement
		}
		else{
			text += "<option value= " + arrY[i] + ">" + arrY[i] + "</option>";
			}
	}
	text += "</select>";
	text += "</td>";
	text += "</tr></table>";
	text += "</td></tr>";
	text += "<tr><td>";
	text += "<table border=1>";
	text += "<tr>";
	for (i=0;i<=6;i++){
		text += "<td align=center><span backgroundcolor=#aeaeae>" + arrD[i] + "</span></td>"; //Affiche des jours de la semaine
	
	}
	text += "</tr>";
	aa = 0;
	for (k=0;k<=5;k++){
		text += "<tr>";
		for (i=0;i<=6;i++, aa++){
			text += "<td align=center><div  id=sp" + aa + " onClick='clickOnCase(this.id)'></div></td>"; //Affiche des 42 case des jours, quand on séléctionne une case, la fonction affichage event est appelé
			//document.getElementById("sp"+aa).onclick = clickOnCase("sp"+aa);
		}
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
function changeCal(){
	var currM = parseInt(document.calForm.selMonth.value); //Récupération du mois qui est affiché
	var prevM = (currM==0)?11:currM-1; //Mois précédent au mois affiché
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
	for (i=0;i<day1-1;i++){
		arrN[i] = maxDays(prevM,currY) - day1 + i+2;
		eval("sp"+i).style.backgroundColor = colorOtherMonth;
	}
	aa = 1;
	for (i=day1-1;i<=day1+maxDays(currM,currY)-2;i++,aa++){
		arrN[i] = aa ;
		if ((arrN[i]==dd)&&(mm==currM)&&(yyyy==currY)){
			eval("sp"+i).style.backgroundColor=colorToday;
		}
		else
			eval("sp"+i).style.backgroundColor=colorMonth;
	}

	aa = 1;
	for (i=day1+maxDays(currM,currY)-1;i<=41;i++,aa++){
		arrN[i] = aa;
		eval("sp"+i).style.backgroundColor = colorOtherMonth;
	}
	var windowWidth = parseInt(document.body.clientWidth)-30;
	for (i=0;i<=41;i++){
		eval("sp"+i).style.height = (document.body.clientWidth < 738)?"40px":"50px";
		eval("sp"+i).style.width = (document.body.clientWidth < 738)?windowWidth/7+"px":windowWidth/21+"px";
		eval("sp"+i).innerHTML = arrN[i];
		for(var j=0; j < parseInt(tabEvent.length); j++){
		//alert(eval("sp"+i).innerHTML + "=="  + tabEvent[j][5].substr(8, 2) + " && " + (((currM+1)<10)?"0"+(currM+1):(currM+1)) + "=="  + tabEvent[j][5].substr(5, 2));
			if(eval("sp"+i).innerHTML == tabEvent[j][5].substr(8, 2) 
			&& (((currM+1)<10)?"0"+(currM+1):(currM+1)) == tabEvent[j][5].substr(5, 2))
			{
				//alert("youpisuper");
				eval("sp"+i).innerHTML += "<br><i  class=\"far fa-dot-circle\"></i></br>";
				alert(eval("sp"+i).innerHTML);
			}
		}
		if(eval("sp"+i).innerHTML == wDate.getDate()	//Si le jour séléctionner est afficher apres avoir changer de mois 
			&& currM+1 == wDate.getMonth()
			&& currY == wDate.getFullYear()
			&& eval("sp"+i).style.backgroundColor != colorOtherMonth
			&& eval("sp"+i).style.backgroundColor != colorToday)
		{
			eval("sp"+i).style.backgroundColor = colorSelectDay;	//Alors, on le coloris en blanc
		}
	}
	
}

window.onresize = function resize(){ 
	var windowWidth = parseInt(document.body.clientWidth)-30;
	if(width < 738){
		for (i=0;i<=41;i++){
			eval("sp"+i).style.width = windowWidth/7+"px";
			eval("sp"+i).style.height = "40px";
		}
	}
	else{
		for (i=0;i<=41;i++){
			eval("sp"+i).style.width = windowWidth/21+"px";
			eval("sp"+i).style.height = "50px";
		}
	}
};

writeCalendar();
