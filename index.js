// (I) Put all your code here.
// Checks that your browser supports WebGL.
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer = null;
var scene    = null;
var camera   = null;
var earth     = null;
var soleil = null;
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

    earth.position.z = -30;
    earth.position.y = 5;
    earth.rotation.x = Math.PI / 5;
    earth.rotation.y = 30;

    // Finally, add the mesh to our scene
    scene.add( earth );

    // Add a white point light
    light = new THREE.PointLight( 0xffffff, 1.5);
    light.position.set( 0, -5 ,-30 );
    scene.add( light );

    var soleilGeometry = new THREE.SphereGeometry( 3, 32, 32 );
    var soleilMaterial = new THREE.MeshBasicMaterial( {color: 0xfff354} );
    var soleilSphere = new THREE.Mesh( soleilGeometry, soleilMaterial );
    soleilSphere.position.set( 0,-5,-30 );
    scene.add( soleilSphere );
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
}
  