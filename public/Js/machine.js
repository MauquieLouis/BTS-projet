/* Classe Machines*/
class Machines{
	constructor(image)
	{
		this.image = image;			// ne sert à rien je crois
		this.points = [];			// Ajoute les sprites à l'ouverture de la page web.
		this.sprites = [];			// Conteneur de sprites
		this.cubes= [];				// Conteneur de cubes et normalement il n'y a qu'une cube
		this.scene = null;			// contient la scene de la page web
		this.cube = null;			// pointeur sur un cube du containeur cubes
		this.sprite = null;			// pointeur sur un sprite
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
		
		//// Paramétrer les faces :
		//var image1 = new THREE.TextureLoader().load('images/machine1/droit.jpg');
		//var image2 = new THREE.TextureLoader().load('images/machine1/derriere.jpg');
		//var image3 = new THREE.TextureLoader().load('images/machine1/espace.jpg');
		//var image4 = new THREE.TextureLoader().load('images/machine1/espace.jpg');
		//var image5 = new THREE.TextureLoader().load('images/machine1/devant.jpg');
		//var image6 = new THREE.TextureLoader().load('images/machine1/derriere.jpg');
		
		
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
//////////////////////////////////////////////////////////
		
///////////////////////AJOUT DIFFERENTES POSITIONS DE CAMERA////////////////////////////////
		this.positionsCamera.push(new THREE.Vector3(0, 0, 130));//devant
		this.positionsCamera.push(new THREE.Vector3(130, 0, 0));//droite
		this.positionsCamera.push(new THREE.Vector3(0, 0, -130));//derriere
		this.positionsCamera.push(new THREE.Vector3(-130, 0, 0));//gauche
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
		console.log(axe);
		console.log(vitesse);
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
		console.log("Function : addToolTip(point)");
		let spriteMap = new THREE.TextureLoader().load( "../../image/machine/ampoule.png" );
		let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap} );
		let sprite = new THREE.Sprite( spriteMaterial );
		sprite.name = point.name;
		sprite.information	= point.info; 
		console.log(point.camera);
		sprite.cameraPosX	= point.camera.x;
		sprite.cameraPosY	= point.camera.y;
		sprite.cameraPosZ	= point.camera.z;
		sprite.etape		= point.etape;
		console.log(sprite.etape);
//		let position = new THREE.Vector3(45,0,0);
//		sprite.position.copy(new THREE.Vector3(150,0,0));
		sprite.position.copy(point.position.clone()); //.clone permet de cloner et de ne pas toucher la variable passée par référence l'objet méthode normalize
		sprite.scale.multiplyScalar(5);
		/*		sprite.position.x = 350;
		sprite.position.y = 350;
		sprite.position.z = 80;
*/
		this.sprite = sprite;
		// this.sprite.position.clone().normalize().multiplyScalar(100);
		//sprite.scale.multiplyScalar(8) // on multiplie la sprite par 2 sur tous les vecteurs
		this.scene.add(sprite);
		this.sprites.push(sprite);
		sprite.etape = this.sprites.length;
		console.log(sprite.etape);
		document.getElementById("SpriteNb").innerHTML = cube.sprites.length;
		sprite.onClick = () =>{
			console.log(sprite.name);
			camera.position.x = sprite.cameraPosX;//sprite.cameraPosX 
			camera.position.y = sprite.cameraPosY;//sprite.cameraPosY 
			camera.position.z = sprite.cameraPosZ;//sprite.cameraPosZ
			document.getElementById("tooltipName").innerHTML = cube.sprite.name; //affiche sur le web le nom
			document.getElementById("tooltipInfo").innerHTML = cube.sprite.information;
			document.getElementById("tooltipEtape").innerHTML = cube.sprite.etape;
			//sprite.scale.multiplyScalar(8)
			//sprite.name ="pantoufle"
			//this.scene.remove(sprite) //supprime le sprite ///////////
			/*this.destroy()
			point.scene.createScene(scene)
			point.scene.appear()*/
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
				x: 5,
				y: 5,
				z: 5
			})
		})
	}
