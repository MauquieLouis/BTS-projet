
class calMonth{
	currYear;
	currWeek;
	currMonth;
	nbCases = 42;
	
	set currMonth(month){
		this.currMonth = parseInt(month);
	}
	set currYear(currYear){
		this.currYear = currYear;
	}
	set currWeek(currWeek){
		this.currWeek = currWeek;
	}


	chMonth(plusOuMoins){
		this.currMonth = parseInt(document.calForm.selMonth.value);
		this.currYear = parseInt(document.calForm.selYear.value);
		switch (plusOuMoins) {
		  case '-':
			  if(this.currMonth == 0){ 	//Si le mois courant est janvier, 
					(this.currYear == parseInt(yyyy)-nbYear/2)?alert("!"):this.currYear--;
					this.currMonth =11;
				}
				else
					this.currMonth--;
				break;
		  case '+':
			  if(this.currMonth == 11){ 	//Si le mois courant est décembre
					(this.currYear == parseInt(yyyy)+nbYear/2)?alert("!"):this.currYear++;
					this.currMonth=0;
				}
				else
					this.currMonth++;
				
			  break;
		  case '+-':
			 	this.currMonth = mm;
		  		this.currYear = yyyy;
		  		break;
		  default :
			  break;
		}
		document.calForm.selMonth.value = this.currMonth;
		document.calForm.selYear.value = this.currYear;
		this.changeCal();
	}
	
	changeCal(){
		var prevM = (this.currMonth==0)?11:this.currMonth-1; //Mois précédent au mois affiché
		var nextM = (this.currMonth==11)?0:this.currMonth+1;
		var mmyyyy = new Date();
		mmyyyy.setFullYear(this.currYear);
		mmyyyy.setMonth(this.currMonth);
		mmyyyy.setDate(1); //==> mmyyyy = 1/this.currMonth/this.currYear
		var day1 = mmyyyy.getDay();
		if (day1 == 0)
			day1 = 7;
		var arrN = new Array(calendarMonth.nbCases-1);
		var aa;
		//------------------Coloration et définition du contenu de chaque case du tableau------------------//
		
		//----Mois précèdent----//
		for (i=0;i<day1-1;i++){
			arrN[i] = maxDays(prevM,this.currYear) - day1 + i+2;
			eval("sp"+i).style.backgroundColor = colorOtherMonth;
		}
		
		//----Mois en court----//
		aa = 1;
		for (i=day1-1;i<=day1+maxDays(this.currMonth,this.currYear)-2;i++,aa++){
			arrN[i] = aa ;
			if ((arrN[i]==dd)&&(mm==this.currMonth)&&(yyyy==this.currYear)){ //Aujourd'hui
				eval("sp"+i).style.backgroundColor=colorToday;
				//clickOnCase("none");
			}
			else
				eval("sp"+i).style.backgroundColor=colorMonth;
		}
		
		//----Mois suivant----//
		aa = 1;
		for (i=day1+maxDays(this.currMonth,this.currYear)-1;i<calendarMonth.nbCases;i++,aa++){
			arrN[i] = aa;
			eval("sp"+i).style.backgroundColor = colorOtherMonth;
		}
		//-------------------------------------------------------------------------------------------------//
		
		//------------------------Définition de la taille et remplissage des cases-------------------------//
		//----Parcour de toutes les cases----//
		for (i=0;i< this.nbCases;i++){
			eval("sp"+i).style.height = caseHeight;	//Définition de la hauteur des cases
			eval("sp"+i).style.width = (windowWidth < 738)?windowWidth/7+"px":windowWidth/21+"px"; //Définition de la largeur des cases en fontion de la taille de la fenêtre
			eval("sp"+i).innerHTML = arrN[i]; //Remplissage des cases
			//----Parcour de tous les évènements----//
			for(var j=0; j < parseInt(tabEvent.length); j++){
				for(var k=0; k<5; k++){
					if((eval("sp"+i).innerHTML == de[j][k] && mmyyyy.getFullYear() == ye[j][k]) //Si le jour et l'année de l'évènement sont affiché
						&& (	(mmyyyy.getMonth()+1 == me[j][k] && eval("sp"+i).style.backgroundColor != colorOtherMonth) //Et le mois (avec la bonne couleur)
							||	(((prevM+1 == me[j][k] && i<15) //Ou le mois precedent 
								||	(nextM+1 == me[j][k] && i>15)) //Ou le mois suivant 
								&& ( eval("sp"+i).style.backgroundColor == colorOtherMonth))))//(avec la bonne couleur)
							eval("sp"+i).innerHTML += "<a><br><i style=\"font-size:10px\" class=\"far fa-dot-circle\"></i></br></a>"; //Alort affiché un cercle

				}
			}	  
			//--------------------------------------//
		}	
		//-------------------------------------------------------------------------------------------------//
	}

