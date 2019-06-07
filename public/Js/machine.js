//Date : 30/04/2019
/* Classe Machines*/
class Machines{
	constructor(image)
	{
		this.image = image;			// ne sert à rien je crois
		this.points = [];			// Ajoute les sprites à l'ouverture de la page web.
		this.sprites = [];			// Conteneur de sprites
		this.spritesPushInBdd= [];	// Conteneur de sprites à ajouter dans la bdd
		this.cubes= [];				// Conteneur de cubes et normalement il n'y a qu'une cube
		this.scene = null;			// contient la scene de la page web
		this.cube = null;			// pointeur sur un cube du containeur cubes
		this.sprite = null;			// pointeur sur un sprite
		this.spriteScan =null;		// pointeur sur un sprite pour scanner
		this.positionsCamera= [];	// Conteneur qui enregistre les positions de la camera pour voir les differentes face du cube
		this.positionCamera =0;		// Pointeur sur positionsCamera[] qui est de type .x .y .z 	
		this.position=0;			// Position du cube .x .y .z 
		this.edition = 0;			// Attribut qui définit si on pose un sprite ou pas			
		this.etapeEnCours = 1;		// Attribut qui permet de connaitre l'etape en cours.
		this.initEcartTooltip = 2;	// Attribut, qui avance de 2 le sprite apres sa creation.
		this.createSprite = 'stop';
		this.modificationEnCours = 0;
	}
	createMachine(scene, imgDroite, imgLeft, imgTop, imgBottom, imgFront, imgBack)
	{
		this.scene = scene; 
		//création modèle de cube
		var geometry2 = new THREE.BoxGeometry( 100, 100, 100 ); // Creation d'une boite de 100 de côtés
//////////////////CHARGEMENT DES IMAGES/////////////////////////////////////////////////////
		var image1 = new THREE.TextureLoader().load(imgDroite); 
		var image2 = new THREE.TextureLoader().load(imgLeft);
		var image3 = new THREE.TextureLoader().load(imgTop);
		var image4 = new THREE.TextureLoader().load(imgBottom);
		var image5 = new THREE.TextureLoader().load(imgFront);
		var image6 = new THREE.TextureLoader().load(imgBack); 
////////////////////////////////////////////////////////////////////////////////////////////	
		var cubeMaterials = 
		[
			new THREE.MeshBasicMaterial( { map: image1, side: THREE.DoubleSide, name:"droite"} ),// RIGHT SIDE
			new THREE.MeshBasicMaterial( { map: image2, side: THREE.DoubleSide, name:"gauche"} ),// LEFT SIDE
			new THREE.MeshBasicMaterial( { map: image3, side: THREE.DoubleSide, name:"haut"} ),// TOP SIDE 
			new THREE.MeshBasicMaterial( { map: image4, side: THREE.DoubleSide, name:"bas"} ),// BOTTOM SIDE
			new THREE.MeshBasicMaterial( { map: image5, side: THREE.DoubleSide, name:"devant"} ),// FRONT SIDE
			new THREE.MeshBasicMaterial( { map: image6, side: THREE.DoubleSide, name:"derriere"} ) // BACK SIDE
		];
		var material4 = new THREE.MeshFaceMaterial( cubeMaterials);
/////////////////////Création du cube/////////////////////
		this.cube = new THREE.Mesh( geometry2, material4);
		this.cube.name="machine";
		this.scene.add(this.cube);
		this.points.forEach(this.addTooltip.bind(this));
///////////////////////AJOUT DIFFERENTES POSITIONS DE CAMERA////////////////////////////////
		this.positionsCamera.push(new THREE.Vector3(0, 0, 140));//devant	0
		this.positionsCamera.push(new THREE.Vector3(140, 0, 0));//droite	1 
		this.positionsCamera.push(new THREE.Vector3(0, 0, -140));//derriere 2
		this.positionsCamera.push(new THREE.Vector3(-140, 0, 0));//gauche	3
////////////////////////////////////////////////////////////////////////////////////////////	
	}
	positionReset() // Cube se remet droit
	{
		this.cube.rotation.x = 0;
		this.cube.rotation.y = 0;
		this.cube.rotation.z = 0;
	}
	rotateCube(axe,vitesse) // Le cube tourne selon un axe
	{
		if (axe == 'x') {this.cube.rotation.x += vitesse;}
		if (axe == 'y') {this.cube.rotation.y += vitesse;}
		if (axe == 'z') {this.cube.rotation.z += vitesse;}	
	}
	rotateSprite(axe,vitesse) //sprite tourne
	{
		console.log("rotatesprite");
		if (axe == 'x') {this.sprites[0].position.x += vitesse;}
		if (axe == 'y') {this.sprites[0].position.y += vitesse;}
		if (axe == 'z') {this.sprites[0].position.z += vitesse;}
	}
	addPoints(point)	// Creation de sprite avant l'apparition du cube.
	{
		this.points.push(point);
	}
	addTooltip(point) // Creation d'une annotation
	{
		let spriteMap = new THREE.TextureLoader().load( "../../image/machine/ampoule.png" );
		let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap} );
		let sprite = new THREE.Sprite( spriteMaterial );
		sprite.name = point.name;
		sprite.information	= point.info; 
		sprite.cameraPosX	= point.camera.x;
		sprite.cameraPosY	= point.camera.y;
		sprite.cameraPosZ	= point.camera.z;
		sprite.etape		= point.etape;//this.sprites.length//point.etape;
		if(point.idBDD){sprite.idBDD = point.idBDD;}
		sprite.position.copy(point.position.clone()); //.clone permet de cloner et de ne pas toucher la variable passée par référence l'objet méthode normalize
		sprite.scale.multiplyScalar(9);
		this.sprite = sprite;
		this.scene.add(sprite);
		this.sprites.push(sprite);
		document.getElementById("SpriteNb").innerHTML = cube.sprites.length;
		sprite.onClick = () =>{
			camera.position.x = sprite.cameraPosX;//sprite.cameraPosX 
			camera.position.y = sprite.cameraPosY;//sprite.cameraPosY 
			camera.position.z = sprite.cameraPosZ;//sprite.cameraPosZ
			document.getElementById("tooltipName").value = sprite.name; //affiche sur le web le nom
			document.getElementById("tooltipInfo").value = sprite.information;
			document.getElementById("OrdreEtape2").value = sprite.etape;
			document.getElementById("OrdreEtape").innerHTML = sprite.etape;
			cube.etapeEnCours = parseInt(sprite.etape);			
		}
	}
	destroy(){ // detruit le cube en détruisant les sprites avant
		TweenLite.to(this.cube.material,1, {
			opacity:0,
			onComplete: ()=>{
				this.scene.remove(this.cube)
			}
		})
		this.sprites.forEach((sprite) => { //pour chaque sprite de sprites
			TweenLite.to(sprite.scale,0.3, {
				x: 0,
				y: 0,
				z: 0,
				onComplete: () => {
					this.scene.remove(sprite) // reduit la taille puis detruit la sprite
				}
			})
		})
	}
	appear () { //Affichage du cube et de ses composants
		this.cube.material.opacity = 0;
		TweenLite.to(this.cube.material, 1, {	//definit l'opacite à 1
			opacity:1
		});
		this.sprites.forEach((sprite) =>{	//pour chaque sprite ça les aggrandit
			sprite.scale.set(0,0,0)
			TweenLite.to(sprite.scale,1, {
				x: 9,
				y: 9,
				z: 9
			})
		})
	}
