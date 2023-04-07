var gl;
var points = [];
var colors = [];
var normals = [];

var axis = 0;
var theta = [0, 0, 0];
var rotation = false;

var modelMatrix, viewMatrix, projectionMatrix;
var modelMatrixLoc, viewMatrixLoc, projectionMatrixLoc;
const eye = vec3(0.0, 0.0, 1.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var numVertCubeTri;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    generateColorCube();

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
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

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

    var nBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,nBufferId);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(normals),gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal,4,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vNormal);

    modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    modelMatrixLoc = gl.getUniformLocation(program,"modelMatrix");
    gl.uniformMatrix4fv(modelMatrixLoc,false, flatten(modelMatrix));

    viewMatrix = lookAt(eye, at, up);
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

    // 3D orthographic viewing
    var viewLength = 1.0;
    if (canvas.width > canvas.height) {
        var aspect = viewLength * canvas.width / canvas.height;
        projectionMatrix = ortho(-aspect, aspect, -viewLength, viewLength, -viewLength, 1000);
    }
    else {
        var aspect = viewLength * canvas.height / canvas.width;
        projectionMatrix = ortho(-viewLength, viewLength, -aspect, aspect, -viewLength, 1000);
    }
    /*
    // 3D perspective viewing
    var aspect = canvas.width / canvas.height;
    projectionMatrix = perspective(90, aspect, 0.1, 1000); 
    */
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Event listeners for buttons
    document.getElementById("xButton").onclick = function () {
        axis = 0;
    };
    document.getElementById("yButton").onclick = function () {
        axis = 1;
    };
    document.getElementById("zButton").onclick = function () {
        axis = 2;
    };
    document.getElementById("buttonT").onclick = function () {
        rotation = !rotation;
    };
    setLighting(program);
    render();
};
function setLighting(program) {  //값에 따른 시험 
    var lightDir = [1.0, 1.0, 0.0, 0.0]; //값이 바뀔 때  알맞는 그림을 고르시어
    var lightAmbient = [1.0, 0.0, 0.0, 1.0];
    var lightDiffuse = [0.0, 1.0, 0.0, 1.0];
    var lightSpecular = [0.0, 0.0, 1.0, 1.0];

    var matAmbient = [0.2, 0.2, 0.2, 1.0];
    var matDiffuse = [1.0, 1.0, 1.0, 1.0];
    var matSpecular = [1.0, 0.0, 1.0, 1.0];
    var matShininess = 10.0; //시험 값에 따른 그ㅁ 그리기(점 인식하는 값) = 제곱으로 계산

    var lightDirLoc = gl.getUniformLocation(program,"lightDir");
    gl.uniform4fv(lightDirLoc, lightDir);

    var lightAmbientLoc = gl.getUniformLocation(program, "lightAmbient");
    gl.uniform4fv(lightAmbientLoc,lightAmbient);
    var lightDiffuseLoc = gl.getUniformLocation(program,"lightDiffuse");
    gl.uniform4fv(lightDiffuseLoc, lightDiffuse);
    var lightSpecularLoc = gl.getUniformLocation(program, "lightSpecular");
    gl.uniform4fv(lightSpecularLoc,lightSpecular);

    var matAmbientLoc = gl.getUniformLocation(program,"matAmbient");
    gl.uniform4fv(matAmbientLoc,matAmbient);
    var matDiffuseLoc = gl.getUniformLocation(program, "matDiffuse");
    gl.uniform4fv(matDiffuseLoc,matDiffuse);
    var matSpecularLoc = gl.getUniformLocation(program, "matSpecular");
    gl.uniform4fv(matSpecularLoc,matSpecular);
    var matShininessLoc = gl.getUniformLocation(program, "matShininess");
    gl.uniform1f(matShininessLoc,matShininess);
    var eyePosLoc = gl.getUniformLocation(program,"eyePos");
    gl.uniform3fv(eyePosLoc, flatten(eye));
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if( rotation )  theta[axis] += 2.0;
    var rx = rotateX(theta[0]);
    var ry = rotateY(theta[1]);
    var rz = rotateZ(theta[2]);
    modelMatrix = mult(ry,rx);
    modelMatrix = mult(rz,modelMatrix);
    modelMatrix = mult(modelMatrix, trballMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc,false,flatten(modelMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    window.requestAnimationFrame(render);
}

function generateColorCube() {
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
    vertexNormals = [
        vec4(-0.57735, -0.57735, -0.57735, 0.0),
        vec4(0.57735, -0.57735, -0.57735, 0.0),
        vec4(0.57735, 0.57735, -0.57735, 0.0),
        vec4(-0.57735, 0.57735, -0.57735, 0.0),
        vec4(-0.57735, -0.57735, 0.57735, 0.0),
        vec4(0.57735, -0.57735, 0.57735, 0.0),
        vec4(0.57735, 0.57735, 0.57735, 0.0),
        vec4(-0.57735, 0.57735, 0.57735, 0.0),
    ];

    // two triangles: (a, b, c) and (a, c, d)
    points.push(vertexPos[a]);
    colors.push(vertexColor[a]);
    normals.push(vertexNormals[a]);
    numVertCubeTri++;
    points.push(vertexPos[b]);
    colors.push(vertexColor[b]);
    normals.push(vertexNormals[b]);
    numVertCubeTri++;
    points.push(vertexPos[c]);
    colors.push(vertexColor[c]);
    normals.push(vertexNormals[c]);
    numVertCubeTri++;

    points.push(vertexPos[a]);
    colors.push(vertexColor[a]);
    normals.push(vertexNormals[a]);
    numVertCubeTri++;
    points.push(vertexPos[c]);
    colors.push(vertexColor[c]);
    normals.push(vertexNormals[c]);
    numVertCubeTri++;
    points.push(vertexPos[d]);
    colors.push(vertexColor[d]);
    normals.push(vertexNormals[d]);
    numVertCubeTri++;
}