////////////A SUPPRIMER /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	saveSprites(sprite, info, etape, cam) // Enregistre une sprite dans Sprites
	{
		sprite.information	= info; 
		sprite.cameraPosX	= cam.position.x;
		sprite.cameraPosY	= cam.position.y;
		sprite.cameraPosZ	= cam.position.z;
		sprite.etape		= etape;				//définit l'étape du sprite
		
		sprite.onClick = () =>{						//fonction quand on click que la sprite
			camera.position.x = sprite.cameraPosX;
			camera.position.y = sprite.cameraPosY;
			camera.position.z = sprite.cameraPosZ;
			document.getElementById("tooltipName").innerHTML = cube.sprite.name; //affiche sur le web le nom
			document.getElementById("tooltipInfo").innerHTML = cube.sprite.information;
			//console.log(sprite.etape)
		}
		this.scene.add(sprite);
		this.sprites.push(sprite);
		this.sprite = sprite;						// le pointeur this.sprite se fixe sur la sprite
		document.getElementById("SpriteNb").innerHTML = cube.sprites.length;
	}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	deleteSprite() // supprime une sprite.
	{
		console.log(this.sprites.length);

		if (this.sprite)
		{
			if(this.sprite.etape >= 1)
			{
				for(var i= this.sprite.etape; i<this.sprites.length;i++)
				{
					if(this.sprites[i].etape>1) {this.sprites[i].etape -= 1; }
				}
			}
			this.sprites.pop(this.sprite);
			this.scene.remove(this.sprite);
			this.sprite = null;
			document.getElementById("SpriteNb").innerHTML = cube.sprites.length;
			
		}
		
		
		console.log(this.sprites.length);
		
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
		console.log(this.positionCamera);
		camera.position.set(cube.positionsCamera[this.positionCamera].x,cube.positionsCamera[this.positionCamera].y,cube.positionsCamera[this.positionCamera].z);
	}
	EtapeChangement(valeur) //Passe d'une etape a l'autre. Appel dans index.html
	{
		this.etapeEnCours += valeur;
		if(this.etapeEnCours >= this.sprites.length){this.etapeEnCours = this.sprites.length;}//on bloque l'etape au maximum
		if(this.etapeEnCours <1){ this.etapeEnCours = 1} //on descend pas en dessous de l'etape 1 et on boucle pas sur la derniere etape
		console.log(this.etapeEnCours);
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
			console.log(this.edition)
		}
	}
	
	
}


/* FIN CLASSE Machines*/
const container = document.body; // variable qui enregesitre document.body pour faciliter l'appel
const tooltip = document.querySelector('.tooltip'); // récupérer la classe de l'élément .tooltip (css) (ref aux sprites)
const spriteCreate = document.querySelector('.spriteCreate'); // récupérer la classe de l'élément canvas (css) (ref au canvas)
var menuHautSizeHeight = document.getElementById("container-fluid"); // récupérer la classe de l'élément container-fluid (css) (ref au container-fluid)
const menuSmall = document.querySelector('.menu2'); // récupérer
menuSmall.classList.add('is-active');
menuSmall.style.height = (window.innerHeight - menuHautSizeHeight.offsetHeight)*0.8 +'px';
let spriteActive = false;
//var windowWidth = 1200;
//var windowHeight = 900;
var barreDuHaut = 205;
//var ecartWidthMenuCanvas = 220;
var ecartWidthMenuCanvas = 850;
var ecartHeightMenuCanvas = barreDuHaut;
var ratio = 1/2;
var ratioHeight = 1/2;

//var ratio=1;
var windowWidth = (window.innerWidth * ratio);
var windowHeight = ((window.innerHeight)-barreDuHaut)*ratioHeight;
////////////////RENDU//////////////////////////////////////////////////////////
const renderer = new THREE.WebGLRenderer({canvas: myCanvasElement});// Rendu
renderer.setSize( windowWidth, windowHeight);
container.appendChild(renderer.domElement);
///////////////////////////////////////////////////////////////////////////////

// Création Environnement/scene et controle
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, (windowWidth / windowHeight), 0.1, 1000);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.5;
controls.autoRotate = false;
controls.enableZoom = false;
//controls.enableZoom = false;

//controls.autoRotate = true;
camera.position.set(0, 0, 130);
controls.update();
controls.keys = {
		LEFT: 0, //left arrow
		UP: 0, // up arrow
		RIGHT: 1, // right arrow
		BOTTOM: 0 // down arrow
	}