////////////A SUPPRIMER /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	saveSprites(sprite, info, etape, cam) // Enregistre une sprite dans Sprites
//	{
//		sprite.information	= info; 
//		sprite.cameraPosX	= cam.position.x;
//		sprite.cameraPosY	= cam.position.y;
//		sprite.cameraPosZ	= cam.position.z;
//		sprite.etape		= etape;				//définit l'étape du sprite
//		sprite.onClick = () =>{						//fonction quand on click que la sprite
//			camera.position.x = sprite.cameraPosX;
//			camera.position.y = sprite.cameraPosY;
//			camera.position.z = sprite.cameraPosZ;
//			document.getElementById("tooltipName").innerHTML = cube.sprite.name; //affiche sur le web le nom
//			document.getElementById("tooltipInfo").innerHTML = cube.sprite.information;
//			//console.log(sprite.etape)
//		}
//		this.scene.add(sprite);
//		this.sprites.push(sprite);
//		this.sprite = sprite;						// le pointeur this.sprite se fixe sur la sprite
//		document.getElementById("SpriteNb").innerHTML = cube.sprites.length;
//	}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	deleteSprite() // supprime une sprite.
	{
		if (this.sprite)
		{
			TableauHTMLTEST.tableau.Actualisation;
			if(TableauHTMLTEST.index)
			{
				if(parseInt(TableauHTMLTEST.GetCellValue(TableauHTMLTEST.index,'4')) === this.sprite.id)
				{
					if(this.sprite.etape >= 1)
					{
						for(var i= this.sprite.etape; i<this.sprites.length;i++)
						{
							console.log(this.sprites[i]);
							if(this.sprites[parseInt(i)].etape>1)
							{this.sprites[parseInt(i)].etape -= 1; }
						}
					}
					for(let i=0;i<this.sprites.length;i++)
					{
						if(this.sprite.etape == this.sprites[i].etape)  this.sprites.splice(i,1); // Supprime l'étape du tableau Sprites[]				
					}
					//on supprime la ligne concernée et on raffraichit le tableau.
					TableauHTMLTEST.SuppressionLigne(TableauHTMLTEST.index);
					this.scene.remove(this.sprite);
					this.sprite = null;
					document.getElementById("SpriteNb").innerHTML = cube.sprites.length;
					console.log(this.sprites);
					this.sprites.sort(function(a,b){return a.etape - b.etape;}); //Tri le tableau dans l'ordre des étapes
					console.log(this.sprites);
					TableauHTMLTEST.ReinitialisationAffichage();
					document.getElementById("OrdreEtape").innerHTML = 0; // affiche 0/nombre d'étape existante					
				}
				else
				{
					alert('Echec');
				}
			}
			else
			{
				alert('Erreur: index non renseigné !!');
			}
		}
//		document.getElementById('btnSauvegarder').hidden = cube.sprites.length? false : true;
	}
	moveSprite(axe, speed) // deplace une sprite sur un axe
	{
		if (axe == 'x') {this.sprite.translateX(speed);}
		if (axe == 'y') {this.sprite.translateY(speed);}
		if (axe == 'z') {this.sprite.translateZ(speed);}
	}
	cubeMove(position) // deplace le cube sur ses différentes faces.
	{
		this.positionCamera += position; // on incrémente la position d'un.
		if(this.positionCamera > 3) // si on est à la face 4 retour a la 1
		{
			this.positionCamera = 0;
		}
		if(this.positionCamera < 0)
		{
			this.positionCamera = 3;
		}
		camera.position.set(cube.positionsCamera[this.positionCamera].x,cube.positionsCamera[this.positionCamera].y,cube.positionsCamera[this.positionCamera].z);
	}
	EtapeChangement(valeur) //Passe d'une etape a l'autre. Appel dans index.html
	{
		this.etapeEnCours += valeur;
		if(this.etapeEnCours >= this.sprites.length){this.etapeEnCours = this.sprites.length;}//on bloque l'etape au maximum
		if(this.etapeEnCours <1){ this.etapeEnCours = 1} //on descend pas en dessous de l'etape 1 et on boucle pas sur la derniere etape
		
		this.sprites.forEach((sprite) => {
			if(sprite.etape == this.etapeEnCours)
			{
				this.sprite = sprite;
				this.sprite.onClick();
			}
		});	
	}
	ToggleSprite()
	{
		if (this.edition == 1) {
			this.edition = 0;
			spriteCreate.classList.remove('on');
			this.createSprite = 'stop';
			document.getElementById("BtnCreerEtape").innerHTML = "Créer"; 
//			document.getElementById("menuModele").classList.remove('AjoutEtape');
//			document.getElementById('btntest').addAttribute("href");
//			document.getElementById('btnUtilisateurs').href = linkBtn1;
//			document.getElementById('btnModeles').href = linkBtn2;
//			document.getElementById('btnEvenements').href = linkBtn3;
			for(let i=0; i < hrefBtnsToDisable.length; i++)
			{
				document.getElementById(idBtnsToDisable[i]).href = hrefBtnsToDisable[i]; 				
			}
		}
		else
		{
			this.edition = 1;
			spriteCreate.classList.add('on');
			this.createSprite = 'ready';
			document.getElementById("BtnCreerEtape").innerHTML = "Annuler"; 
			document.getElementById('btnUtilisateurs').removeAttribute("href");
			document.getElementById('btnModeles').removeAttribute("href");
			document.getElementById('btnEvenements').removeAttribute("href");
			btnHome
			btnLogOut
			btnInformationsCompte
			for(let i=0; i < hrefBtnsToDisable.length; i++)
			{
				document.getElementById(idBtnsToDisable[i]).removeAttribute("href");
//				hrefBtnsToDisable[i] = document.getElementById(idBtnsToDisable[i]).href; 				
			}

//			document.getElementById("menuModele").classList.add('AjoutEtape');
			
		}
		//document.getElementById('btnSauvegarder').hidden = cube.sprites.length? false : true;
		document.getElementById('remarqueCreerEtape').hidden = document.getElementById('remarqueCreerEtape').hidden? false:true;
//		document.getElementById("container-fluid").classList.toggle("AjoutEtape"); 		
		document.getElementById("page-header").classList.toggle("AjoutEtape"); 
		document.getElementById("TitrePage").classList.toggle("AjoutEtape"); 
		document.getElementById("MenuOnglet").classList.toggle("AjoutEtape");
		document.getElementById("CreationEtapeNomDescription").classList.toggle("AjoutEtape");
		document.getElementById("MenuNavFixe").classList.toggle("AjoutEtape");
		document.getElementById("btnPositionduCube").classList.toggle("AjoutEtape");
		
		for(let i=0;i<bouttonPage.length;i++)
		{
			document.getElementById(bouttonPage[i]).disabled  = document.getElementById(bouttonPage[i]).disabled? false:true;			
		}


		
	
		
//		document.getElementById('btntest').href = x;
//		document.getElementById("container-fluid").classList.toggle("AjoutEtape"); 

		
	}
	RestoreMachine(scene,image,machine,modeleID)
	{
		this.scene = scene;
		let imageSurface = image.split(';');
		var geometry2 = new THREE.BoxGeometry( 100, 100, 100 ); // Creation d'un cube de 100 de côtés
		//	CHARGEMENT DES IMAGES
		if(imageSurface[0]){var image1 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[0]);}
		if(imageSurface[1])var image2 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[1]);
		if(imageSurface[2])var image3 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[2]);
		if(imageSurface[3])var image4 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[3]);
		if(imageSurface[4])var image5 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[4]);
		if(imageSurface[5])var image6 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[5]);
		var cubeMaterials = 
		[
			new THREE.MeshBasicMaterial( { map: image1, side: THREE.DoubleSide, name:"droite"} ),	// face droite
			new THREE.MeshBasicMaterial( { map: image2, side: THREE.DoubleSide, name:"gauche"} ),	// face gauche
			new THREE.MeshBasicMaterial( { map: image3, side: THREE.DoubleSide, name:"haut"} ),		// face dessus
			new THREE.MeshBasicMaterial( { map: image4, side: THREE.DoubleSide, name:"bas"} ),		// face dessous
			new THREE.MeshBasicMaterial( { map: image5, side: THREE.DoubleSide, name:"devant"} ),	// face avant
			new THREE.MeshBasicMaterial( { map: image6, side: THREE.DoubleSide, name:"derriere"} )	// face arrière
		];		
		let material = new THREE.MeshFaceMaterial( cubeMaterials);		
		//Création du cube
		this.cube = new THREE.Mesh( geometry2, material);
		this.cube.name="machine";
		this.scene.add(this.cube);
		this.points.forEach(this.addTooltip.bind(this));
		//AJOUT DIFFERENTES POSITIONS DE CAMERA
		this.positionsCamera.push(new THREE.Vector3(0, 0, 130));	//devant
		this.positionsCamera.push(new THREE.Vector3(130, 0, 0));	//droite
		this.positionsCamera.push(new THREE.Vector3(0, 0, -130));	//derriere
		this.positionsCamera.push(new THREE.Vector3(-130, 0, 0));	//gauche
	}
	spriteHtmlForJs()
	{
		var positionSprite = (document.getElementById('getEachSpritePosition').innerHTML);
		let posSpriteSplite = positionSprite.split(';');
		let cameraPositionSprite = (document.getElementById('getEachSpriteCamera').innerHTML);
		let camPosSpriteSplite = cameraPositionSprite.split(';');
		cube.addPoints({
			position: new THREE.Vector3(posSpriteSplite[0],posSpriteSplite[1],posSpriteSplite[2]),
			camera: new THREE.Vector3(camPosSpriteSplite[0],camPosSpriteSplite[1],camPosSpriteSplite[2]),
			name: document.getElementById('getEachSpriteName').innerHTML,
			info : document.getElementById('getEachSpriteDescription').innerHTML,
			etape : document.getElementById('getEachSpriteEtape').innerHTML,
			scene : cube,
			idBDD: document.getElementById('getEachSpriteId').innerHTML
		});
		cube.addTooltip(cube.points[cube.points.length-1]);
		TableauHTMLTEST.AjoutLigne(
				cube.sprites[cube.sprites.length-1].name,
				cube.sprites[cube.sprites.length-1].information,
				cube.sprites[cube.sprites.length-1].etape,
				cube.sprites[cube.sprites.length-1].idBDD,
				cube.sprites[cube.sprites.length-1].id);
		document.getElementById("getEachSpriteName").remove();
		document.getElementById("getEachSpritePosition").remove();
		document.getElementById("getEachSpriteCamera").remove();
		document.getElementById("getEachSpriteDescription").remove();
		document.getElementById("getEachSpriteEtape").remove();
		document.getElementById("getEachSpriteId").remove();
	}
	consoleLog(pString)
	{
		console.log(pString);
	}
