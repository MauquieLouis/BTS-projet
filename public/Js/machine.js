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
		this.positionsCamera.push(new THREE.Vector3(0, 0, 140));//devant
		this.positionsCamera.push(new THREE.Vector3(140, 0, 0));//droite
		this.positionsCamera.push(new THREE.Vector3(0, 0, -140));//derriere
		this.positionsCamera.push(new THREE.Vector3(-140, 0, 0));//gauche
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
	addTooltip(point) // c'est utile avant l'apparition du cube
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
		document.getElementById('btnSauvegarder').hidden = cube.sprites.length? false : true;
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
		}
		else
		{
			this.edition = 1;
			spriteCreate.classList.add('on');
			this.createSprite = 'ready';
		}
		document.getElementById('btnSauvegarder').hidden = cube.sprites.length? false : true;
	}
	RestoreMachine(scene,image,machine,modeleID)
	{
		this.scene = scene;
		let imageSurface = image.split(';');
		//création modèle de cube
		var geometry2 = new THREE.BoxGeometry( 100, 100, 100 ); // Creation d'une boite de 100 de côtés
//////////////////CHARGEMENT DES IMAGES/////////////////////////////////////////////////////
		if(imageSurface[0]){var image1 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[0]);}
		if(imageSurface[1])var image2 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[1]);
		if(imageSurface[2])var image3 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[2]);
		if(imageSurface[3])var image4 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[3]);
		if(imageSurface[4])var image5 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[4]);
		if(imageSurface[5])var image6 = new THREE.TextureLoader().load('../../image/modele/'+modeleID+'/'+imageSurface[5]);
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
		this.positionsCamera.push(new THREE.Vector3(0, 0, 130));//devant
		this.positionsCamera.push(new THREE.Vector3(130, 0, 0));//droite
		this.positionsCamera.push(new THREE.Vector3(0, 0, -130));//derriere
		this.positionsCamera.push(new THREE.Vector3(-130, 0, 0));//gauche
