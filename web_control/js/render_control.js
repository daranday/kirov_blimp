window.onload=function(){
	$(function(){
		if(window.location.protocol==="https:")
			window.location.protocol="http";
	});
}


var container, stats;

var camera, scene, renderer;

var group;
var leftStick;
var rightStick;


var leftStickLength = 200;
var rightStickWidth = 150;
var rightStickHeight = 300;

var leftStickRadius = 50;
var rightStickRadius = 70;

var leftRange = leftStickLength/2 - leftStickRadius;
var rightRange = rightStickHeight/2 - rightStickRadius - 10;

var leftStickOriginX = -300;
var leftStickOriginY = 0;
var rightStickOriginX = 300;
var rightStickOriginY = 0;

var leftStickX = leftStickOriginX;
var leftStickY = leftStickOriginY;
var rightStickY = rightStickOriginY - rightRange;

var movingObject = null;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


window.onload=function(){
	init();
	animate();
}


function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 500 );
	scene.add( camera );

	var light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( light );

	group = new THREE.Group();
	group.position.y = 50;
	scene.add( group );

	function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

		// tail controller

		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
		mesh.position.set( x, y, z - 75 );
		mesh.rotation.set( rx, ry, rz );
		mesh.scale.set( s, s, s );
		group.add( mesh );
	}

	function addLeftStick(extrudeSettings) {
		// circle

		var circleRadius = leftStickRadius;
		var circleShape = new THREE.Shape();
		circleShape.moveTo( 0, circleRadius );
		circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
		circleShape.quadraticCurveTo( circleRadius, -circleRadius, 0, -circleRadius );
		circleShape.quadraticCurveTo( -circleRadius, -circleRadius, -circleRadius, 0 );
		circleShape.quadraticCurveTo( -circleRadius, circleRadius, 0, circleRadius );

		var geometry = new THREE.ExtrudeGeometry( circleShape, extrudeSettings );

		var color = 0x00f000, 
				x = leftStickOriginX, 
				y = leftStickOriginY, 
				z = 0, 
			   rx = 0, 
			   ry = 0, 
			   rz = 0, 
				s = 1;

		leftStick = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
		leftStick.position.set( x, y, z );
		leftStick.rotation.set( rx, ry, rz );
		leftStick.scale.set( s, s, s );
		scene.add( leftStick );
	}

	function addRightStick(extrudeSettings) {
		// circle

		var circleRadius = rightStickRadius;
		var circleShape = new THREE.Shape();
		circleShape.moveTo( 0, circleRadius );
		circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
		circleShape.quadraticCurveTo( circleRadius, -circleRadius, 0, -circleRadius );
		circleShape.quadraticCurveTo( -circleRadius, -circleRadius, -circleRadius, 0 );
		circleShape.quadraticCurveTo( -circleRadius, circleRadius, 0, circleRadius );

		var geometry = new THREE.ExtrudeGeometry( circleShape, extrudeSettings );

		var color = 0x00f000, 
				x = rightStickOriginX, 
				y = rightStickOriginY, 
				z = 0, 
			   rx = 0, 
			   ry = 0, 
			   rz = 0, 
				s = 1;

		rightStick = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
		rightStick.position.set( x, y, z );
		rightStick.rotation.set( rx, ry, rz );
		rightStick.scale.set( s, s, s );
		scene.add( rightStick );
	}

	function addBoundaries() {
		// Square

		var sqLength = leftStickLength;
		var squareShape = new THREE.Shape();
		squareShape.moveTo( 0,0 );
		squareShape.lineTo( 0, sqLength );
		squareShape.lineTo( sqLength, sqLength );
		squareShape.lineTo( sqLength, 0 );
		squareShape.lineTo( 0, 0 );

		// Rectangle

		var rectLength = rightStickWidth, rectWidth = rightStickHeight;
		var rectShape = new THREE.Shape();
		rectShape.moveTo( 0,0 );
		rectShape.lineTo( 0, rectWidth );
		rectShape.lineTo( rectLength, rectWidth );
		rectShape.lineTo( rectLength, 0 );
		rectShape.lineTo( 0, 0 );

		// equidistance sampled points

		function addSampledPoints(shape, color, x, y, z, rx, ry, rz, s ) {
			var spacedPoints = shape.createSpacedPointsGeometry( 50 );

			var pgeo = spacedPoints.clone();
			var particles2 = new THREE.PointCloud( pgeo, new THREE.PointCloudMaterial( { color: color, size: 4 } ) );
			particles2.position.set( x, y, z );
			particles2.rotation.set( rx, ry, rz );
			particles2.scale.set( s, s, s );
			scene.add( particles2 );
		}

		// left boundary first
		addSampledPoints(squareShape, 0x000000, leftStickOriginX - sqLength/2, -sqLength/2, 0, 0, 0, 0, 1)

		// right boundary second
		addSampledPoints(rectShape, 0x0000ff, rightStickOriginX - rectLength/2, -rectWidth/2, 0, 0, 0, 0, 1)
	}

	// extrudeSettings
	var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };


	// addShape( circleShape,      extrudeSettings, 0x00f000,  0,  0, 0, 0, 0, 0, 1 );
	addLeftStick(extrudeSettings);

	addRightStick(extrudeSettings);

	addBoundaries();


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'touchend', onDocumentTouchEnd, false );


	window.addEventListener( 'resize', onWindowResize, false );
}