//	checkAllSprites()
//	{
//		for(var p=0;p<this.points.length;p++)
//		{
//			document.getElementById("etapes_name").value=document.getElementById("etapes_name").value + this.points[p].name;
//			document.getElementById("etapes_description").value=this.points[p].info;
//			document.getElementById("etapes_position").value=this.points[p].position.x+';'+ this.points[p].position.y +';'+ this.points[p].position.z;
//			document.getElementById("etapes_camera").value=this.points[p].camera.x +';'+ this.points[p].camera.y +';'+ this.points[p].camera.z;
//			document.getElementById("etapes_etape").value=this.points[p].etape;
//		}
//	}
	SaveTable()
	{
		let spriteDescription=[];
		let spritePosCamera=[];
		let spriteOrdre=[];
		let spritePosition=[];
		for(let j=0;j< this.sprites.length;j++)
		{
			spriteDescription[j] = this.sprites[j].information;
			spritePosCamera[j] = this.sprites[j].cameraPosX + ';' + this.sprites[j].cameraPosY + ';' + this.sprites[j].cameraPosZ ;
			spritePosition[j] = parseInt(this.sprites[j].etape);
		}
		let jsonName = JSON.stringify( this.sprites );
		let jsonDescription = JSON.stringify( spriteDescription );
		let jsonPosCamera = JSON.stringify( spritePosCamera );
		let jsonOdre = JSON.stringify( spritePosition ); 
		document.getElementById('etapes_name').value = jsonName;
		document.getElementById('etapes_description').value = jsonDescription;
		document.getElementById('etapes_camera').value = jsonPosCamera;
		document.getElementById('etapes_etape').value = 888;
		document.getElementById('etapes_position').value = jsonOdre;
	}
	OneSpriteModif()
	{
		cube.sprite.name = document.getElementById('tooltipName').value;
		cube.sprite.information = document.getElementById('tooltipInfo').value;
		TableauHTMLTEST.ReinitialisationAffichage();
	}
	SetFaceCamera(face)
	{
		this.positionCamera = parseInt(face);
		this.cubeMove(0);
	}
	ModificationEnCours(etat)
	{
		this.modificationEnCours = etat;
	}
}
/* FIN CLASSE Machines*/