/////// Position des boutons de déplacement de la caméra //////////////////////
const btnCameraFaceCube = document.querySelector('.btnPositionduCube'); 
btnCameraFaceCube.style.top = ecartHeightMenuCanvas + windowHeight +'px';
btnCameraFaceCube.style.right = windowWidth/2 - 30 + 'px';

//btnCameraFaceCube.classList.add('is-active');


//////////////////////////////////////////////////////////////////////////////


// Création sphère
const geometrysphere = new THREE.SphereGeometry(400, 400, 400);
const textureLoader = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial({
// 	map: texture,
 	color: 0x000033,
	side: THREE.DoubleSide
})
material.transparent = true;
sphere = new THREE.Mesh(geometrysphere, material);
scene.add(sphere);


//création des cubes
let cube = new Machines();
// cube.addPoints({
	// position: new THREE.Vector3(-35, 4, -41),
	// name: 'champignon',
	// scene: cube
// })
// cube.addPoints({
	// position: new THREE.Vector3(-35, 1.7600100707070467, 2.655425784491038),
	// name: 'champignon',
	// scene: cube
// })



cube.addPoints({
	position: new THREE.Vector3(30, 10, 52),
	camera: camera.position,
	name: 'Etape numero 1',
	info : 'Ouvrir la porte, puis à laide de l outil prévu, il faut bien graisser la porte avec les éléments fournis. Ensuite, après avoir graissé les enduits. Il faut bien refermer la porte plusieurs fois afin que la graisse se répartisse bien. Ensuite il sera bon de passer a l etape suivante en cliquant sur la petite fleche de droite',
	etape : '1',
	scene : cube
});

		//var image2 = new THREE.TextureLoader().load('images/machine1/derriere.jpg');
		//var image3 = new THREE.TextureLoader().load('images/machine1/espace.jpg');
		//var image4 = new THREE.TextureLoader().load('images/machine1/espace.jpg');
		//var image5 = new THREE.TextureLoader().load('images/machine1/devant.jpg');
		//var image6 = new THREE.TextureLoader().load('images/machine1/derriere.jpg');
cube.createMachine(scene,'../../image/machine/machine1/droit.jpg','../../image/machine/machine1/derriere.jpg','../../image/machine/machine1/espace.jpg','../../image/machine/machine1/espace.jpg','../../image/machine/machine1/devant.jpg','../../image/machine/machine1/derriere.jpg');

cube.appear();


const rayCaster = new THREE.Raycaster();
onResize();

//Création texture
//const textureLoader = new THREE.TextureLoader()
//		const texture = textureLoader.load('../Images/Image5.jpg')



//Création de la sphère d'environnement/////////////////////
// var geometrySphere = new THREE.SphereGeometry(500, 500, 500)
//var materialSphere = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide } );
//var sphere = new THREE.Mesh(geometrySphere, materialSphere)
//scene.add(sphere);
//////////////////////////////////////////////////////////////

///////FONCTION AJOUT TOOLTIP///////////////////////////////////
/*
function addTooltip(point)

{
	let spriteMappy = new THREE.TextureLoader().load( "images/water3.jpg" );
	let spriteMaterial2 = new THREE.SpriteMaterial( { map: spriteMappy} );
	let sprite2 = new THREE.Sprite( spriteMaterial2 );
	sprite2.position.copy(point);
	scene.add(sprite2);
	sprite2.name = "ceciestuntest";
	/*
		console.log("Function : addToolTip(point)")
		let spriteMap = new THREE.TextureLoader().load( "images/image3.jpg" );
		let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap} );
		let sprite = new THREE.Sprite( spriteMaterial );
		sprite.name = point.name
//		let position = new THREE.Vector3(45,0,0);
//		sprite.position.copy(new THREE.Vector3(150,0,0));
		sprite.position.copy(point.position.clone().normalize().multiplyScalar(30)); //.clone permet de cloner et de ne pas toucher la variable passée par référence l'objet méthode normalize

		sprite.scale.multiplyScalar(2) // on multiplie la sprite par 2 sur tous les vecteurs
		this.scene.add(sprite);
		this.sprites.push(sprite)
		sprite.onClick = () =>{
			console.log(sprite.name)
			sprite.name ="pantoufle"
			this.scene.remove(sprite) //supprime le sprite ///////////
			this.destroy()
			point.scene.createScene(scene)
			point.scene.appear()
			
		}*/
//	}

////////////////////////////////////////////////////////////////

