var gl;
var points = [];
var colors = [];
var normals = [];
var tangents = [];
var texCoords = [];

var program;
//var modelMatrix;
var modelMatrixLoc;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var numVertCubeTri;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    generateTexCube();

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
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
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
    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var gBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,gBufferId);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(tangents),gl.STATIC_DRAW);

    var vTangent = gl.getAttribLocation(program, "vTangent");
    gl.vertexAttribPointer(vTangent, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTangent);

    var tBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vTexCoord);

    //var modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    //gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));

    var viewMatrix = lookAt(vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

    // 3D orthographic viewing
    var viewLength = 1.0;
    var projectionMatrix;
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
    var projectionMatrix = perspective(90, aspect, 0.1, 1000); 
    */
    var projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setLighting();
    
   // var image = document.getElementById("logo");
    setTexture();
    //var image = document.getElementById("logo");
    //setTexture(image);

   /* var image = new Image();
    image.src = "../images/logo.bmp"
    image.onload = function() {
        setTexture(image);
    }
    */

    render();
};

function setLighting() {
    var lightSrc = [0.0, 0.0, 1.0, 0.0];
    var lightAmbient = [0.2, 0.2, 0.2, 1.0];
    var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
    var lightSpecular = [1.0, 1.0, 1.0, 1.0];

    var matAmbient = [1.0, 1.0, 1.0, 1.0];
    var matDiffuse = [1.0, 1.0, 1.0, 1.0];
    var matSpecular = [1.0, 1.0, 1.0, 1.0];
    
    var ambientProduct = mult(lightAmbient, matAmbient);
    var diffuseProduct = mult(lightDiffuse, matDiffuse);
    var specularProduct = mult(lightSpecular, matSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "lightSrc"), lightSrc);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), specularProduct);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), 100.0);
    gl.uniform3f(gl.getUniformLocation(program, "eyePos"), 0, 0, 1);
}

function setTexture() {
    var image0 = new Image();
    image0.src = "../images/brick_color.bmp"

    var texture0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); //NEARST는 계단현상 일어남
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //LINEAR, NEARST 빈칸 넣기 
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    var image1 = new Image();
    image1.src = "../images/brick_normal.bmp"

    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); //NEARST는 계단현상 일어남
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //LINEAR, NEARST 빈칸 넣기 

    gl.uniform1i(gl.getUniformLocation(program, "bump"), 1);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(trballMatrix));
    
    gl.drawArrays(gl.TRIANGLES, 0 , numVertCubeTri);

    requestAnimationFrame(render);
}

function generateTexCube() {
    numVertCubeTri = 0;
    texQuad(1, 0, 3, 2);
    texQuad(2, 3, 7, 6);
    texQuad(3, 0, 4, 7);
    texQuad(4, 5, 6, 7);
    texQuad(5, 4, 0, 1);
    texQuad(6, 5, 1, 2);
}

function texQuad(a, b, c, d) {
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
        vec4( 0.57735, -0.57735, -0.57735, 0.0),
        vec4( 0.57735,  0.57735, -0.57735, 0.0),
        vec4(-0.57735,  0.57735, -0.57735, 0.0),
        vec4(-0.57735, -0.57735,  0.57735, 0.0),
        vec4( 0.57735, -0.57735,  0.57735, 0.0),
        vec4( 0.57735,  0.57735,  0.57735, 0.0),
        vec4(-0.57735,  0.57735,  0.57735, 0.0)
    ];

    vertexTangent = [
        vec4(0.7071, -0.7071, 0.0),
        vec4(0.7071, 0.7071,  0.0),
        vec4(-0.7071, 0.7071, 0.0),
        vec4(-0.7071, -0.7071, 0.0),
        vec4(0.7071, -0.7071,  0.0),
        vec4(0.7071, 0.7071,  0.0),
        vec4(-0.7071, 0.7071,  0.0),
        vec4(-0.7071, -0.7071, 0.0)
    ];

    var texCoord = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];

    // two triangles: (a, b, c) and (a, c, d)
    // solid colored faces
    points.push(vertexPos[a]);
    colors.push(vertexColor[a]);
    normals.push(vertexNormals[a]);
    tangents.push(vertexTangent[a]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[b]);
    colors.push(vertexColor[a]);
    normals.push(vertexNormals[b]);
    tangents.push(vertexTangent[b]);
    texCoords.push(texCoord[1]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    colors.push(vertexColor[a]);
    normals.push(vertexNormals[c]);
    tangents.push(vertexTangent[c]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[a]);
    colors.push(vertexColor[a]);
    normals.push(vertexNormals[a]);
    tangents.push(vertexTangent[a]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    colors.push(vertexColor[a]);
    normals.push(vertexNormals[c]);
    tangents.push(vertexTangent[c]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[d]);
    colors.push(vertexColor[a]);
    normals.push(vertexNormals[d]);
    tangents.push(vertexTangent[d]);
    texCoords.push(texCoord[3]);
    numVertCubeTri++;
}