/*		CLASSE TABLEAU HTML		*/
class TableauEtapeHTML{
	constructor()
	{
		this.index = undefined;
		this.tableau = document.getElementById("table");;
	}
	ModifOrdreEtape()
	{
		this.Actualisation;//this.tableau.Actualisation;
		for(var i = 1; i < this.tableau.rows.length; i++)
	    {
	        for(var j=0; j< cube.sprites.length; j++)
	        {
				console.log(TableauHTMLTEST.GetCellValue(i,'2'));
	            if(parseInt(TableauHTMLTEST.GetCellValue(i,'4')) === cube.sprites[j].id)
		        {
	            	cube.sprites[j].etape = TableauHTMLTEST.GetCellValue(i,'2'); // L'ordre de la bulle info devient celle choisie dans le tableau.			            		
			    }
	        }
	    }
		cube.sprites.sort(function(a,b){return a.etape - b.etape;});
	}
	AjoutLigne(name,info,ordre,idBDD,id)
	{
		this.Actualisation;//document.getElementById("table");
		var tbody = this.tableau.tBodies[0];
		 
		var tr = document.createElement("tr");
		var newPara = document.createElement('div'); //Cellule du nom
		newPara.className = 'madiv';
		var text = document.createTextNode(name);
		newPara.appendChild(text);
		var td = document.createElement("td");
		td.appendChild(newPara );
		tr.appendChild( td );

		var newPara = document.createElement('div'); // Cellule de l'info
		newPara.className = 'madiv';
		var text = document.createTextNode(info);
		newPara.appendChild(text);
		var td = document.createElement("td");
		td.appendChild(newPara);
		tr.appendChild( td );

		var newPara = document.createElement('div'); //Cellule de l'ordre
		newPara.className = 'madiv';
		var text = document.createTextNode(ordre);
		newPara.appendChild(text);
		var td = document.createElement("td");
		td.appendChild(newPara);
		tr.appendChild( td );
		
		var newPara = document.createElement('div'); //Cellule de l'id dans la BDD
		var text = document.createTextNode(idBDD);
		newPara.appendChild(text);
		var td = document.createElement("td");
		td.className='celltoHidden';
		td.appendChild( newPara);
		tr.appendChild( td );
		
		var newPara = document.createElement('div'); //Cellule de l'id dans le JS
		var text = document.createTextNode(id);
		newPara.appendChild(text);
		var td = document.createElement("td");
		td.className='celltoHidden';
		td.appendChild( newPara);
		tr.appendChild( td );
	    this.tableau.tBodies[0].appendChild(tr);
	    this.GetSelectedRow(this.tableau.rows.length-1);	
	    this.Actualisation;
	}
	SuppressionLigne(ligne)
	{
		if(ligne)
		{			
			this.tableau.Actualiation;
			if(this.index)
			{
				this.tableau.rows[this.index].classList.toggle("selected"); 
				this.index = undefined;
				this.tableau.deleteRow(ligne); // suppression de l'étape dans le tableau				
			}
			else
			{
				alert('Erreur: Index indéfinie')
			}
		}
		else
		{
			alert('Erreur: aucune ligne définie');
		}
	}
	Actualisation()
	{
		this.tableau = document.getElementById("table");
	}
	GetSelectedRow(ligne)
	{
		this.Actualisation;
        this.tableau.rows[ligne].onclick = function()
        {
        	console.log(" this.tableau.rows[i].onclick = function()");
            // clear the selected from the previous selected row
            // the first time index is undefined
            if(typeof TableauHTMLTEST.index !== "undefined"){
            	TableauHTMLTEST.tableau.rows[TableauHTMLTEST.index].classList.toggle("selected"); 
            }
            TableauHTMLTEST.index = this.rowIndex;
            for(let j=0; j<cube.sprites.length;j++)
        	{
            	if(cube.sprites[j].id === parseInt(TableauHTMLTEST.GetCellValue(TableauHTMLTEST.index,'4')))
            	{
            		cube.sprite = cube.sprites[j]; 
            		cube.sprite.onClick();
            	}
        	}   
            this.classList.toggle("selected");
        };
	}
	GetCellValue(ligne,cellule)
	{
		if(ligne>=0)
		{
			if(cellule)
			{
				var getIdEtape = (tableSprite.rows[ligne].cells[cellule].innerHTML.replace(/<\/div>/g, ''));
				var getIdEtape2 = getIdEtape.replace(/<div>/g, '');
				var getIdEtape3 = getIdEtape2.replace(/<div class="madiv">/g, '');
				return(getIdEtape3);							
			}
			else
			{
				alert('Erreur: Cellule non renseignée !')
			}
		}
		else
		{
			alert('Erreur: Ligne non renseignée !')
		}
	}
	ReinitialisationAffichage()
	{
		while(TableauHTMLTEST.tableau.rows.length > 1)
		{
			TableauHTMLTEST.tableau.deleteRow(TableauHTMLTEST.tableau.rows.length-1);
		}
		this.index = undefined;
		for(var i=0;i<cube.sprites.length;i++)
		{
			TableauHTMLTEST.AjoutLigne(
					cube.sprites[i].name,
					cube.sprites[i].information,
					cube.sprites[i].etape,
					cube.sprites[i].idBDD,
					cube.sprites[i].id);
		}
	}
	upNdown(direction)
	{
	    var rows = document.getElementById("table").rows,
	        parent = rows[this.index].parentNode;
	     if(direction === "up")
	     {
	         if(this.index > 1){
	            parent.insertBefore(rows[this.index],rows[this.index - 1]);
	            // when the row go up the index will be equal to index - 1
	            this.index--;
	        }
	     }
	     if(direction === "down")
	     {
	         if(this.index < rows.length -1){
	            parent.insertBefore(rows[this.index + 1],rows[this.index]);
	            // when the row go down the index will be equal to index + 1
	            this.index++;
	        }
	     }
	     rows[this.index].cells[2].innerHTML  = this.index;
	     if(rows[this.index-1] && this.index>1)
	     {
	     	rows[this.index-1].cells[2].innerHTML  = this.index -1;
	     }                     
	     if(rows[this.index+1])
	     {
	    	 rows[this.index+1].cells[2].innerHTML  = this.index +1;
	     }
	}
}
/*	FIN CASSE TABLEAU HTML		*/
const container = document.body; // variable qui enregesitre document.body pour faciliter l'appel
const tooltip = document.querySelector('.tooltip'); // récupérer la classe de l'élément .tooltip (css) (ref aux sprites)
const spriteCreate = document.querySelector('.spriteCreate'); // récupérer la classe de l'élément canvas (css) (ref au canvas)
var menuHautSizeHeight = document.getElementById("container-fluid"); // récupérer la classe de l'élément container-fluid (css) (ref au container-fluid)
const menuSmall = document.querySelector('.menu2'); // récupérer la classe de l'élément .menu2 (css)
menuSmall.classList.add('is-active'); // mise en position absolu du menu.
//// Récupération de la hauteur du menu ///////////////////////////////////
const AdminRow2 = document.querySelector('.AdminRow2');
const pageHeader = document.getElementById('page-header');

