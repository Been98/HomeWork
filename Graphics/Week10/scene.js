var gl;
var points = [];
var normals = [];

var theta = 0;

var modelMatrix, modelMatrixLoc;
var lightingLoc, diffuseProductLoc;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var numVertCubeTri, numVertPyraTri, numVertGroundTri, numVertGroundLine;

var lightSrc = [0.0, 3.0, 0.0, 0.0];
var lightSrcLoc;

var lightingMode = 0; // 0directional, 1:point,  2:spotlight

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available!");
    }

    generateCube();
    generateHexaPyramid();
    generateGround(10);

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
    var nBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));

    var viewMatrix = lookAt(vec3(0, 3, 3), vec3(0, 0, 0), vec3(0, 1, 0));
    var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

    /*
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
    */

    // 3D perspective viewing
    var aspect = canvas.width / canvas.height;
    projectionMatrix = perspective(90, aspect, 0.1, 1000);

    var projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    lightingLoc = gl.getUniformLocation(program, "lightingMode");
    gl.uniform1i(lightingLoc, lightingMode);

    // Event listeners for buttons
    document.getElementById("change").onclick = function () {
        if (document.getElementById("directional").checked)
            lightingMode = 0;
        else if (document.getElementById("point").checked)
            lightingMode = 1;
        else
            lightingMode = 2;

        gl.uniform1i(lightingLoc, lightingMode);
    };

    setLighting(program);

    render();
};

function setLighting(program) {
    //var lightSrc = [0.0, 1.0, 0.0, 0.0];
    var lightAmbient = [0.0, 0.0, 0.0, 1.0];
    var lightDiffuse = [1.0, 1.0, 1.0, 1.0]; 
    var lightSpecular = [1.0, 1.0, 1.0, 1.0];

    var matAmbient = [1.0, 1.0, 1.0, 1.0];
    var matDiffuse = [1.0, 1.0, 1.0, 1.0];
    var matSpecular = [1.0, 1.0, 1.0, 1.0];

    var ambientProduct = mult(lightAmbient, matAmbient);
    var diffuseProduct = mult(lightDiffuse, matDiffuse);
    var specularProduct = mult(lightSpecular, matSpecular);

    lightSrcLoc = gl.getUniformLocation(program, "lightSrc");
    gl.uniform4fv(lightSrcLoc, lightSrc);
    gl.uniform3f(gl.getUniformLocation(program, "kAtten"), 0.2, 0.1, 0.0);
    gl.uniform3f(gl.getUniformLocation(program, "spotDir"), 0.0, -1.0, 0.0);
    gl.uniform1f(gl.getUniformLocation(program, "spotExp"), 5.0);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), ambientProduct);
    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    gl.uniform4fv(diffuseProductLoc, diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), specularProduct);

    gl.uniform1f(gl.getUniformLocation(program, "matShininess"), 100.0);
    gl.uniform3f(gl.getUniformLocation(program, "eyePos"), 0, 3, 3);
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta += 2.0;
    if (theta > 360)
        theta -= 360;
    var angle = theta * Math.PI / 180.0;
    lightSrc[0] = 3.0 * Math.sin(angle);
    lightSrc[2] = 3.0 * Math.cos(angle) - 3.0;
    gl.uniform4fv(lightSrcLoc, lightSrc);

    for (var z = -5; z < 0; z += 2) {
        // draw a cube
        gl.uniform4f(diffuseProductLoc, 1.0, 0.0, 0.0, 1.0); // red

        var rMatrix = mult(rotateY(theta), rotateZ(45));
        modelMatrix = mult(translate(-3, 1.3, z), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix,);
        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, 0, numVertCubeTri);

        modelMatrix = mult(translate(3, 1.3, z), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix,);
        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, 0, numVertCubeTri);

        // draw a hexa-pyramid
        gl.uniform4f(diffuseProductLoc, 0.0, 0.0, 1.0, 1.0); // blue

        modelMatrix = mult(translate(-3, -0.5, z), rotateZ(180));
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, numVertCubeTri, numVertPyraTri);

        modelMatrix = mult(translate(3, -0.5, z), rotateZ(180));
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, numVertCubeTri, numVertPyraTri);
    }

    // draw the ground
    gl.uniform4f(diffuseProductLoc, 0.8, 0.8, 0.8, 1.0); // gray

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(trballMatrix));
    gl.drawArrays(gl.TRIANGLES, numVertCubeTri + numVertPyraTri, numVertGroundTri);
    gl.drawArrays(gl.LINES, numVertCubeTri + numVertPyraTri + numVertGroundTri, numVertGroundLine);

    window.requestAnimationFrame(render);
}

