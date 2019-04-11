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
				  //document.calWeekForm.selWeek.value=52;
				  //eval("year").innerHTML 
				  this.currYear = parseInt(eval("year").innerHTML)-1;
			  }
			  else
				  this.currWeek--;
				  //document.calWeekForm.selWeek.value--;
			  break;
		  case '+':
			  if(this.currWeek == 52){//Si le mois courant est décembre
				  this.currWeek=1;
				  this.currYear=parseInt(eval("year").innerHTML)+1;
				  //document.calWeekForm.selWeek.value=1;
				  //eval("year").innerHTML = parseInt(eval("year").innerHTML)+1;
				}
				else
					this.currWeek++;
					//document.calWeekForm.selWeek.value++;
			  break;
		  default :
			  this.currWeek = nbWeek(dd, mm, yyyy);
		  		this.currYear = yyyy;
		  		alert("tamer");
			  //document.calWeekForm.selWeek.value = nbWeek(dd, mm, yyyy);
		  		//eval("year").innerHTML = yyyy;
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
				eval("sp"+i).style.background = colorOtherMonth;
				eval("ev"+i).style.background = colorOtherMonth;
			}
			else if (firstDay+i> maxDays(this.currMonth, this.currYear)){
				eval("sp"+i).innerHTML = firstDay+i - maxDays(this.currMonth, this.currYear);
				nextM=arrM[(this.currMonth==11)?0:this.currMonth+1];
				eval("sp"+i).style.background = colorOtherMonth;
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
		text += "<table border=1>";
			text += "<tr><td>";
			text += "<table>"
				text += "<tr><td>";
				text += "<span onClick='calendarWeek.chWeek()'>    <i style=\"font-size:30px\" class=\"fas fa-calendar-day\"></i></span>";
				text += "</td><td width="+ parseInt(windowWidth/4)+"px"+" align=center>"
				text += "<span onClick='calendarWeek.chWeek(\"-\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-left\"></i></span>";
				text += "<select style=\"font-size:20px\" name=selWeek onChange='calendarWeek.chWeek()'>"; //Quand on selectionne un mois, la fonction changeCal() est appelé
				for (i=1;i<=52	;i++)		//Remplissage de la balise de selection du mois
					(i==nbWeek(dd, mm, yyyy))?text += "<option value= " + i + " Selected>" + "Sem" + i + "</option>": text += "<option value= " + i + ">" + "Sem" + i + "</option>";//Le mois courant est séléctionné au lancement
				text += "</select>";
				text += "<span onClick='calendarWeek.chWeek(\"+\")'><i style=\"font-size:30px\" class=\"fas fa-chevron-right\"></i>     </span>";				
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
								text += "<tr><td onClick='clickOnCase(sp"+aa+", calendarWeek)'>";
								text += "<div id=sp"+ aa +">1</div>"
								text += "<div id=ev"+ aa +"></div>"
								text +="</td></tr>"
								
								//alert("sp"+aa);
							}
							text += "</table>";
						text += "</td>";
					}
					text+= "</tr>";
				//table += "</table>";
			text += "</td></tr>";
			//table += "</table>"
		//text = "</form>";
		return text;
	}
}

var calendarWeek = new calWeek();
document.getElementById("btCalWeek").addEventListener("click", function(){
	document.getElementById("calPlace").innerHTML = calendarWeek.writeHTML(); 	//Ecriture d'une calendirer
	calendarWeek.chWeek();
});





window.onresize = function resize(){
	windowWidth = parseInt(document.body.clientWidth);
	if(windowWidth < 768)
		for (i=0;i<14;i++)eval("sp"+i).style.width = windowWidth/2-27+"px";
	else
		for (i=0;i<14;i++)eval("sp"+i).style.width = windowWidth/6+"px";
};