const menuModele = document.getElementById('menuModele');

var modeleID = document.getElementById('modeleID').innerHTML;
const imageFileNameMachine = document.getElementById('filename');
var cutFileName = imageFileNameMachine.innerHTML;
//const getMachineName = document.getElementById('machineNamed');
//var machineNamed = getMachineName.innerHTML;
var machineNamed = 'PasDeMachineEnReference';
var getNameEachSprite = document.getElementById('getEachSprite');
var spriteActive = false;
var ecartHeightMenuCanvas = menuHautSizeHeight.offsetHeight;
var ratio = 1/2;
var ratioHeight = 1/2;
var windowWidth = (window.innerWidth * ratio);
var windowHeight = ((window.innerHeight)-ecartHeightMenuCanvas)*ratioHeight;
var IToResize = 0; // variable pour définir quand rentrer dans la fonction OnResize();
////////////////RENDU//////////////////////////////////////////////////////////
const renderer = new THREE.WebGLRenderer({canvas: myCanvasElement});// Rendu
renderer.setSize( windowWidth, windowHeight);
renderer.shadowMapEnabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

container.appendChild(renderer.domElement);
var tableSprite = document.getElementById("table");
///////////////////////////////////////////////////////////////////////////////
// Création Environnement/scene et controle ///////////////////////////////////////////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, (windowWidth / windowHeight), 0.1, 1000);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.5;
controls.autoRotate = false;
controls.enableZoom = true;
controls.enablePan = false;
controls.minDistance = 140;
controls.maxDistance = 210;
//controls.autoRotate = true;
camera.position.set(0, 0, 140);
controls.update();
controls.keys = {
		LEFT: 0, //left arrow
		UP: 0, // up arrow
		RIGHT: 1, // right arrow
		BOTTOM: 0 // down arrow
	}
TableauHTMLTEST = new TableauEtapeHTML();
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// Position des boutons de déplacement de la caméra //////////////////////
const btnCameraFaceCube = document.querySelector('.btnPositionduCube'); 
btnCameraFaceCube.style.top = ecartHeightMenuCanvas + windowHeight +'px';
btnCameraFaceCube.style.right = windowWidth/2 - 30 + 'px';
// Création sphère	////////////////////////////////////////////////////////////////////////////////////
const geometrysphere = new THREE.SphereGeometry(400, 400, 400);
const textureLoader = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial({
// 	map: texture,
// 	color: 0xECECEC,
 	color: 0xCAD7DA, 	
	side: THREE.DoubleSide
})
material.transparent = true;
sphere = new THREE.Mesh(geometrysphere, material);
scene.add(sphere);;
//création de la machine
let cube = new Machines();
cube.RestoreMachine(scene,cutFileName,machineNamed,modeleID);
cube.appear();
cube.castShadow = true;
cube.receiveShadow = false;

var meshFloor, ambientLight, light;
ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
sphere.receiveShadow = true;

light = new THREE.PointLight(0xffffff, 0.8, 18);
light.position.set(120,120,120);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 25;
scene.add(light);

const rayCaster = new THREE.Raycaster();

var bouttonPage=
	[
		'ongletInformation',	
		'ongletTableau',
		'ongletHistorique',
	
	];
var idBtnsToDisable = 
	[
		'BtnCreerEtape', 'btnUtilisateurs',
		'btnModeles', 'btnEvenements',
		'btnHome', 'btnLogOut',
		'btnInformationsCompte'
	];
var btn1, btn2, btn3, btn4, btn5, btn6, btn7;
var hrefBtnsToDisable= 
	[
		btn1, btn2, 
		btn3, btn4,
		btn5, btn6,
		btn7
	];
