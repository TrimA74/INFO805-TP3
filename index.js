// (I) Put all your code here.
// Checks that your browser supports WebGL.
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer = null;
var scene    = null;
var camera   = null;
var earth     = null;
var earthGroup = null;
var moonGroup = null;
var soleil = null;
var moon = null;
var curTime  = Date.now();

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
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 20;
    // Create a texture-mapped cube and add it to the scene
    // First, create the texture map
    var mapUrl = "images/earth_atmos_2048.jpg";
    var map    = new THREE.TextureLoader().load( mapUrl );

    // Now, create a Basic material; pass in the map
    var material = new THREE.MeshPhongMaterial({ map: map });

    // Create the cube geometry
    var geometry = new THREE.SphereGeometry(1, 50, 50);

    // And put the geometry and material together into a mesh
    earth = new THREE.Mesh(geometry, material);

    // Move the mesh back from the camera and tilt it toward the viewer

    earth.position.z = -8;
    earth.position.y = 0;
    earth.position.x = -3;
    earth.rotation.x = Math.PI / 5;
    earth.rotation.y = 30;


    // Add a white point light
    light = new THREE.PointLight( 0xffffff, 1.5);
    light.position.set( 0, 0 ,0 );

    var soleilGeometry = new THREE.SphereGeometry( 2, 32, 32 );
    var soleilMaterial = new THREE.MeshBasicMaterial( {color: 0xfff354} );soleil = new THREE.Mesh( soleilGeometry, soleilMaterial );
    soleil.position.set( 0,0,0 );


    var moonGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
    var mapMoonUrl = "images/moon_1024.jpg";
    var mapMoon    = new THREE.TextureLoader().load( mapMoonUrl );
    var moonMaterial = new THREE.MeshPhongMaterial({map: mapMoon});
    moon = new THREE.Mesh( moonGeometry, moonMaterial );
    moon.position.set( 0,0,-3 );


    earthGroup = new THREE.Group();
    earthGroup.position.set(0,0,0);
    moonGroup = new THREE.Group();
    moonGroup.position.set( -3,0,-8 );

    earthGroup.add(earth);
    moonGroup.add(moon);

    earthGroup.add(moonGroup)

    scene.add( soleil );
    scene.add( earthGroup );
    scene.add( light );
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
    var angle = 0.1 * Math.PI * 2 * fracTime; // one turn per 10 second.
    earth.rotation.y += angle;

    var angle = fracTime * Math.PI * 2;
// Notez que l'axe y est l'axe "vertical" usuellement.
    earthGroup.rotation.y += angle / 365; // la terre tourne en 365 jours
    earth.rotation.y      += angle; // et en un jour sur elle-même
    moonGroup.rotation.y  += angle / 28; // la lune tourne en 28 jours autour de la terre
    moon.rotation.y       += angle /28; // et en 28 jours aussi sur elle-même pour faire face à la terre
}
  