////////////////////////////////////////////////////////////////////////////////////////////
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
		this.tableau.Actualisation;
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
var modeleID = document.getElementById('modeleID').innerHTML;
const imageFileNameMachine = document.getElementById('filename');
var cutFileName = imageFileNameMachine.innerHTML;
const getMachineName = document.getElementById('machineNamed');
var machineNamed = getMachineName.innerHTML;
var getNameEachSprite = document.getElementById('getEachSprite');
var spriteActive = false;
var ecartHeightMenuCanvas = menuHautSizeHeight.offsetHeight;
var ratio = 1/2;
var ratioHeight = 1/2;
var windowWidth = (window.innerWidth * ratio);
var windowHeight = ((window.innerHeight)-ecartHeightMenuCanvas)*ratioHeight;
////////////////RENDU//////////////////////////////////////////////////////////
const renderer = new THREE.WebGLRenderer({canvas: myCanvasElement});// Rendu
renderer.setSize( windowWidth, windowHeight);
container.appendChild(renderer.domElement);
var tableSprite = document.getElementById("table");
///////////////////////////////////////////////////////////////////////////////
// Création Environnement/scene et controle ///////////////////////////////////////////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, (windowWidth / windowHeight), 0.1, 1000);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.5;
controls.autoRotate = false;
controls.enableZoom = false;
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
 	color: 0xECECEC,
	side: THREE.DoubleSide
})
material.transparent = true;
sphere = new THREE.Mesh(geometrysphere, material);
scene.add(sphere);;
//création de la machine
let cube = new Machines();
cube.RestoreMachine(scene,cutFileName,machineNamed,modeleID);
cube.appear();
const rayCaster = new THREE.Raycaster();
function onClick(e)
{
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
	else if (cube.createSprite == 'start')
	{
		nVarNom = prompt("Name :");
		nVarInfo = prompt("Informations :");
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
	}
	else //sinon c'est qu'on est en ready et on passe en start
	{ cube.createSprite = 'start';}
	intersects.forEach(function(intersect){
		if(intersect.object.type === 'Sprite')	{intersect.object.onClick();}
		if(intersect.object.name === 'machine'){}
	})
}		
////        ON RESIZE                     ///////////////////////////////////////////////////////////////////////
function onResize()
{
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
		btnCameraFaceCube.style.right = windowWidth/2 - 30 + 'px';
		////////////////////////////////////////////////////////////////////////////////
		menuSmall.classList.add('is-active'); // Place le menu a gauche
		renderer.setSize(windowWidth, windowHeight);//Redimensionne le modele 3D en prenant la page - la barre du haut * le ratio de 1/3
		camera.aspect = windowWidth / windowHeight;
		//////RAPPEL CAR BUG QUAND ON PASSE DE FENETRE A PLEIN ECRAN ///////////////////////////////////////////////////////////////////////////////
		ecartWidthMenuCanvas = window.innerWidth - renderer.context.drawingBufferWidth; //Récupère la position en X où commence le modele 3D
		ecartHeightMenuCanvas = menuHautSizeHeight.offsetHeight; // Récupère la hauteur du menu d'en haut. Le modele 3D est juste en dessous
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		menuSmall.style.height = (window.innerHeight - menuHautSizeHeight.offsetHeight)*0.7 +'px';		
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
	}
	camera.updateProjectionMatrix();
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
		console.log(document.getElementById('getEachSprite').innerHTML)
	}
	if(event.keyCode == 81) //q
	{
		console.log(document.getElementById(etapes_tableausprites));
	}
	if(event.keyCode == 82) //r
	{
		cube.positionReset();	
	}
	if(event.keyCode == 83) //s
	{

		var tableSprite = document.getElementById("table");
		console.log(tableSprite.rows.length);
	}
	if(event.keyCode == 68) //d
	{			
	}
	if(event.keyCode == 69) //e
	{
		cube.ToggleSprite();
	}
	if(event.keyCode == 85) //u
	{
		AjoutEtapeTableau(cube.sprites[2].name,
				cube.sprites[2].information,
				cube.sprites[2].etape,
				cube.sprites[2].idBDD,
				cube.sprites[2].id);
	}
	if(event.keyCode == 46) //Delete btn suppr.
	{
		cube.deleteSprite();
	}
	if(event.keyCode == 37) //console.log("fleche de gauche");
	{
	}
	if(event.keyCode == 39) //fleche de droite;
	{
		var tableSprite = document.getElementById("table");
//		table.rows[1].sort();
	}
	if(event.keyCode == 80) //p
	{
		cube.EtapeChangement(-1);
	}
	if(event.keyCode == 77) //m
	{
	}
}
function onScreenChange(){console.log('screenchange');}
function fn() // Lorsque la page est chargée la fonction se déclenche
{
	onResize();
	cube.sprites[0].onClick();
}

function TableauBullesInfos()
{
	document.getElementById('information').hidden = true;// = document.getElementById('information').hidden : true;
//	document.getElementById('ModifBulleInfo').hidden = false;
	document.getElementById('TableauBullesInfos').hidden = false;// = document.getElementById('TableauBullesInfos').hidden : false;
//	document.getElementById('information').hidden = document.getElementById('TableauBullesInfos').hidden? false : true;
}
function InformationsShow()
{
	document.getElementById('information').hidden = false;// = document.getElementById('information').hidden : false;
	document.getElementById('TableauBullesInfos').hidden = true;
//	document.getElementById('ModifBulleInfo').hidden = true;
}
function ModifBulleInfoShow()
{
//	document.getElementById('ModifBulleInfo').hidden = false;// = document.getElementById('information').hidden : true;
	document.getElementById('TableauBullesInfos').hidden = true;// = document.getElementById('TableauBullesInfos').hidden : false;
	document.getElementById('information').hidden = true;// = document.getElementById('information').hidden : true;
}
function EditButton(idButton)
{
	document.getElementById(idButton).disabled ? (document.getElementById(idButton).disabled = false) : (document.getElementById(idButton).disabled = true);
}
window.addEventListener('resize', onResize);
window.addEventListener('load', fn, false );
container.addEventListener('webkitfullscreenchange', onScreenChange);
container.addEventListener('click', onClick);
container.addEventListener('mousemove', onMouseMove);
container.addEventListener('keydown', Keyboard, false);
animate();
onResize();