// lien des boutons du menu haut
for(let i=0; i< idBtnsToDisable.length; i++)
{
	hrefBtnsToDisable[i] = document.getElementById(idBtnsToDisable[i]).href; 
}
//var linkBtn1 = document.getElementById("btnUtilisateurs").href;
//var linkBtn2 = document.getElementById("btnModeles").href;
//var linkBtn3 = document.getElementById("btnEvenements").href;



function onClick(e)
{
//	console.log(e);
	let mouse = new THREE.Vector2(
		( (e.clientX-ecartWidthMenuCanvas) / windowWidth ) * 2 - 1,
		- ( (e.clientY-ecartHeightMenuCanvas) / windowHeight ) * 2 + 1
	);	
	rayCaster.setFromCamera(mouse, camera);	
	let intersects = rayCaster.intersectObjects(scene.children); // Regarde ce qui rencontre les "enfants" de la scène: tooltip, sphère...
	if (cube.edition == 0) // si edition=0 alors on affiche le sprite
	{
		cube.createSprite = 'stop'; 		
		intersects.forEach(function(intersect){			
			if(intersect.object.type === 'Sprite')
			{
				cube.sprite = intersect.object;
//				document.getElementById("tooltipName").value = cube.sprite.name; //.innerHTML = <div> .value = <input>
//				document.getElementById("tooltipInfo").value = cube.sprite.information;
//				document.getElementById('etapes_position').value = cube.sprite.position.x +';'+cube.sprite.position.y +';'+ cube.sprite.position.z;
//				document.getElementById('etapes_name').value = cube.sprite.name;
//				document.getElementById('etapes_description').value = cube.sprite.information;
//				document.getElementById('etapes_etape').value = cube.sprite.etape;
				//Selectionne la ligne du tableau en fonction de l'étape sélectionnée.
				TableauHTMLTEST.Actualisation;
				for(var i=0; i< TableauHTMLTEST.tableau.rows.length; i++)
				{				
					if(parseInt(TableauHTMLTEST.GetCellValue(i,4)) === cube.sprite.id) // Correspondance entre l'étape qui est affiché sur le tableau et celle qui est sélectionnée
					{
						tableSprite.rows[i].onclick();									
					}
				}
			}
		})
	}
	//si edition = 1 et image = verte, on pose un sprite
//	else if (cube.createSprite == 'start')
//	{
//		console.log(document.getElementById('CreationEtapeNom').value);
//		nVarNom = document.getElementById('CreationEtapeNom').value;
//		nVarInfo = document.getElementById('CreationEtapeDescription').value;
//		cube.addPoints({
//			position: intersects[0].point,
//			camera: camera.position,
//			name: nVarNom,
//			info : nVarInfo,
//			etape: cube.sprites.length+1,
//			scene : cube
//		});
//		cube.addTooltip(cube.points[cube.points.length-1]);
//		if(cube.sprites[cube.sprites.length-1].position.x <= (intersects[0].object.geometry.parameters.width/2 +0.09) && cube.sprites[cube.sprites.length-1].position.x >= (intersects[0].object.geometry.parameters.width/2 - 0.101)) { cube.sprites[cube.sprites.length-1].position.x += cube.initEcartTooltip;}
//		if(cube.sprites[cube.sprites.length-1].position.x >= -(intersects[0].object.geometry.parameters.width/2 +0.09) && cube.sprites[cube.sprites.length-1].position.x <= -(intersects[0].object.geometry.parameters.width/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.x -= cube.initEcartTooltip;}
//		if(cube.sprites[cube.sprites.length-1].position.y <= (intersects[0].object.geometry.parameters.height/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.y >= (intersects[0].object.geometry.parameters.height/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.y += cube.initEcartTooltip;}
//		if(cube.sprites[cube.sprites.length-1].position.y >= -(intersects[0].object.geometry.parameters.height/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.y <= -(intersects[0].object.geometry.parameters.height/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.y -= cube.initEcartTooltip;}
//		if(cube.sprites[cube.sprites.length-1].position.z <= (intersects[0].object.geometry.parameters.depth/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.z >= (intersects[0].object.geometry.parameters.depth/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.z += cube.initEcartTooltip;}
//		if(cube.sprites[cube.sprites.length-1].position.z >= -(intersects[0].object.geometry.parameters.depth/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.z <= -(intersects[0].object.geometry.parameters.depth/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.z -= cube.initEcartTooltip;}
//		TableauHTMLTEST.AjoutLigne(cube.sprite.name,
//				cube.sprite.information,
//				cube.sprite.etape,
//				cube.sprite.idBDD,
//				cube.sprite.id);
//		cube.ToggleSprite();
//	}
	else if(cube.createSprite == 'ready') //sinon c'est qu'on est en ready et on passe en start
	{ cube.createSprite = 'start';}
	intersects.forEach(function(intersect){
		if(intersect.object.type === 'Sprite')	{intersect.object.onClick();}
		if(intersect.object.name === 'machine'){}
	})
}		
////        ON RESIZE                     ///////////////////////////////////////////////////////////////////////

