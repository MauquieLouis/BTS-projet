
class calMonth{
	constructor(){
		this.currYear = 0;
		this.currWeek = 0;
		this.currMonth = 0;
		this.nbCases = 42;
		this.eventAffiche =  dd+"/"+mm+"/"+yyyy;
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
		eval("btCalMonth").style.background = "deepskyblue";
		eval("btCalMonth").style.color = "#e7e7e7";
		eval("btCalWeek").style.background = "#e7e7e7";
		eval("btCalWeek").style.color = "deepskyblue";
		//$('#btCalWeek').mouseover(function() {eval("btCalWeek").style.color = "black";});
		//$('#btCalWeek').mouseout(function() {eval("btCalWeek").style.color = "deepskyblue";});
		//$('#btCalMonth').off("mouseover");
		//$('#btCalMonth').off("mouseout");
		//eval("btCalWeek").addEventListener("mouseout", function() { eval("btCalWeek").style.color = "deepskyblue";},false);

		for (var i=0;i<=nbYear;i++){				//5 années serront sélèctionnable
			arrY[i] = this.currYear - nbYear/2 + i;
			console.log(arrY[i]);
		}
		var prevM = (this.currMonth==0)?11:this.currMonth-1; //Mois précédent au mois affiché
		var mmyyyy = new Date();
		mmyyyy.setFullYear(this.currYear);
		mmyyyy.setMonth(this.currMonth);
		mmyyyy.setDate(1); //==> mmyyyy = 1/this.currMonth/this.currYear
		var day1 = mmyyyy.getDay();
		if (day1 == 0)
			day1 = 7;
		
		var arrN = new Array(this.nbCases-1);
		var aa;		
		var caseDay;
		var caseMonth;
		var caseYear;

		//------------------Coloration et définition du contenu de chaque case du tableau------------------//
		
		//----Mois précèdent----//
		for (i=0;i<day1-1;i++){
			caseMonth = (this.currMonth==0)?12:this.currMonth;
			caseMonth = syntaxe(caseMonth,0);
			caseYear = (this.currMonth==0)?this.currYear-1:this.currYear;
			arrN[i] = maxDays(prevM,this.currYear) - day1 + i+2;
			caseDay = syntaxe(arrN[i],0);
			eval("sp"+i).style.backgroundColor = colorOtherMonth;
			eval("sp"+i).name = caseDay + "/" +caseMonth + "/" + caseYear;
		}
		
		//----Mois en court----//
		aa = 1;
		for (i=day1-1;i<=day1+maxDays(this.currMonth,this.currYear)-2;i++,aa++){
			arrN[i] = aa ;
			caseDay = syntaxe(arrN[i],0);
			caseMonth = syntaxe(this.currMonth, 1);
			eval("sp"+i).name = caseDay + "/" + caseMonth + "/" + this.currYear;
			eval("sp"+i).style.backgroundColor=colorMonth;
		}
		
		//----Mois suivant----//
		aa = 1;
		for (i=day1+maxDays(this.currMonth,this.currYear)-1;i<this.nbCases;i++,aa++){
		
			caseMonth = (this.currMonth==11)?1:this.currMonth+2;
			caseMonth = syntaxe(caseMonth,0);
			caseYear = (this.currMonth==11)?this.currYear+1:this.currYear;
			arrN[i] = aa;
			caseDay =  syntaxe(arrN[i],0);
			eval("sp"+i).style.backgroundColor = colorOtherMonth;
			eval("sp"+i).name = caseDay + "/" + caseMonth + "/" + caseYear;
		}
		//-------------------------------------------------------------------------------------------------//
		//------------------------Définition de la taille et remplissage des cases-------------------------//
		//----Parcour de toutes les cases----//
		for (i=0;i< this.nbCases;i++){
			eval("sp"+i).style.height = caseHeight;	//Définition de la hauteur des cases
			eval("sp"+i).style.width = (windowWidth < 738)?windowWidth/7-30+"px":windowWidth/21+"px"; //Définition de la largeur des cases en fontion de la taille de la fenêtre
			eval("sp"+i).innerHTML = arrN[i]; //Remplissage des cases
			
			if (eval("sp"+i).name == syntaxe(dd,0)+"/"+ syntaxe(mm,1) +"/"+yyyy){ //Aujourd'hui
				eval("sp"+i).style.backgroundColor=colorToday;
				isItToday = true;
			}
			else isItToday = false;
			if(eval("sp"+i).name == this.eventAffiche && isItToday == false)eval("sp"+i).style.background = colorSelectDay;
			//else eval("sp"+i).style.background = colorMonth;
		}	
		//-------------------------------------------------------------------------------------------------//
		getEvents(this.nbCases, eval(sp0).name, eval(sp41).name);
	}

