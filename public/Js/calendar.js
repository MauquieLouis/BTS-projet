

function maxDays(mm, yyyy){
	var mDay;
	if((mm == 3) || (mm == 5) || (mm == 8) || (mm == 10)){
		mDay = 30;
  	}
  	else{
  		mDay = 31;
  		if(mm == 1){
  	 		if (yyyy/4 - parseInt(yyyy/4) != 0){
  	 			mDay = 28;
  	 		}
			else{
				mDay = 29;
  			}
		}
 	 }
	return mDay;
}

var idPrec = "";
function affichageEvent(id){
	var now = new Date;
	var text = "";
	var wy = parseInt(document.calForm.selYear.value);

	if (eval(id).style.backgroundColor != "white"){
		if (idPrec != ""){
			if (parseInt(eval(idPrec).innerHTML) == now.getDate() && parseInt(document.calForm.selMonth.value) == now.getMonth() && parseInt(document.calForm.selYear.value) == now.getFullYear())
				eval(idPrec).style.backgroundColor = "#00A1D7";			
			else

				eval(idPrec).style.backgroundColor = "#ececec";		
		}
		eval(id).style.backgroundColor = "white";
		
		text += "<td>Evènement du ";
		text += eval(id).innerHTML;
		text += "/";		
		if(parseInt(id.slice(2)) > (42-15) && parseInt(eval(id).innerHTML) < 15){
			if(parseInt(document.calForm.selMonth.value) == 11){
				text += "1";
				wy += 1; 
			}
			else
				text += parseInt(document.calForm.selMonth.value)+2;
		}
		else if(parseInt(id.slice(2)) < 15 && parseInt(eval(id).innerHTML) > (31-15)){
			if(parseInt(document.calForm.selMonth.value) == 0){
				text += "12";
				wy -= 1;
			}
			else
				text += parseInt(document.calForm.selMonth.value);
		}	
		else
			text += parseInt(document.calForm.selMonth.value)+1;
		
		text += "/";
		text += wy;
		
		text += ":</td>";
		text += "<button align=right onClick=''>+</button>";
		eval("eve").innerHTML = text;
	}
	idPrec = id;
}
function creatEvent(){
	
	
}
function writeCalendar(){
	var now = new Date;
	var dd = now.getDate();
	var mm = now.getMonth();
	var dow = now.getDay();
	var yyyy = now.getFullYear();
	var arrM = new Array("Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre");
	var arrY = new Array();
	for (i=0;i<=4;i++)
		arrY[i] = yyyy - 2 + i;
	var arrD = new Array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim");

	var text = "";
	text = "<form name=calForm>";
	text += "<table border=1>";
	text += "<tr><td>";
	text += "<table width=100%><tr>";
	text += "<td align=left>";
	text += "<select name=selMonth onChange='changeCal()'>";
	for (i=0;i<=11;i++){
		if (i==mm){
			text += "<option value= " + i + " Selected>" + arrM[i] + "</option>";
		}
		else{
			text += "<option value= " + i + ">" + arrM[i] + "</option>";
		}
	}
	text += "</select>";
	text += "</td>";
	text += "<td align=right>";
	text += "<select name=selYear onChange='changeCal()'>";
	for (i=0;i<=4;i++){
		if (i==2){
			text += "<option value= " + arrY[i] + " Selected>" + arrY[i] + "</option>";
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
		text += "<td align=center><span class=label>" + arrD[i] + "</span></td>";
	}
	text += "</tr>";
	aa = 0;
	for (k=0;k<=5;k++){
		text += "<tr>";
		for (i=0;i<=6;i++){
			text += "<td align=center><div  id=sp" + aa + " onClick='affichageEvent(this.id) '></div></td>";
			aa += 1;
		}
		text += "</tr>";
	}
	
	text += "</table>";
	text += "</td></tr>";
	text += "</table>";
	text += "<span id = eve><span>";

	text += "</form>";

	document.write(text);
	changeCal();
}
function changeCal(){
	var now = new Date;
	var dd = now.getDate();
	var mm = now.getMonth();
	var dow = now.getDay();
	var yyyy = now.getFullYear();
	var currM = parseInt(document.calForm.selMonth.value);
	var prevM;
	if (currM!=0){
		prevM = currM - 1;
	}
	else{
		prevM = 11;
	}
	var currY = parseInt(document.calForm.selYear.value);
	var mmyyyy = new Date();
	mmyyyy.setFullYear(currY);
	mmyyyy.setMonth(currM);
	mmyyyy.setDate(1);
	var day1 = mmyyyy.getDay();
	if (day1 == 0){
		day1 = 7;
	}
	var arrN = new Array(41);
	var aa;
	for (i=0;i<day1-1;i++){
		arrN[i] = maxDays(prevM,currY) - day1 + i+2	;
	}
	aa = 1;
	for (i=day1-1;i<=day1+maxDays(currM,currY)-2;i++){
		arrN[i] = aa ;
		aa += 1;
	}
	aa = 1;
	for (i=day1+maxDays(currM,currY)-1;i<=41;i++){
		arrN[i] = aa;
		aa += 1;
	}
	var dCount = 0;
	for (i=0;i<=41;i++){
		eval("sp"+i).style.height = "50px";
		eval("sp"+i).style.width = "100px";
		if (((i<7)&&(arrN[i]>20))||((i>27)&&(arrN[i]<20))){
			eval("sp"+i).innerHTML = arrN[i];
			eval("sp"+i).className = "c3";
		}
		else{
			eval("sp"+i).innerHTML = arrN[i];
			if ((dCount==0)||(dCount==6)){
				eval("sp"+i).className = "c2";
			}
			else{
				eval("sp"+i).className = "c1";
			}
			if ((arrN[i]==dd)&&(mm==currM)&&(yyyy==currY)){
				eval("sp"+i).style.backgroundColor="#00A1D7";
				affichageEvent("sp"+i);
			}
			else
				eval("sp"+i).style.backgroundColor="#ececec";
		}
		dCount += 1;
		if (dCount>6){
			dCount=0;
		}
	}
}

//var div = document.getElementByTagName("div");





writeCalendar();