function onResize()
{
//	console.log("OnResize()");
	if(IToResize == 2)
	{
		IToResize = 0;
	}
	else
	{
		IToResize++;		
	}
	if(window.innerWidth > 768) // mode ordi
	{
		ecartWidthMenuCanvas = window.innerWidth - renderer.context.drawingBufferWidth; //Récupère la position en X où commence le modele 3D
		ecartHeightMenuCanvas = menuHautSizeHeight.offsetHeight; // Récupère la hauteur du menu d'en haut. Le modele 3D est juste en dessous
		ratioHeight = 0.7;
		ratio = 0.4;
		windowWidth = window.innerWidth*ratio;
		windowHeight = (window.innerHeight  - ecartHeightMenuCanvas) * ratioHeight; 
		///////PLACEMENT DES BOUTONS DE NAVIGATIONS ////////////////////////////////////
		btnCameraFaceCube.style.top = ecartHeightMenuCanvas + windowHeight +'px';
		let positionright = document.getElementById('myCanvasElement').width/2 - document.getElementById('boutonFacesCube').offsetWidth/2;
		btnCameraFaceCube.style.right = positionright +'px';//windowWidth/2 - 30 + 'px';
		////////////////////////////////////////////////////////////////////////////////
		menuSmall.classList.add('is-active'); // Place le menu a gauche
		renderer.setSize(windowWidth, windowHeight);//Redimensionne le modele 3D en prenant la page - la barre du haut * le ratio de 1/3
		camera.aspect = windowWidth / windowHeight;
		//////RAPPEL CAR BUG QUAND ON PASSE DE FENETRE A PLEIN ECRAN ///////////////////////////////////////////////////////////////////////////////
		ecartWidthMenuCanvas = window.innerWidth - renderer.context.drawingBufferWidth; //Récupère la position en X où commence le modele 3D
		ecartHeightMenuCanvas = menuHautSizeHeight.offsetHeight; // Récupère la hauteur du menu d'en haut. Le modele 3D est juste en dessous
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		menuSmall.style.height = (window.innerHeight - menuHautSizeHeight.offsetHeight)*0.9 +'px';
//		menuModele.style.height = 700 + 'px';
	}
	else	// Mode telephone
	{
		menuSmall.classList.remove('is-active'); // place le menu d'affichage au dessus
		ecartWidthMenuCanvas = 0 ;//Récupère la position en X où commence le modele 3D		
		///////PLACEMENT DES BOUTONS DE NAVIGATIONS ////////////////////////////////////
		btnCameraFaceCube.style.top = window.innerHeight- 30 +'px';
		btnCameraFaceCube.style.right = windowWidth/2 - 30 + 'px';
		////////////////////////////////////////////////////////////////////////////////
		ecartHeightMenuCanvas =   AdminRow2.offsetHeight + pageHeader.offsetHeight; // Récupère la hauteur du menu du haut
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight - ecartHeightMenuCanvas;
		renderer.setSize(window.innerWidth, windowHeight);
		camera.aspect = window.innerWidth / (windowHeight);	
		menuSmall.style.height = (window.innerHeight - ecartHeightMenuCanvas)*0.9 +'px';
//		menuSmall.style.width = window.innerWidth*0.5 + 'px';
//		document.getElementById('menuModele').style.width = 50 + 'px';
	}
	camera.updateProjectionMatrix();
	if(IToResize == 1)
	{
		setTimeout(function(){onResize();},10);
		IToResize = 2;
	}
//	menuModele = ;

}
var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	var dist = Math.sqrt((camera.position.z)*(camera.position.z)
		+(camera.position.y)*(camera.position.y)
		+(camera.position.x)*(camera.position.x));
	var limit = Math.sqrt(500*500);
	if(dist>=limit)
	{	
		camera.position.x = 50;
		camera.position.y = 50;
		camera.position.z = 50;
	}
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
}
////////////              ON MOUSE MOVE     /////////////////////////////////////////////////////////////////////
function onMouseMove(e)
{
	let mouse = new THREE.Vector2(
			( (e.clientX-ecartWidthMenuCanvas) / windowWidth ) * 2 - 1,
			- ( (e.clientY-ecartHeightMenuCanvas) / windowHeight) * 2 + 1 
		);
	rayCaster.setFromCamera(mouse, camera);
	let foundSprite = false;
	let intersects = rayCaster.intersectObjects(scene.children); // Regarde ce qui rencontre les "enfants" de la scène: tooltip, sphère...	
	intersects.forEach(function(intersect){
		if(intersect.object.type === 'Sprite')
		{
			let p = intersect.object.position.clone().project(camera); // Je récupère la position du sprite et je la projette sur la caméra.
			//c'est la position x et y qui nous intéresse
			if(window.innerWidth > 768)
			{
				tooltip.style.top = ((-1*p.y + 1) * windowHeight/2) + ecartHeightMenuCanvas + 'px';
			}
			else
			{
				tooltip.style.top = ((-1*p.y + 1) * windowHeight/2) + ecartHeightMenuCanvas + 'px';
			}
			tooltip.style.left = (p.x+1)* windowWidth/2  + ecartWidthMenuCanvas +'px';
			tooltip.classList.add('is-active');
			tooltip.innerHTML = intersect.object.name;
			spriteActive = intersect.object;
			foundSprite = true;
			TweenLite.to(intersect.object.scale, 0.5, {
				x:13,
				y:13,
				z:13
			});
		}
	})
	if(foundSprite === false && spriteActive)
	{
		tooltip.classList.remove('is-active')
		TweenLite.to(spriteActive.scale, 0.5, {
				x:9,
				y:9,
				z:9
			})
		spriteActive = false;
	}
}
function Keyboard(event)
{
	if(event.keyCode == 90) //z
	{
//		console.log(document.getElementById('getEachSprite').innerHTML)
		console.log(scene);
	}
	if(event.keyCode == 81) //q
	{
//		console.log(document.getElementById(etapes_tableausprites));
	}
	if(event.keyCode == 82) //r
	{
		cube.positionReset();	
	}
	if(event.keyCode == 83) //s
	{

//		var tableSprite = document.getElementById("table");
//		console.log(tableSprite.rows.length);
	}
	if(event.keyCode == 68) //d
	{			
	}
	if(event.keyCode == 69) //e
	{
//		cube.ToggleSprite();
	}
	if(event.keyCode == 85) //u
	{
//		AjoutEtapeTableau(cube.sprites[2].name,
//				cube.sprites[2].information,
//				cube.sprites[2].etape,
//				cube.sprites[2].idBDD,
//				cube.sprites[2].id);
	}
	if(event.keyCode == 46) //Delete btn suppr.
	{
//		cube.deleteSprite();
	}
	if(event.keyCode == 37) //console.log("fleche de gauche");
	{

	}
	if(event.keyCode == 39) //fleche de droite;
	{
//		var tableSprite = document.getElementById("table");
//		table.rows[1].sort();
	}
	if(event.keyCode == 80) //p
	{
//		cube.EtapeChangement(-1);
	}
	if(event.keyCode == 77) //m
	{
		  
	}
}
function onScreenChange(){console.log('screenchange');}
function fn() // Lorsque la page est chargée la fonction se déclenche
{
//	onResize();
	cube.sprite = cube.sprites[0];
	if(cube.sprite)
	{
		cube.sprite.onClick();
	}
	document.getElementById('myCanvasElement').style.borderTop = "1px solid #00a1d7";
	document.getElementById('myCanvasElement').style.borderLeft = "1px solid #00a1d7";
}
function ready()
{
	setTimeout(function(){onResize();},10);
}
function moveNavBar(visible,cache1,cache2,cache3)
{
	document.getElementById(visible).hidden = false;
	
	document.getElementById(cache1).hidden = true;

	document.getElementById(cache2).hidden = true;
	document.getElementById(cache3).hidden = true;
}
function ongletActif(actif,cache1,cache2,cache3)
{
	document.getElementById(actif).style.background  ="#117a8b";
	document.getElementById(cache1).style.background = "#17a2b8";
	document.getElementById(cache2).style.background = "#17a2b8";
	document.getElementById(cache3).style.background = "#17a2b8";
}

