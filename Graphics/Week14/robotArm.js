var gl;
var points = [];
var colors = [];

var modelMatrixLoc;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var vertCubeStart, numVertCubeTri, vertGroundStart, numVertGroundTri, numVertGroundLine;

// Parameters controlling the size of the Robot's arm
const BASE_HEIGHT      = 1.0;
const BASE_WIDTH       = 5.0;
const LOWER_ARM_HEIGHT = 5.0;
const LOWER_ARM_WIDTH  = 0.5;
const UPPER_ARM_HEIGHT = 5.0;
const UPPER_ARM_WIDTH  = 0.5;

// Array of rotation angles (in degrees) for each rotation axis
const Base = 0;
const LowerArm = 1;
const UpperArm = 2;

var theta= [0, 0, 0];

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    generateGround(10);
    generateCube();
    
    // virtual trackball
    var trball = trackball(canvas.width, canvas.height);
    var mouseDown = false;

    canvas.addEventListener("mousedown", function (event) {
        trball.start(event.clientX, event.clientY);
        mouseDown = true;
    });

    canvas.addEventListener("mouseup", function (event) {
        mouseDown = false;
    });

    canvas.addEventListener("mousemove", function (event) {
        if (mouseDown) {
            trball.end(event.clientX, event.clientY);
            trballMatrix = mat4(trball.rotationMatrix);
        }
    });

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.01, 1);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    // Create a buffer object, initialize it, and associate it with 
    // the associated attribute variable in our vertex shader
    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));

    var viewMatrix = lookAt(vec3(0.0, 3.0, 10.0), vec3(0.0, 3.0, 0.0), vec3(0.0, 1.0, 0.0));
    var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
    /*
    // 3D orthographic viewing
    var viewLength = 2.0;
    var projectionMatrix;
    if (canvas.width > canvas.height) {
        var aspect = viewLength * canvas.width / canvas.height;
        projectionMatrix = ortho(-aspect, aspect, -viewLength, viewLength, -viewLength, 1000);
    }
    else {
        var aspect = viewLength * canvas.height / canvas.width;
        projectionMatrix = ortho(-viewLength, viewLength, -aspect, aspect, -viewLength, 1000);
    }
    */
    // 3D perspective viewing
    var aspect = canvas.width / canvas.height;
    var projectionMatrix = perspective(90, aspect, 0.1, 1000); 

    var projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Event listeners for buttons
    document.getElementById("left").onclick = function () {
        theta[LowerArm] += 2.0;
    };
    document.getElementById("right").onclick = function () {
        theta[LowerArm] -= 2.0;
    };
    document.getElementById("up").onclick = function () {
        theta[UpperArm] += 2.0;
    };
    document.getElementById("down").onclick = function () {
        theta[UpperArm] -= 2.0;
    };

    render();
};

window.onkeydown = function(event) {
    switch (event.keyCode) {
        case 65:    // 'A'
        case 97:    // 'a'
            theta[Base] -= 2.0;
            break;
        case 68:    // 'D'
        case 100:   // 'd'
            theta[Base] += 2.0;
            break;
        case 37:    // left arrow
            theta[LowerArm] += 2.0;
            break;
        case 39:    // right arrow
            theta[LowerArm] -= 2.0;
            break;
        case 38:    // up arrow
            theta[UpperArm] += 2.0;
            break;
        case 40:    // down arrow
            theta[UpperArm] -= 2.0;
            break;
        case 87:    // 'W'
        case 119:   // 'w'
            
            break;
        case 83:    // 'S'
        case 115:   // 's'
            
            break;
    }
    render();
};

var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

    // draw the ground
    ground(modelMatrix);
    //gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);
    //gl.drawArrays(gl.LINES, vertGroundStart+numVertGroundTri, numVertGroundLine);

    // draw a cube
    //gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    modelMatrix = mult(modelMatrix, rotate(theta[Base], 0, 1, 0));
    base(modelMatrix);

    modelMatrix = mult(modelMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelMatrix = mult(modelMatrix, rotate(theta[LowerArm], 0, 0, 1));
    lowerArm(modelMatrix);
    
    modelMatrix = mult(modelMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelMatrix = mult(modelMatrix, rotate(theta[UpperArm], 0, 0, 1));
    upperArm(modelMatrix);

    window.requestAnimationFrame(render);
}
function ground(modelMatrix) {
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);
    gl.drawArrays(gl.LINES, vertGroundStart+numVertGroundTri, numVertGroundLine);
}

