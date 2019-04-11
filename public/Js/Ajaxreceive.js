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
				if (id) {
					xhReq.open("post","accesbdd/sendevent/"+String(id),false);		//arg2 url de l'echo de la table SQl recuperé un PHP
				}
				else
				{
					xhReq.open("post","accesbdd/sendevent",false);		//arg2 url de l'echo de la table SQl recuperé un PHP
				}

			break;

			case "machine":
				xhReq.open("post","accesbdd/sendmachine",false);	//arg2 url de l'echo de la table SQl recuperé un PHP
			break;

			case "user":
				xhReq.open("post","../../accesbdd/senduser",false);	//arg2 url de l'echo de la table SQl recuperé un PHP
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

///PROCEDURE D'UTLISATION-------------------------------------------------//
//table.init("selected")	// selected === nom de la table selectionée
//table.retour[i][n]		// i : ligne	n : colonne
//-----------------------------------------------------------------------//