//function TableauBullesInfos()
//{
//	document.getElementById('MenuInformation').hidden = true;// = document.getElementById('information').hidden : true;
////	document.getElementById('ModifBulleInfo').hidden = false;
//	document.getElementById('MenuTableau').hidden = false;// = document.getElementById('TableauBullesInfos').hidden : false;
////	document.getElementById('information').hidden = document.getElementById('TableauBullesInfos').hidden? false : true;
//}
//function InformationsShow()
//{
//	document.getElementById('MenuInformation').hidden = false;// = document.getElementById('information').hidden : false;
//	document.getElementById('MenuTableau').hidden = true;
////	document.getElementById('ModifBulleInfo').hidden = true;
//}
//function ModifBulleInfoShow()
//{
////	document.getElementById('ModifBulleInfo').hidden = false;// = document.getElementById('information').hidden : true;
//	document.getElementById('MenuTableau').hidden = true;// = document.getElementById('TableauBullesInfos').hidden : false;
//	document.getElementById('Menuinformation').hidden = true;// = document.getElementById('information').hidden : true;
//}
function EditButton(idButton)
{
	document.getElementById(idButton).disabled ? (document.getElementById(idButton).disabled = false) : (document.getElementById(idButton).disabled = true);
}

window.addEventListener('resize', onResize);
window.addEventListener('load', fn, false );
container.addEventListener('webkitfullscreenchange', onScreenChange);
container.addEventListener('click', onClick);//clic gauche
container.addEventListener('mousemove', onMouseMove);
container.addEventListener('keydown', Keyboard, false);
document.addEventListener("DOMContentLoaded", ready);
animate();
window.oncontextmenu= function OnContextMenu(e){ // clic droit
	let mouse = new THREE.Vector2(
			( (e.clientX-ecartWidthMenuCanvas) / windowWidth ) * 2 - 1,
			- ( (e.clientY-ecartHeightMenuCanvas) / windowHeight ) * 2 + 1
		);	
	rayCaster.setFromCamera(mouse, camera);	
	let intersects = rayCaster.intersectObjects(scene.children); // Regarde ce qui rencontre les "enfants" de la scène: tooltip, sphère...
	if(cube.createSprite == 'start')
	{
		if(intersects[0].object.name);
		{
			if(intersects[0].object.name == 'machine')
			{
				nVarNom = document.getElementById('CreationEtapeNom').value;
				nVarInfo = document.getElementById('CreationEtapeDescription').value;
				cube.addPoints({
					position: intersects[0].point,
					camera: camera.position,
					name: nVarNom,
					info : nVarInfo,
					etape: cube.sprites.length+1,
					scene : cube
				});
				cube.addTooltip(cube.points[cube.points.length-1]);
				if(cube.sprites[cube.sprites.length-1].position.x <= (intersects[0].object.geometry.parameters.width/2 +0.09) && cube.sprites[cube.sprites.length-1].position.x >= (intersects[0].object.geometry.parameters.width/2 - 0.101)) { cube.sprites[cube.sprites.length-1].position.x += cube.initEcartTooltip;}
				if(cube.sprites[cube.sprites.length-1].position.x >= -(intersects[0].object.geometry.parameters.width/2 +0.09) && cube.sprites[cube.sprites.length-1].position.x <= -(intersects[0].object.geometry.parameters.width/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.x -= cube.initEcartTooltip;}
				if(cube.sprites[cube.sprites.length-1].position.y <= (intersects[0].object.geometry.parameters.height/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.y >= (intersects[0].object.geometry.parameters.height/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.y += cube.initEcartTooltip;}
				if(cube.sprites[cube.sprites.length-1].position.y >= -(intersects[0].object.geometry.parameters.height/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.y <= -(intersects[0].object.geometry.parameters.height/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.y -= cube.initEcartTooltip;}
				if(cube.sprites[cube.sprites.length-1].position.z <= (intersects[0].object.geometry.parameters.depth/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.z >= (intersects[0].object.geometry.parameters.depth/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.z += cube.initEcartTooltip;}
				if(cube.sprites[cube.sprites.length-1].position.z >= -(intersects[0].object.geometry.parameters.depth/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.z <= -(intersects[0].object.geometry.parameters.depth/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.z -= cube.initEcartTooltip;}
				TableauHTMLTEST.AjoutLigne(cube.sprite.name,
						cube.sprite.information,
						cube.sprite.etape,
						cube.sprite.idBDD,
						cube.sprite.id);
				cube.ToggleSprite();
				cube.ModificationEnCours(1);
			}
		}
	}

//	else //sinon c'est qu'on est en ready et on passe en start
//	{ cube.createSprite = 'start';}
//	intersects.forEach(function(intersect){
//		if(intersect.object.type === 'Sprite')	{intersect.object.onClick();}
//		if(intersect.object.name === 'machine'){}
//	})
}
window.onbeforeunload = function(){
	if(cube.modificationEnCours === 1) // Si une modification a eu lieu sur les annotations.
	{
		return "Etes vous sûr de vouloir fermer ?";
	}
	else(cube.modificationEnCours === 0) // Si aucune modification n'a eu lieu on supprime les objets
	{	
		while(cube.sprites[0]!= null)
		{
			cube.sprites[0].onClick();
			cube.sprite = cube.sprites[0];
			TableauHTMLTEST.Actualisation;
			for(var i=0; i< TableauHTMLTEST.tableau.rows.length; i++)
			{				
				if(parseInt(TableauHTMLTEST.GetCellValue(i,4)) === cube.sprite.id) // Correspondance entre l'étape qui est affiché sur le tableau et celle qui est sélectionnée
				{
					tableSprite.rows[i].onclick();									
				}
			}
			cube.deleteSprite();	
	
		}
	//	cube.scene.remove(cube.cube);
		scene.remove(cube.cube);
		cube = null; 
	}
	
};