	writeHTML(){
		var text = "";
		text = "<form name=calForm>";
		text += "<table id=\"greatTab\" class=\"tabStyle\">";
		text += "<tr><td>";
		text += "<table width=100%><tr>";
		text += "<td class=\"row\">";
		text += "<span class=\"col-2 button\" onClick='calendarMonth.chMonth(\"-\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-left\"></i></span>";
		text += "<select class=\"col-6 button form-control form-control-sm\" name=selMonth onChange='calendarMonth.chMonth()'>"; //Quand on selectionne un mois, la fonction changeCal() est appelé
		for (var i=0;i<=11;i++)		//Remplissage de la balise de selection du mois
			(i==parseInt(this.eventAffiche.substr(3,2)-1))?text += "<option value= " + i + " Selected>" + arrM[i] + "</option>": text += "<option value= " + i + ">" + arrM[i] + "</option>";//Le mois courant est séléctionné au lancement
		
		text += "</select>";	
		text += "<span class=\"col-2 button\" onClick='calendarMonth.chMonth(\"+\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-right\"></i></span>";
		text += "<span class=\"col-2 button\" onClick='calendarMonth.chMonth(\"+-\")'><i style=\"font-size:30px\" class=\"fas fa-calendar-day\"></i></span>";
		text += "</td>";
		text += "<td align=right>";
		text += "<select name=selYear class=\"col-7 button form-control form-control-sm\" onChange='calendarMonth.chMonth()'>";	//Quand on selectionne une année, la fonction changeCal() est appelé
		for (var i=0;i<=nbYear;i++)		//Remplissage de la balise de selection de l'année
			(i==this.eventAffiche.substr(6,4)-arrY[0])?text += "<option value= " + arrY[i] + " Selected>" + arrY[i] + "</option>": text += "<option value= " + arrY[i] + ">" + arrY[i] + "</option>";//L'année courante est séléctionnée au lancement
		text += "</select>";
		text += "</td>";
		text += "</tr></table>";
		text += "</td></tr>";
		text += "<tr><td>";
		text += "<table class=\"tabStyle\">";
		text += "<tr>";
		for (var i=0;i<=6;i++)
			text += "<td class=\"dayStyle\"><span>" + arrD[i] + "</span></td>"; //Affiche des jours de la semaine
		text += "</tr>";
		var aa = 0;
		for (var k=0;k<=5;k++){
			text += "<tr>";
			for (var i=0;i<=6;i++, aa++)
				text += "<td class=\"caseStyle\" align=center><div name=1 id=sp" + aa + " onClick='clickOnCase(this.id, calendarMonth)'></div></td>"; //Affiche des 42 case des jours, quand on séléctionne une case, la fonction affichage event est appelé
			text += "</tr>";
		}
		text += "</table>";
		text += "</td></tr>";
		text += "</table>";		
		text += "</form>";

		return text; 	//Ecriture d'une calendirer
	}
}

var calendarMonth = new calMonth();
calendarMonth.eventAffiche = syntaxe(dd,0)+"/"+syntaxe(mm,1)+"/"+yyyy;

document.getElementById("btCalMonth").addEventListener("click", function(){
	document.getElementById("calPlace").innerHTML = calendarMonth.writeHTML(); 	//Ecriture d'une calendirer
	calendarMonth.chMonth();
	affichageEvent(calendarMonth.eventAffiche);
});

