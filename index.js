// (I) Put all your code here.
// Checks that your browser supports WebGL.
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer = null;
var scene    = null;
var camera   = null;
var earth     = null;
var soleil = null;
var moon = null;
var earthGroup = new THREE.Group();
var moonGroup = new THREE.Group();
var curTime  = Date.now();
var controls = null;

// This function is called whenever the document is loaded
function init() {
    // Get display canvas
    var canvas = document.getElementById("webglcanvas");
    console.log( canvas );

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas,
        antialias: true } );
    // Set the viewport size
    renderer.setSize( canvas.width, canvas.height );
    // Create a new Three.js scene
    scene = new THREE.Scene();
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height,
        1, 4000 );

    camera.position.y = 20;
    camera.position.z = 50;
    camera.lookAt(0,0,0);
    // Create a texture-mapped cube and add it to the scene
    // First, create the texture map
    var mapUrl = "images/earth_atmos_4096.jpg";
    var moonUrl = "images/moon_1024.jpg";
    var sunUrl = "images/sun_texture.jpg";
    var map    = new THREE.TextureLoader().load( mapUrl );

    // Now, create a Basic material; pass in the map
    var material = new THREE.MeshPhongMaterial({ map: map });

    // Create the cube geometry
    var geometry = new THREE.SphereGeometry(2, 50, 50);

    // And put the geometry and material together into a mesh
    earth = new THREE.Mesh(geometry, material);

    // Move the mesh back from the camera and tilt it toward the viewer
    earth.position.set(-9,-5,-30);
    earth.rotation.x = Math.PI / 5;
    earth.rotation.y = 30;

    // Finally, add the mesh to our scene


    // Add a white point light
    light = new THREE.PointLight( 0xffffff, 1.5);
    light.position.set( 0, 0 ,0 );
    scene.add( light );

    light.castShadow = true;
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;    // default
    light.shadow.camera.far = 50;

    var soleilGeometry = new THREE.SphereGeometry( 3, 32, 32 );
    var soleilMaterial =new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load( sunUrl )} );
    soleilMaterial.side = THREE.BackSide;
    soleil = new THREE.Mesh( soleilGeometry, soleilMaterial );
    soleil.position.set( 0,0,-50 );
    scene.add( soleil );

    var moonGeometry = new THREE.SphereGeometry( 1, 32, 32 );
    var moonlMaterial = new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load( moonUrl )} );
    moon = new THREE.Mesh( moonGeometry, moonlMaterial );

    moon.position.set(-9,-5,-20);
    moon.rotation.x = Math.PI / 5;
    moon.rotation.y = Math.PI / 5;



    moonGroup.add(moon);
    earthGroup.add(earth);
    earthGroup.add(moonGroup);

    moonGroup.position.set(earth.position.x,earth.position.y,earth.position.z);
    earthGroup.position.set(0,0,-50);

    scene.add(earthGroup);
    //scene.add(moon);


    controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 20;




    // Add background
    var backgroundUrl = 'images/space.jpg';
    var textureCube    = new THREE.TextureLoader().load( backgroundUrl );
    textureCube.format = THREE.RGBFormat;
    scene.background   = textureCube;


}

// This function is called regularly to update the canvas webgl.
function run() {
    // Ask to call again run
    requestAnimationFrame( run );

    // Render the scene
    render();

    // Calls the animate function if objects or camera should move
    animate();
}

// This function is called regularly to take care of the rendering.
function render() {
    // Render the scene
    renderer.render( scene, camera );
}

// This function is called regularly to update objects.
function animate() {
    // Computes how time has changed since last display
    var now       = Date.now();
    var deltaTime = now - curTime;
    curTime       = now;
    var fracTime  = deltaTime / 1000; // in seconds
    // Now we can move objects, camera, etc.
    // Example: rotation cube
    var angle = fracTime * Math.PI * 2;
    // Notez que l'axe y est l'axe "vertical" usuellement.
    earthGroup.rotation.y += angle / 10; // la terre tourne en 365 jours

    earth.rotation.y      += angle; // et en un jour sur elle-même

    moonGroup.rotation.y  += angle / 5; // la lune tourne en 28 jours autour de la terre
    moon.rotation.y       += angle /2; // et en 28 jours aussi sur elle-même pour faire face à la terre 

    //camera.lookAt( earth.matrixWorld.getPosition() );

    controls.update();

}
