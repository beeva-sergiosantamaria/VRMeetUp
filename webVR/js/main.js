
WEBVR.checkAvailability().catch( function( message ) {

	document.body.appendChild( WEBVR.getMessageContainer( message ) );

} );

var clock = new THREE.Clock();

var container;
var camera, scene, raycaster, renderer;

var room;

var INTERSECTED;
var crosshair;

init();
animate();

function init() {

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	renderer.vr.enabled = true;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
	camera.layers.enable( 1 );
	scene.add( camera );

	WEBVR.getVRDisplay( function ( display ) {

		renderer.vr.setDevice( display );

		document.body.appendChild( WEBVR.getButton( display, renderer.domElement ) );

	} );

	crosshair = new THREE.Mesh(
		new THREE.RingGeometry( 0.02, 0.04, 32 ),
		new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			opacity: 0.5,
			transparent: true
		} )
	);
	crosshair.position.z = - 2;
	camera.add( crosshair );

	room = new THREE.Mesh(
		new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
		new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
	);
	scene.add( room );

	scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );

	raycaster = new THREE.Raycaster();

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	renderer.animate( render );

}

function render() {

	var delta = clock.getDelta() * 60;

	// find intersections

	raycaster.setFromCamera( { x: 0, y: 0 }, camera );

	var intersects = raycaster.intersectObjects( room.children );

	if ( intersects.length > 0 ) {

		if ( INTERSECTED != intersects[ 0 ].object ) {

			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );

		}

	} else {

		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

		INTERSECTED = undefined;

	}

	renderer.render( scene, camera );

}