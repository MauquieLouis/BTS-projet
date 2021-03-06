//Objet table :acces au contenu de la bdd 'farella'

var table = {
	retour : "NA",	//valeur de la table initialiser par table::init(tableSelected[,id])
	init : function(tableSelected,id){		//initialisation d'une table table::init(tableSelected[,id])
		var xhReq = new XMLHttpRequest();
		xhReq.onreadystatechange = function() {
			if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
				table.retour = JSON.parse(this.responseText);
			}
		};
		
		switch(String(tableSelected)){		//acces a une table en fonction de la table selectionné par l'argument tableSelected
			case "event":
				if (id === undefined) {			
					xhReq.open("post","accesbdd/sendevent/undefined",false);		//arg2 : url de l'echo de la table SQl recuperé un PHP
				}
				else
				{
					xhReq.open("post","accesbdd/sendevent/"+String(id),false);		//arg2 :  url de l'echo de la table SQl recuperé un PHP
				}
			break;

			case "machine":
				if (id === undefined) {
						xhReq.open("post","accesbdd/sendmachine/undefined",false);		//arg2 : url de l'echo de la table SQl recuperé un PHP
					}
				else
				{
					xhReq.open("post","accesbdd/sendmachine/"+String(id),false);	//arg2 : url de l'echo de la table SQl recuperé un PHP
				}
			break;
			
			case "user":
				if (id === undefined) {
					xhReq.open("post","../../accesbdd/senduser/undefined",false);		//arg2 : url de l'echo de la table SQl recuperé un PHP
				}
				else
				{
					xhReq.open("post","../../accesbdd/senduser/"+String(id),false);	//arg2 : url de l'echo de la table SQl recuperé un PHP
				}
			break;

			case "maintenance":
				if (id === undefined) {
					xhReq.open("post","accesbdd/sendmaintenance/undefined",false);		//arg2 : url de l'echo de la table SQl recuperé un PHP
				}
				else
				{
					xhReq.open("post","accesbdd/sendmaintenance/"+String(id),false);	//arg2 : url de l'echo de la table SQl recuperé un PHP
				}
			break;

			default:
				console.log("table::initTable::switch(tableSelected) => DROP TO DEFAULT at AjaxReceive.js ln55");
				return "Unknow table";			//ERROR : arg tablesSelected inconnu
			break;
		}
		xhReq.send();
		return this.retour;
	},
	GetCurrentUser : function(){
		var xhReq = new XMLHttpRequest();
		var currentUser;
		xhReq.onreadystatechange = function() {
			if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
				currentUser = JSON.parse(this.responseText);
			}
		};
		xhReq.open("post","variables/sendsession",false);

		xhReq.send();
		return currentUser;
	},
	ByDate: function(dateStart,dateEnd,idUser){		//table::ByDate("aaaa-mm-jj","aaaa-mm-jj",idUser)
		var xhReq = new XMLHttpRequest();
		var events;
		xhReq.onreadystatechange = function() {
			if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
				events = JSON.parse(this.responseText);
			}
		};

		if(idUser === null){
			xhReq.open("post","variables/sendEventsDates/"+String(dateStart)+"/"+String(dateEnd)+"/undefined",false);
		}
		else{
			xhReq.open("post","variables/sendEventsDates/"+String(dateStart)+"/"+String(dateEnd)+"/"+String(idUser),false);
		}
		xhReq.send();

		return events;
	},
	SetTable: function(tableSelected,id,fields,values){
		var xhReq = new XMLHttpRequest();
		xhReq.onreadystatechange = function() {
			if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
				retourCode = JSON.parse(this.responseText);
			}
		};

		switch(tableSelected){
			case "event":
				var tabl = [];
				tabl.push(fields);
				tabl.push(values);
				var message = JSON.stringify(tabl);

				if (id === null) {
					xhReq.open("post","accesbdd/write/"+String(tableSelected)+"/undefined/"+String(message),false);	// ajouter nouvelle ligne à la table
				}
				else{
					xhReq.open("post","accesbdd/writeevent/"+String(id)+"/"+String(message),false);	// mettre a jour la table
				}
			break;

			default:
				console.log("table::SetTable::switch(tableSelected) => DROP TO DEFAULT at AjaxReceive.js ln97");
				return "Unknow table";			//ERROR : arg tablesSelected inconnu
			break;
		}
		xhReq.send();
		return retourCode;
	}
};
//console.log(table.init("user"));
/*var fields = ["dateStart","Titre"];
var values = ["2019-02-01","Titre incoutournable"];
table.SetTable("event",31,fields,values);*/

///PROCEDURE D'UTLISATION-----------------------------------------------------------------------------------------------------------------------------//
//table.init("selected",id)	// selected : nom de la table selectionée id : idselected | ex : table.init("event",22); selected : event idselected : 22
//table.retour[i][n]		// i : ligne	n : colonne
//----------------------------------------------------------------------------------------------------------------------------------------------------//