	writeHTML(){
		var text = "";
		text = "<form name=calForm>";
		text += "<table border=1>";
		text += "<tr><td>";
		text += "<table width=100%><tr>";
		text += "<td align=left>";
		text += "<span onClick='calendarMonth.chMonth(\"-\")'><i class=\"fas fa-chevron-left\"></i></span>";
		text += "<select name=selMonth onChange='calendarMonth.chMonth()'>"; //Quand on selectionne un mois, la fonction changeCal() est appelé
		for (i=0;i<=11;i++)		//Remplissage de la balise de selection du mois
			(i==mm)?text += "<option value= " + i + " Selected>" + arrM[i] + "</option>": text += "<option value= " + i + ">" + arrM[i] + "</option>";//Le mois courant est séléctionné au lancement
		
		text += "</select>";	
		text += "<span onClick='calendarMonth.chMonth(\"+\")'><i class=\"fas fa-chevron-right\"></i>     </span>";
		text += "<span onClick='calendarMonth.chMonth(\"+-\")'>    <i class=\"fas fa-calendar-day\"></i></span>"
		text += "</td>";
		text += "<td align=right>";
		text += "<select name=selYear onChange='changeCalMonth()'>";	//Quand on selectionne une année, la fonction changeCal() est appelé
		for (i=0;i<=nbYear;i++)		//Remplissage de la balise de selection de l'année
			(i==nbYear/2)?text += "<option value= " + arrY[i] + " Selected>" + arrY[i] + "</option>": text += "<option value= " + arrY[i] + ">" + arrY[i] + "</option>";//L'année courante est séléctionnée au lancement
		
		text += "</select>";
		text += "</td>";
		text += "</tr></table>";
		text += "</td></tr>";
		text += "<tr><td>";
		text += "<table border=1>";
		text += "<tr>";
		for (i=0;i<=6;i++)
			text += "<td align=center><span>" + arrD[i] + "</span></td>"; //Affiche des jours de la semaine
		text += "</tr>";
		var aa = 0;
		for (k=0;k<=5;k++){
			text += "<tr>";
			for (i=0;i<=6;i++, aa++)
				text += "<td align=center><div id=sp" + aa + " onClick='clickOnCase(this.id, calendarMonth)'></div></td>"; //Affiche des 42 case des jours, quand on séléctionne une case, la fonction affichage event est appelé
			text += "</tr>";
		}
		
		text += "</table>";
		text += "</td></tr>";
		text += "</table>";
		text += "<span id = eve><span>"; //Création de la balise, avec l'id 'eve'
		text += "</form>";
		return text; 	//Ecriture d'une calendirer
	}
	
	
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////Création du fond///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////Affichage du mois//////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var calendarMonth = new calMonth();
document.getElementById("btCalMonth").addEventListener("click", function(){
	document.getElementById("calPlace").innerHTML = calendarMonth.writeHTML(); 	//Ecriture d'une calendirer
	calendarMonth.chMonth();
});


//-------Redimenssion du calendrier en fonction de la taille de la fenêtre-------//
window.onresize = function resize(){ 
	windowWidth = parseInt(document.body.clientWidth)-30;
	if(windowWidth < 738)
		for (i=0;i<calendarMonth.nbCases;i++)eval("sp"+i).style.width = windowWidth/7+"px";
	else
		for (i=0;i<=calendarMonth.nbCases;i++)eval("sp"+i).style.width = windowWidth/21+"px";
};

