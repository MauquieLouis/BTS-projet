var table = {
	retour : "NA",
	init : function(tableSelected,id){
		var xhReq = new XMLHttpRequest();
		xhReq.onreadystatechange = function() {
			if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
				table.retour = JSON.parse(this.responseText);
			}
		};
		
		switch(String(tableSelected)){
			case "event":
				if (id === undefined) {
					xhReq.open("post","accesbdd/sendevent/undefined",false);		//arg2 url de l'echo de la table SQl recuperé un PHP
				}
				else
				{
					xhReq.open("post","accesbdd/sendevent/"+String(id),false);		//arg2 url de l'echo de la table SQl recuperé un PHP
				}
			break;

			case "machine":
				if (id === undefined) {
						xhReq.open("post","accesbdd/sendmachine/undefined",false);		//arg2 url de l'echo de la table SQl recuperé un PHP
					}
				else
				{
					xhReq.open("post","accesbdd/sendmachine/"+String(id),false);	//arg2 url de l'echo de la table SQl recuperé un PHP
				}
			break;
			
			case "user":
				if (id === undefined) {
					xhReq.open("post","../../accesbdd/senduser/undefined",false);		//arg2 url de l'echo de la table SQl recuperé un PHP
				}
				else
				{
					xhReq.open("post","../../accesbdd/senduser/"+String(id),false);	//arg2 url de l'echo de la table SQl recuperé un PHP
				}
			break;
			
			default:
				console.log("table::initTable::switch(tableSelected) => DROP TO DEFAULT at AjaxReceive.js ln33");
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
/*	ByDate: function(dateStart,dateEnd){

	}*/
};

console.log("USER:");
console.log(table.init("user"));

console.log("EVENT:");
console.log(table.init("event"));

console.log("MACHINE:");
console.log(table.init("machine"));

console.log("USER:2");
console.log(table.init("user",2));

console.log("EVENT:2");
console.log(table.init("event",2));

console.log("MACHINE:2");
console.log(table.init("machine",2));

console.log("CurrentUser");
console.log(table.GetCurrentUser());

///PROCEDURE D'UTLISATION-------------------------------------------------//
//table.init("selected")	// selected === nom de la table selectionée
//table.retour[i][n]		// i : ligne	n : colonne
//-----------------------------------------------------------------------//