function base(modelMatrix) {
    var sMatrix = scalem(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var tMatrix = mult(translate(0.0, 0.5 * BASE_HEIGHT, 0.0), sMatrix);
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
}

function lowerArm(modelMatrix) {
    var sMatrix = scalem(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var tMatrix = mult(translate(0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0), sMatrix);
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
}

function upperArm(modelMatrix) {
    var sMatrix = scalem(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var tMatrix = mult(translate(0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0), sMatrix);
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
}

function generateCube() {
    vertCubeStart = points.length;
    numVertCubeTri = 0;
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1, 2);
}

function quad(a, b, c, d) {
    vertexPos = [
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0)
    ];

    vertexColor = [
        vec4(0.0, 0.0, 0.0, 1.0),   // black
        vec4(1.0, 0.0, 0.0, 1.0),   // red
        vec4(1.0, 1.0, 0.0, 1.0),   // yellow
        vec4(0.0, 1.0, 0.0, 1.0),   // green
        vec4(0.0, 0.0, 1.0, 1.0),   // blue
        vec4(1.0, 0.0, 1.0, 1.0),   // magenta
        vec4(1.0, 1.0, 1.0, 1.0),   // white
        vec4(0.0, 1.0, 1.0, 1.0)    // cyan
    ];

    // We need to partition the quad into two triangles in order for WebGL
    // to be able to render it. In this case, we create two triangles from
    // the quad indices. 
    var index = [ a, b, c, a, c, d ];
    for(var i=0; i<index.length; i++) {
        points.push(vertexPos[index[i]]);
        colors.push(vertexColor[a]);
        //colors.push(vertexColor[index[i]]);
        numVertCubeTri++;
    }
}



edgeWall(groundScale);
generateTexGround(groundScale);
for (var i = 0; i < points.length; i++) {
    colors[i] = vec4(0, 0, 0, 0);
}
hpBar();
Trap();
generateTetrahedron();
generateHexaPyramid();
generateColorCube();
initBullet();
generateAim();
    // virtual trackball




function generateGround(scale) {
    vertGroundStart = points.length;
    numVertGroundTri = 0;
    var color = vec4(0.8, 0.8, 0.8, 1.0);
    for(var x=-scale; x<scale; x++) {
        for(var z=-scale; z<scale; z++) {
            // two triangles
            points.push(vec4(x, 0.0, z, 1.0));
            colors.push(color);
            numVertGroundTri++;

            points.push(vec4(x, 0.0, z+1, 1.0));
            colors.push(color);
            numVertGroundTri++;

            points.push(vec4(x+1, 0.0, z+1, 1.0));
            colors.push(color);
            numVertGroundTri++;

            points.push(vec4(x, 0.0, z, 1.0));
            colors.push(color);
            numVertGroundTri++;

            points.push(vec4(x+1, 0.0, z+1, 1.0));
            colors.push(color);
            numVertGroundTri++;

            points.push(vec4(x+1, 0.0, z, 1.0));
            colors.push(color);
            numVertGroundTri++;
        }
    }
  
    // grid lines
    numVertGroundLine = 0;
    color = vec4(0.0, 0.0, 0.0, 1.0);
    for(var x=-scale; x<=scale; x++) {
        points.push(vec4(x, 0.0, -scale, 1.0));
        colors.push(color);
        numVertGroundLine++;

        points.push(vec4(x, 0.0, scale, 1.0));
        colors.push(color);
        numVertGroundLine++;
    }
    for(var z=-scale; z<=scale; z++) {
        points.push(vec4(-scale, 0.0, z, 1.0));
        colors.push(color);
        numVertGroundLine++;

        points.push(vec4(scale, 0.0, z, 1.0));
        colors.push(color);
        numVertGroundLine++;
    }
}
