class calWeek{
	constructor (){
		this.currYear = 0;
		this.currWeek = 0;
		this.currMonth = 0;
		this.nbCases = 14;
		this.eventAffiche = dd+"/"+mm+"/"+yyyy;
		
	}
	/*set currMonth(month){
		this.currMonth = parseInt(month);
	}
	set currYear(currYear){
		this.currYear = currYear;
	}
	set currWeek(currWeek){
		this.currWeek = currWeek;
	}
	set eventAffiche(date){
		this.eventAffiche = date;
	}*/
	
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
		eval("btCalMonth").style.background = "deepskyblue";
		eval("btCalMonth").style.color = "#e7e7e7";
		eval("btCalWeek").style.background = "#e7e7e7";
		eval("btCalWeek").style.color = "deepskyblue";
		
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
		var caseMonth;
		var caseYear;
		var caseDay;
		var prevM= "";
		var nextM="";
		var currM ="";
		for (var i=0; i<this.nbCases; i++){
			eval("sp"+i).style.height = "52px";
			//eval("ev"+i).innerHTML = "";
			(windowWidth < 768)?eval("sp"+i).style.width = windowWidth/2-80+"px":eval("sp"+i).style.width = windowWidth/6-30+"px";
			//var whatColor = (i<this.nbCases/2)?1:0;
			//----Mois précédent----//
			if(firstDay+i<1){
				eval("sp"+i).innerHTML = firstDay+i+ maxDays((this.currMonth==0)?11:this.currMonth-1, (this.currMonth-1==-1)?this.currYear-1:this.currYear);
				caseMonth = (this.currMonth==0)?11:this.currMonth-1;
				caseYear = (this.currMonth==0)?this.currYear-1:this.currYear;
				prevM=arrM[caseMonth];
				caseMonth += 1;
				caseMonth = syntaxe(caseMonth,0);	
				
				eval("sp"+i).style.backgroundColor = colorOtherMonth;
			}
			//----Mois suivant----//
			else if (firstDay+i> maxDays(this.currMonth, this.currYear)){
				eval("sp"+i).innerHTML = firstDay+i - maxDays(this.currMonth, this.currYear);
				caseMonth = (this.currMonth==11)?0:this.currMonth+1;
				caseYear = (this.currMonth==11)?this.currYear+1:this.currYear;
				nextM=arrM[caseMonth];
				caseMonth += 1;
				caseMonth = syntaxe(caseMonth,0);
				
				eval("sp"+i).style.backgroundColor = colorOtherMonth;
			}
			//----Mois en court----//
			else {
				eval("sp"+i).innerHTML = firstDay+i;
				currM=arrM[this.currMonth];
				caseMonth = parseInt(this.currMonth+1);
				caseMonth = syntaxe(caseMonth,0);
				caseYear = this.currYear;
				
				eval("sp"+i).style.backgroundColor = colorMonth;
			}
			caseDay = syntaxe(eval("sp"+i).innerHTML,0);
			eval("sp"+i).name = caseDay +"/"+ caseMonth + "/" + caseYear;
			if(eval("sp"+i).name == syntaxe(dd,0)+"/"+ syntaxe(mm,1) +"/"+yyyy){
				eval("sp"+i).style.backgroundColor = colorToday;
				isItToday = true;
			}
			else{
				isItToday = false;
			}
			//alert(isItToday);
			if(eval("sp"+i).name == this.eventAffiche && isItToday == false)eval("sp"+i).style.background = colorSelectDay;
		}
		eval("month").innerHTML = ((prevM!="")?prevM+ "-":"")+ currM +((nextM!="")?"-"+nextM+" ":" ");
		getEvents(this.nbCases, eval(sp0).name, eval(sp13).name);
	}
	
	writeHTML(){
		var text = "";
		text = "<form name=calWeekForm>";
		text += "<table id=\"greatTab\" class=\"tabStyle\">";
		text += "<tr><td class=\"row\">";
		text += "<span class=\"col-2\" onClick='calendarWeek.chWeek(\"+-\")'><i style=\"font-size:30px\" class=\"fas fa-calendar-day\"></i></span>";
		text += "<span class=\"col-2\" onClick='calendarWeek.chWeek(\"-\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-left\"></i></span>";
		text += "<select class=\"col-6 form-control form-control-sm\" name=selWeek onChange='calendarWeek.chWeek()'>"; //Quand on selectionne un mois, la fonction changeCal() est appelé
	
		for (var i=1;i<=52;i++)		//Remplissage de la balise de selection du mois
			(i==nbWeek(parseInt(this.eventAffiche.substr(0,2)), parseInt(this.eventAffiche.substr(3,2)-1), this.eventAffiche.substr(6,4)))?text += "<option value= " + i + " Selected>" + "Sem" + i + "</option>": text += "<option value= " + i + ">" + "Sem" + i + "</option>";//Le mois courant est séléctionné au lancement
		text += "</select>";
		text += "<span class=\"col-2\" onClick='calendarWeek.chWeek(\"+\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-right\"></i></span>";				
		text += "</td></tr>";
		text += "<tr class=\"dayStyle\"><td>";		
		text += "<span id=month>"+arrM[mm]+"</span>";
		text += "<span id=year>   "+yyyy+"</span>";
		text += "</td></tr>"
		text += "<tr><td>";
		text += "<table>"
		text += "<tr>";
		var aa = 0;
		for (var j=0; j<=1; j++)
		{
			text += "<td>"
			text += "<table>";
			for (i=0;i<=6;i++)
				text += "<tr class=\"dayStyle2\"><td ><div style=\"height:50px\">" + arrD[i] + "</div></td></tr>"; //Affiche des jours de la semaine
			text += "</table>";
			text += "</td>";	
			text += "<td>";
			text += "<table>";
			for (var i=0;i<=6;i++, aa++){
				text += "<tr><td class=\"caseStyle\"  onClick='clickOnCase(sp"+aa+", calendarWeek)'>";
				text += "<div name=1 id=sp"+ aa +">1</div>"
				//text += "<div name=1 id=ev"+ aa +"></div>"
				text +="</td></tr>";
			}
			text += "</table>";
			text += "</td>";
		}
		text += "</td></table><td>";
		text +=  "<span class=\"eventStyle\" id=EventPlace></span>";
		text += "</td>";
		//text+= "</tr>";
		//text += "</table>";
		//text = "</form>";
		
		return text;
	}
}

var calendarWeek = new calWeek();

calendarWeek.eventAffiche = syntaxe(dd,0)+"/"+syntaxe(mm,1)+"/"+yyyy;

document.getElementById("btCalWeek").addEventListener("click", function(){
	document.getElementById("calPlace").innerHTML = calendarWeek.writeHTML(); 	//Ecriture d'une calendirer
	calendarWeek.chWeek();
	affichageEvent(calendarWeek.eventAffiche);
});