//AJOUT DUN TOOLTIP/////////////////////////////////////////




/*cube.addTooltip(
	new THREE.Vector3(150,0,0),
);*/
////////////////////////////////////////////////////////////




function modifValider()
{
	cube.sprite.name = document.getElementById("reName").value ;
	cube.sprite.information = document.getElementById("reInform").value ;
	cube.sprite.etape = document.getElementById("reEtape").value ;
}

function onClick(e)
{
	let mouse = new THREE.Vector2(
		( (e.clientX-ecartWidthMenuCanvas) / windowWidth ) * 2 - 1,
		- ( (e.clientY-ecartHeightMenuCanvas) / windowHeight ) * 2 + 1
	);

	rayCaster.setFromCamera(mouse, camera);

	let intersects = rayCaster.intersectObjects(scene.children); // Regarde ce qui rencontre les "enfants" de la scène: tooltip, sphère...
	//console.log( intersects[0].point)

	if (cube.edition == 0) // si edition=0 alors on affiche le sprite
	{
		///////AFFICHE LES POSITIONS DE LA CAMERA////////////////
		document.getElementById("posCamX").value = camera.position.x;
		document.getElementById("posCamY").value = camera.position.y;
		document.getElementById("posCamZ").value = camera.position.z;		
		/////////////////////////////////////////////////////////
		
		console.log("edition en mode 0");
		
		//document.getElementById("btnSprite").src = "http://127.0.0.1:8000/image/machine/ampoulerouge.png";
		cube.createSprite = 'stop';
		intersects.forEach(function(intersect){
			//console.log(intersect.object.material[0].map.image.currentSrc);
			
			//console.log(intersect.object.material[0].name);
			// if(intersect.object.material.name == "")
			// {
				// console.log("c'est nickel !");
			// }
			//console.log(intersect.object.material.face);
			if(intersect.object.type === 'Sprite')
			{
				//let p = intersect.object.position.clone().project(camera) // Je récupère la position du sprite et je la projette sur la caméra.
				//c'est la position x et y qui nous intéresse
	
				cube.sprite = intersect.object;
				//console.log(cube.sprite.information);
				document.getElementById("tooltipName").innerHTML = cube.sprite.name; 
				document.getElementById("tooltipInfo").innerHTML = cube.sprite.information;
				document.getElementById("reName").value = cube.sprite.name; 
				document.getElementById("reInform").value = cube.sprite.information; 
				document.getElementById("reEtape").value = cube.sprite.etape; 
				//cube.sprite.translateX(10);
				

			}

		})

	}
	//si edition = 1 et image = verte, on pose un sprite
	else if (cube.createSprite == 'start') //if (document.getElementById("btnSprite").src == "http://127.0.0.1:8000/image/machine/ampouleverte.png") 
	{
		
		console.log("edition en mode 1");
		console.log(camera.position);
		nVarNom = prompt("Name :");
		nVarInfo = prompt("Informations :");
		nVarEtape = prompt("Etape :");
		// nVarInformation = prompt("Informations:");
		// let spriteMappy = new THREE.TextureLoader().load( "images/ampoule.png" );
		// let spriteMaterial2 = new THREE.SpriteMaterial( { map: spriteMappy} );
		// let sprite2 = new THREE.Sprite( spriteMaterial2 );
		// sprite2.position.copy(intersects[0].point)
		cube.addPoints({
			position: intersects[0].point,
			camera: camera.position,
			name: nVarNom,
			info : nVarInfo,
			etape : nVarEtape,
			scene : cube
		});
		cube.addTooltip(cube.points[cube.points.length-1]);
		// if(sprite2.position.x <= 50.009 && sprite2.position.x >= 49.899) {sprite2.position.x += i}
		// if(sprite2.position.x >= -50.009 && sprite2.position.x <= -49.899) {sprite2.position.x -= i}
		// if(sprite2.position.y <= 50.009 && sprite2.position.y >= 49.899) {sprite2.position.y += i}
		// if(sprite2.position.y >= -50.009 && sprite2.position.y <= -49.899) {sprite2.position.y -= i}
		// if(sprite2.position.z <= 50.009 && sprite2.position.z >= 49.899) {sprite2.position.z += i}
		// if(sprite2.position.z >= -50.009 && sprite2.position.z <= -49.899) {sprite2.position.z -= i}
		
		if(cube.sprites[cube.sprites.length-1].position.x <= (intersects[0].object.geometry.parameters.width/2 +0.09) && cube.sprites[cube.sprites.length-1].position.x >= (intersects[0].object.geometry.parameters.width/2 - 0.101)) { cube.sprites[cube.sprites.length-1].position.x += cube.initEcartTooltip;}
		if(cube.sprites[cube.sprites.length-1].position.x >= -(intersects[0].object.geometry.parameters.width/2 +0.09) && cube.sprites[cube.sprites.length-1].position.x <= -(intersects[0].object.geometry.parameters.width/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.x -= cube.initEcartTooltip;}
		if(cube.sprites[cube.sprites.length-1].position.y <= (intersects[0].object.geometry.parameters.height/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.y >= (intersects[0].object.geometry.parameters.height/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.y += cube.initEcartTooltip;}
		if(cube.sprites[cube.sprites.length-1].position.y >= -(intersects[0].object.geometry.parameters.height/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.y <= -(intersects[0].object.geometry.parameters.height/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.y -= cube.initEcartTooltip;}
		if(cube.sprites[cube.sprites.length-1].position.z <= (intersects[0].object.geometry.parameters.depth/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.z >= (intersects[0].object.geometry.parameters.depth/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.z += cube.initEcartTooltip;}
		if(cube.sprites[cube.sprites.length-1].position.z >= -(intersects[0].object.geometry.parameters.depth/2 + 0.09) && cube.sprites[cube.sprites.length-1].position.z <= -(intersects[0].object.geometry.parameters.depth/2 - 0.101)) {cube.sprites[cube.sprites.length-1].position.z -= cube.initEcartTooltip;}
		console.log(cube.sprites[cube.sprites.length-1].name);
		// if(intersects[0].object.material[0].name == "droite")	{sprite2.position.x += 6}
		// if(intersects[0].object.material[0].name == "gauche")	{sprite2.position.x -= 6}
		// if(intersects[0].object.material[0].name == "haut")		{sprite2.position.y += 6}
		// if(intersects[0].object.material[0].name == "bas")		{sprite2.position.y -= 6}
		// if(intersects[0].object.material[0].name == "devant")	{sprite2.position.z += 6}
		// if(intersects[0].object.material[0].name == "derriere")	{sprite2.position.z -= 6}
		//sprite2.position.copy(intersects[0].point.clone().normalize().multiplyScalar(50));
		//scene.add(sprite2);
		
		
		// sprite2.scale.multiplyScalar(5) // aggrandit la taille du sprite
		// sprite2.name = nVarNom;
		// cube.saveSprites(sprite2,nVarInfo, nVarEtape,camera)
		cube.ToggleSprite();
	}
	else //sinon l'image passe verte car édition == 1
	{
		cube.createSprite = 'start'
		//document.getElementById("btnSprite").src = "http://127.0.0.1:8000/image/machine/ampouleverte.png";
	}
	
	intersects.forEach(function(intersect){
		if(intersect.object.type === 'Sprite')
		{
			//console.log("sprite :"+intersect.object.name)
			intersect.object.onClick();				
		}
	
		else
		{
			//console.log("pas sprite :"+intersect.object.name)
		}
		if(intersect.object.name === 'machine')
		{
			//console.log("bordure :" )
			//console.log(intersect.point)
			
		}
	})
/////////////////////////////////////////////////////////////////////////////////	
}		

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////ON RESIZE  //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function onResize()
{
	//renderer.setSize(windowWidth, windowHeight)
	//camera.aspect = windowWidth / windowHeight;
	//console.log(window.innerWidth);
	console.log("function OnRESIZE()");
	if(window.innerWidth > 768)
	{
		console.log("mode Ordi");
		ecartWidthMenuCanvas = window.innerWidth - renderer.context.drawingBufferWidth; //Récupère la position en X où commence le modele 3D
		ecartHeightMenuCanvas = menuHautSizeHeight.offsetHeight; // Récupère la hauteur du menu d'en haut. Le modele 3D est juste en dessous
		
		ratio = 1/3;
		windowWidth = window.innerWidth*ratio;
		windowHeight = (window.innerHeight  - ecartHeightMenuCanvas) * ratioHeight; 
		
		///////PLACEMENT DES BOUTONS DE NAVIGATIONS ////////////////////////////////////
		btnCameraFaceCube.style.top = ecartHeightMenuCanvas + windowHeight +'px';
		btnCameraFaceCube.style.right = windowWidth/2 - 30 + 'px';
		////////////////////////////////////////////////////////////////////////////////
		menuSmall.classList.add('is-active'); // Place le menu a gauche

//		renderer.setSize(window.innerWidth*ratio, windowHeight);
//		camera.aspect = window.innerWidth*ratio / windowHeight;
		renderer.setSize(windowWidth, windowHeight);//Redimensionne le modele 3D en prenant la page - la barre du haut * le ratio de 1/3
		camera.aspect = windowWidth / windowHeight;
		
		//////RAPPEL CAR BUG QUAND ON PASSE DE FENETRE A PLEIN ECRAN ///////////////////////////////////////////////////////////////////////////////
		ecartWidthMenuCanvas = window.innerWidth - renderer.context.drawingBufferWidth; //Récupère la position en X où commence le modele 3D
		ecartHeightMenuCanvas = menuHautSizeHeight.offsetHeight; // Récupère la hauteur du menu d'en haut. Le modele 3D est juste en dessous
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		menuSmall.style.height = (window.innerHeight - menuHautSizeHeight.offsetHeight) +'px';
		
	}
	else	// Mode telephone
	{
		console.log("mode telephone");
		menuSmall.classList.remove('is-active'); // place le menu d'affichage au dessus
		

		//menuSmall.style.top = ((-1*p.y + 1) * windowHeight/2) + 'px';
		//menuSmall.style.left = (p.x+1)* windowWidth/2 + 'px';
		//////RAPPEL CAR BUG QUAND ON PASSE DE FENETRE A PLEIN ECRAN ///////////////////////////////////////////////////////////////////////////////
		ecartWidthMenuCanvas = 0 ;//Récupère la position en X où commence le modele 3D
		ecartHeightMenuCanvas = window.innerHeight - renderer.context.drawingBufferHeight; // Récupère la hauteur du menu d'en haut. Le modele 3D est juste en dessous
		
		//ecartHeightMenuCanvas = window.innerHeight - renderer.context.drawingBufferHeight; // Récupère la hauteur du menu d'en haut. Le modele 3D est juste en dessous
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		windowWidth = window.innerWidth;
		//if(windowHeight < 0 ){windowHeight *= -1;}
		//windowHeight = window.innerHeight - renderer.context.drawingBufferHeight;
		windowHeight = 300;
		renderer.setSize(window.innerWidth, windowHeight);
		camera.aspect = window.innerWidth / (windowHeight);
		menuSmall.style.height = (window.innerHeight - 306) +'px';
	}
	//////// Affichage du menu ////////////////////////////////

	///////////////////////////////////////////////////////////
	console.log("menuHautSizeHeight.offsetHeight");console.log(menuHautSizeHeight.offsetHeight);

	camera.updateProjectionMatrix();

}
//////


var animate = function () {
	requestAnimationFrame( animate );
	controls.update();


	
	var dist = Math.sqrt((camera.position.z)*(camera.position.z)
		+(camera.position.y)*(camera.position.y)
		+(camera.position.x)*(camera.position.x));
	var limit = Math.sqrt(500*500);
	if(dist>=limit)
	{
		
		console.log('hors limite');
		console.log('position x:'+camera.position.x);
		console.log('position y:'+camera.position.y);
		console.log('position z:'+camera.position.z);
		camera.position.x = 50;
		camera.position.y = 50;
		camera.position.z = 50;
	}
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////              ON MOUSE MOVE     /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function onMouseMove(e)
{
	
//ecartHeightMenuCanvas = renderer.context.drawingBufferHeight;
//console.log(ecartHeightMenuCanvas);
//	console.log("ecartHeightMenuCanvas"); console.log(ecartHeightMenuCanvas)
	 console.log(e.clientY);
	

	 console.log(window.window.innerWidth);
	let mouse = new THREE.Vector2(
			( (e.clientX-ecartWidthMenuCanvas) / windowWidth ) * 2 - 1,
			- ( (e.clientY-ecartHeightMenuCanvas) / windowHeight) * 2 + 1 
		);

	//ecartHeightMenuCanvas = window.innerHeight - renderer.context.drawingBufferHeight;


	rayCaster.setFromCamera(mouse, camera);
	let foundSprite = false;
	
	let intersects = rayCaster.intersectObjects(scene.children); // Regarde ce qui rencontre les "enfants" de la scène: tooltip, sphère...
	//console.log(intersects)
	
	intersects.forEach(function(intersect){
		if(intersect.object.type === 'Sprite')
		{
			let p = intersect.object.position.clone().project(camera); // Je récupère la position du sprite et je la projette sur la caméra.
			//c'est la position x et y qui nous intéresse
			tooltip.style.top = ((-1*p.y + 1) * windowHeight/2) + ecartHeightMenuCanvas + 'px';
			tooltip.style.left = (p.x+1)* windowWidth/2  + ecartWidthMenuCanvas +'px';

			tooltip.classList.add('is-active');
			tooltip.innerHTML = intersect.object.name;
			spriteActive = intersect.object;
			foundSprite = true;
			

			TweenLite.to(intersect.object.scale, 0.5, {
				x:7,
				y:7,
				z:7
			});
		}
	})
	if(foundSprite === false && spriteActive)
	{
		tooltip.classList.remove('is-active')
		TweenLite.to(spriteActive.scale, 0.5, {
				x:5,
				y:5,
				z:5
			})
		spriteActive = false;
	}


}
//switch(event)
//{
//case 1:
//	break;
//default: break,
//}

function Keyboard(event)
{
	var speed =0.1;
	console.log(event);
	if(event.keyCode == 90) //z
	{
		cube.rotateCube('z',speed);
		//cube.rotateSprite('z',speed)
		
	}
	if(event.keyCode == 81) //q
	{
		cube.rotateCube('y',speed);	
		//cube.rotateSprite('y',speed)
	}
	if(event.keyCode == 82) //r
	{
		cube.positionReset();	
	}
	if(event.keyCode == 83) //s
	{
		console.log('s');
		console.log(renderer);
		//cube.rotateSprite('z',-speed)
	}
	if(event.keyCode == 68) //d
	{
		cube.rotateCube('y',-speed);
		//cube.rotateSprite('y',-speed)	
	}
	if(event.keyCode == 69) //e
	{
		cube.ToggleSprite();
		console.log(cube.edition);
		console.log(cube.sprites.length);
	}
	if(event.keyCode == 85) //u
	{
		console.log(menuHautSizeHeight.offsetHeight);
		//console.log(document.body.div)
	}
	if(event.keyCode == 46) //Delete btn suppr.
	{
		console.log(cube.sprite);
		cube.deleteSprite();
	}
	if(event.keyCode == 37) //console.log("fleche de gauche");
	{
		
		
	}
	if(event.keyCode == 39) //fleche de droite;
	{
		//cube.positionCamera = "hello";

		
	}
	if(event.keyCode == 80) //p
	{
		cube.EtapeChangement(-1);
		//if(++face >=4){face=0} ;
		//console.log(cube.positionsCamera[0].x)

		//camera..y = 0.5;
		
		//controls.target.set(0,0,0);
		//controls.reset();
		//camera.lookAt(cube.positionsCamera[face]);
		
		
		
		
		
		// face x: 3.140138135421474 y: 9.179542109846247 z: 196.0583993689851
		//gauche x: -176.98011217816207 y: 9.591837108778526 z: 13.61792983146334
		//droite x: 173.02780571237204 y: 11.59401626491994 z: -11.712526599355252
		//derriere x: -1.5548914464684451 y: 29.68562971681615 z: -162.406023883283

	}
	if(event.keyCode == 77) //m
	{
		//cube.EtapeChangement(1);
		console.log("sprite 3");
		console.log(cube.sprites[2]);
		console.log("sprite 4");
		console.log(cube.sprites[4]);
		//console.log("sprite 3");
		//console.log(cube.sprites[2]);
		//console.log("sprite4");
		//console.log(cube.sprites[3]);
		//console.log(cube.sprite.cameraPosZ);
		//controls.saveState();
	}
	
}
function onScreenChange()
{
	console.log("Changement de fenetre");
}

animate();
window.addEventListener('resize', onResize);
container.addEventListener('webkitfullscreenchange', onScreenChange);
container.addEventListener('click', onClick);
container.addEventListener('mousemove', onMouseMove);
container.addEventListener('keydown', Keyboard, false);