function to3D(event_x, event_y) {
	var vector = new THREE.Vector3();

	vector.set(
		( event_x / window.innerWidth ) * 2 - 1,
		- ( event_y / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject( camera );

	var dir = vector.sub( camera.position ).normalize();

	var distance = - camera.position.z / dir.z;

	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
	return pos;
};


function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function startTracking(event_x, event_y) {
	var raycaster = new THREE.Raycaster(); // create once
	var mouse = new THREE.Vector2(); // create once

	mouse.x = ( event_x / renderer.domElement.width ) * 2 - 1;
	mouse.y = - ( event_y / renderer.domElement.height ) * 2 + 1;

	console.log(window.navigator)

	console.log(mouse);
	console.log(scene.children)

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( scene.children );

	console.log(intersects[0])

	if (intersects.length == 0) {
		return;
	} else {
		if (intersects[0].point.x < 0) {
			movingObject = "left";
		} else {
			movingObject = "right";
		}
	}
}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	startTracking(event.clientX, event.clientY);

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );
	// targetRotationOnMouseDown = targetRotation;

	console.log(leftStick.position)
}

function changePosition(pos) {
	if (movingObject == "left") {
		leftStickX = pos.x;
		leftStickY = pos.y;

		if (leftStickX > leftStickOriginX + leftRange)
			leftStickX = leftStickOriginX + leftRange;

		if (leftStickY > leftStickOriginY + leftRange)
			leftStickY = leftStickOriginY + leftRange;

		if (leftStickX < leftStickOriginX - leftRange)
			leftStickX = leftStickOriginX - leftRange;

		if (leftStickY < leftStickOriginY - leftRange)
			leftStickY = leftStickOriginY - leftRange;


	} else if (movingObject == "right") {
		rightStickY = pos.y;

		if (rightStickY > rightStickOriginY + rightRange)
			rightStickY = rightStickOriginY + rightRange;

		if (rightStickY < rightStickOriginY - rightRange)
			rightStickY = rightStickOriginY - rightRange;
	}
}

function onDocumentMouseMove( event ) {
	// get world coordinate
	pos = to3D(event.clientX, event.clientY);

	changePosition(pos);
}

function onDocumentMouseUp( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

	leftStickX = leftStickOriginX;
	leftStickY = leftStickOriginY;
	movingObject = null;
}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

	leftStickX = leftStickOriginX;
	leftStickY = leftStickOriginY;
	movingObject = null;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		startTracking(event.touches[ 0 ].pageX * 4, event.touches[ 0 ].pageY * 4)

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		pos = to3D(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);

		changePosition(pos);
		
	}

}

function onDocumentTouchEnd( event ) {

	event.preventDefault();

	leftStickX = leftStickOriginX;
	leftStickY = leftStickOriginY;
	movingObject = null;

}

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	// group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
	leftStick.position.x = leftStickX;
	leftStick.position.y = leftStickY;
	rightStick.position.y = rightStickY;
	renderer.render( scene, camera );

}
