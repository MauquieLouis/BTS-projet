class calWeek{
	currYear;
	currWeek;
	currMonth;
	nbCases = 14;
	
	set currMonth(month){
		this.currMonth = parseInt(month);
	}

	set currYear(currYear){
		this.currYear = currYear;
	}

	set currWeek(currWeek){
		this.currWeek = currWeek;
	}

	chWeek(plusOuMoins){
		this.currWeek = parseInt(document.calWeekForm.selWeek.value);
		this.currYear = parseInt(eval("year").innerHTML);
		switch (plusOuMoins) {
		  case '-':
			  if(this.currWeek == 1){ 	//Si le mois courant est janvier, 
				  this.currWeek = 52;
				  this.currYear = parseInt(eval("year").innerHTML)-1;
			  }
			  else
				  this.currWeek--;
			  break;
		  case '+':
			  if(this.currWeek == 52){//Si le mois courant est décembre
				  this.currWeek=1;
				  this.currYear=parseInt(eval("year").innerHTML)+1;
				}
				else
					this.currWeek++;
			  break;
		  case '+-':			 
			  this.currWeek = nbWeek(dd, mm, yyyy);
			  this.currYear = yyyy;
			  break;
		  default :
			  break;
		}
		eval("year").innerHTML = this.currYear;
		document.calWeekForm.selWeek.value = this.currWeek;
		this.changeCal();
	}
	
	changeCal(){
		//---Définition de l'année et de la semaine courante---//

		//--Définition des variables servant au calcul des jours--//
		var nbMonth = 0; //Futur numéro mois courrant
		//Calcul du premier jour à afficher//
		var firstDayYearDate = new Date();
		firstDayYearDate.setMonth(0);
		firstDayYearDate.setDate(1);
		firstDayYearDate.setFullYear(this.currYear);
		var D = firstDayYearDate.getDay();
		var firstDay = (this.currWeek-1)*7-(D-2);//Premier jour à afficher

		while (firstDay > maxDays(nbMonth, this.currYear))
		{
			firstDay -= maxDays(nbMonth, this.currYear);
			nbMonth++;	
		}
		this.currMonth = nbMonth;
		
		var prevM= "";
		var nextM="";
		var currM ="";
		
		for (var i=0; i<14; i++){
			eval("ev"+i).style.height = "26px";
			(windowWidth < 768)?eval("sp"+i).style.width = windowWidth/2-27+"px":eval("sp"+i).style.width = windowWidth/6+"px";
			
			if(firstDay+i<1){
				eval("sp"+i).innerHTML = firstDay+i+ maxDays((this.currMonth==0)?11:this.currMonth-1, (this.currMonth-1==-1)?this.currYear-1:this.currYear);
				prevM=arrM[(this.currMonth==0)?11:this.currMonth-1];
				eval("ev"+i).style.background = colorOtherMonth;
			}
			else if (firstDay+i> maxDays(this.currMonth, this.currYear)){
				eval("sp"+i).innerHTML = firstDay+i - maxDays(this.currMonth, this.currYear);
				nextM=arrM[(this.currMonth==11)?0:this.currMonth+1];
				eval("ev"+i).style.background = colorOtherMonth;
			}
			else {
				eval("sp"+i).innerHTML = firstDay+i;
				eval("sp"+i).style.background = colorMonth;
				eval("ev"+i).style.background = colorMonth;
				(eval("sp"+i).innerHTML == dd && this.currYear == yyyy && this.currMonth==mm)?eval("sp"+i).style.backgroundColor = colorToday:eval("sp"+i).style.backgroundColor = colorMonth;
				currM=arrM[this.currMonth];
			}
		}
		eval("month").innerHTML = ((prevM!="")?prevM+ "-":"")+ currM +((nextM!="")?"-"+nextM+" ":" ");
	}
	writeHTML(){
	var text = "";
	text = "<form name=calWeekForm>";
	text += "<table id=\"greatTab\" class=\"tabStyle\">";
	text += "<tr><td class=\"row\">";
	//
	text += "<span class=\"col-2\" onClick='calendarWeek.chWeek(\"+-\")'><i style=\"font-size:30px\" class=\"fas fa-calendar-day\"></i></span>";
	text += "<span class=\"col-2\" onClick='calendarWeek.chWeek(\"-\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-left\"></i></span>";
	text += "<select class=\"col-6 form-control form-control-sm\" name=selWeek onChange='calendarWeek.chWeek()'>"; //Quand on selectionne un mois, la fonction changeCal() est appelé
	for (i=1;i<=52	;i++)		//Remplissage de la balise de selection du mois
		(i==nbWeek(dd, mm, yyyy))?text += "<option value= " + i + " Selected>" + "Sem" + i + "</option>": text += "<option value= " + i + ">" + "Sem" + i + "</option>";//Le mois courant est séléctionné au lancement
	text += "</select>";
	text += "<span class=\"col-2\" onClick='calendarWeek.chWeek(\"+\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-right\"></i></span>";				
	text += "</td></tr>";
	text += "<tr class=\"dayStyle\"><td width=\"100%\">";		
	text += "<span id=month>"+arrM[mm]+"</span>";
	text += "<span id=year>   "+yyyy+"</span>";
	text += "</td></tr>";
	text += "<tr><td>";
	text += "<table>"
	text += "<tr><td>"
	text += "<table>";
	for (i=0;i<=6;i++)
		text += "<tr class=\"dayStyle2\"><td ><div style=\"height:50px\">" + arrD[i] + "</div></td></tr>"; //Affiche des jours de la semaine
	text += "</table>";
	text += "</td>";	
	var aa = 0;
	for (j=0; j<=1; j++)
	{
		text += "<td>";
		text += "<table>";
		for (i=0;i<=6;i++, aa++){
			text += "<tr><td class=\"caseStyle\" onClick='clickOnCase(sp"+aa+", calendarWeek)'>";
			text += "<div id=sp"+ aa +">1</div>"
			text += "<div id=ev"+ aa +"></div>"
			text +="</td></tr>";
		}
		text += "</table>";
		text += "</td>";
	}
	//text+= "</tr>";
	//text += "</table>";
	//text = "</form>";
	return text;
	}
}

var calendarWeek = new calWeek();
document.getElementById("btCalWeek").addEventListener("click", function(){
	document.getElementById("calPlace").innerHTML = calendarWeek.writeHTML(); 	//Ecriture d'une calendirer
	calendarWeek.chWeek();
});