function generateCube() {
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
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0)
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
    ]

    // two triangles: (a, b, c) and (a, c, d)
    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    numVertCubeTri++;
    points.push(vertexPos[b]);
    normals.push(vertexNormals[b]);
    numVertCubeTri++;
    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    numVertCubeTri++;

    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    numVertCubeTri++;
    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    numVertCubeTri++;
    points.push(vertexPos[d]);
    normals.push(vertexNormals[d]);
    numVertCubeTri++;
}

function generateGround(scale) {
    numVertGroundTri = 0;
    for (var x = -scale; x < scale; x++) {
        for (var z = -scale; z < scale; z++) {
            // two triangles
            points.push(vec4(x, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            numVertGroundTri++;
            points.push(vec4(x, -1.0, z + 1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            numVertGroundTri++;
            points.push(vec4(x + 1, -1.0, z + 1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            numVertGroundTri++;

            points.push(vec4(x, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            numVertGroundTri++;
            points.push(vec4(x + 1, -1.0, z + 1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            numVertGroundTri++;
            points.push(vec4(x + 1, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            numVertGroundTri++;

        }
    }
    numVertGroundLine = 0;
    // grid lines
    for (var x = -scale; x <= scale; x++) {
        points.push(vec4(x, -1.0, -scale, 1.0));
        normals.push(vec4(0.0, 0.0, 0.0, 0.0));
        numVertGroundLine++;
        points.push(vec4(x, -1.0, scale, 1.0));
        normals.push(vec4(0.0, 0.0, 0.0, 0.0));
        numVertGroundLine++;
    }
    for (var z = -scale; z <= scale; z++) {
        points.push(vec4(-scale, -1.0, z, 1.0));
        normals.push(vec4(0.0, 0.0, 0.0, 0.0));
        numVertGroundLine++;
        points.push(vec4(scale, -1.0, z, 1.0));
        normals.push(vec4(0.0, 0.0, 0.0, 0.0));
        numVertGroundLine++;
    }
}

function generateHexaPyramid() {
    const vertexPos = [
        vec4(0.0, 0.5, 0.0, 1.0),
        vec4(1.0, 0.5, 0.0, 1.0),
        vec4(0.5, 0.5, -0.866, 1.0),
        vec4(-0.5, 0.5, -0.866, 1.0),
        vec4(-1.0, 0.5, 0.0, 1.0),
        vec4(-0.5, 0.5, 0.866, 1.0),
        vec4(0.5, 0.5, 0.866, 1.0),
        vec4(0.0, -1.0, 0.0, 1.0)
    ];

    const vertexNormals = [
        vec4(0.0, 1.5, 0.0, 0.0),
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.5, 0.0, -0.866, 0.0),
        vec4(-0.5, 0.0, -0.866, 0.0),
        vec4(-1.0, 0.0, 0.0, 0.0),
        vec4(-0.5, 0.0, 0.866, 0.0),
        vec4(0.5, 0.0, 0.866, 0.0),
        vec4(0.0, -1.0, 0.0, 0.0)
    ];

    numVertPyraTri = 0;
    for (var i = 1; i < 6; i++) {
        points.push(vertexPos[0]);
        normals.push(vertexNormals[0]);
        numVertPyraTri++;
        points.push(vertexPos[i]);
        normals.push(vertexNormals[0]);
        numVertPyraTri++;
        points.push(vertexPos[i + 1]);
        normals.push(vertexNormals[0]);
        numVertPyraTri++;

        points.push(vertexPos[7]);
        normals.push(vertexNormals[7]);
        numVertPyraTri++;
        points.push(vertexPos[i + 1]);
        normals.push(vertexNormals[i + 1]);
        numVertPyraTri++;
        points.push(vertexPos[i]);
        normals.push(vertexNormals[i]);
        numVertPyraTri++;
    }
    points.push(vertexPos[0]);
    normals.push(vertexNormals[0]);
    numVertPyraTri++;
    points.push(vertexPos[6]);
    normals.push(vertexNormals[0]);
    numVertPyraTri++;
    points.push(vertexPos[1]);
    normals.push(vertexNormals[0]);
    numVertPyraTri++;

    points.push(vertexPos[7]);
    normals.push(vertexNormals[7]);
    numVertPyraTri++;
    points.push(vertexPos[1]);
    normals.push(vertexNormals[1]);
    numVertPyraTri++;
    points.push(vertexPos[6]);
    normals.push(vertexNormals[6]);
    numVertPyraTri++;
}