//var table = new Array();


//table.init("user");
//var tableUser = table.retour;



//console.log(tableUser);
console.log('Dynamic Search!');
(function($){
	console.log('jquery activated !');
	$('#form_Recherche').keyup(function(event){
		var input = $(this);
		var val = input.val();
		if(val == '')
		{
			$('#AffichageListe [name=listeUser]').show();
			return true;
		}
		var regexp ='\\b(.*)';
		for(var i in val)
		{
			regexp += '('+val[i]+')(.*)';
		}	
		regexp += '\\b';
		$('#AffichageListe').find('span').each(function()			
		{
			var span = $(this);
			console.log(span);
			var resultats = span.text().match(new RegExp(regexp,'i'));
			if(resultats){
//				console.log(resultats);
			}else{
				//console.log(resultats);
				span.parent().parent().hide();
			}
		});
	});
})(jQuery);
//alert(tableUser[1][1]);