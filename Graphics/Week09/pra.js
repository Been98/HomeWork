


var gl;
var points = [];
var normals = [];
var texCoords = [];

var program0, program1, program2;
var modelMatrixLoc0, viewMatrixLoc0, modelMatrixLoc1, viewMatrixLoc1, modelMatrixLoc2, viewMatrixLoc2;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var vertCubeStart, numVertCubeTri, vertGroundStart, numVertGroundTri;
var vertCageStart, numVertCageTri, vertHpStart, numVertHpTri, vertTrapStart, numVertTrapTri;

var randomX, randomZ;

var eyePos = vec3(0.0, 3.0, 0.0);
var atPos = vec3(0.0, 0.0, 0.0);
var upVec = vec3(0.0, 1.0, 0.0);
var cameraVec = vec3(0.0, -0.7071, -0.7071); // 1.0/Math.sqrt(2.0)

var prevEye = vec3(0.0, 3.0, 0.0);

var theta = 0;
var prevTime = new Date();
var prevTime2 = new Date(); //이전시간 체크용

var image1 = new Image();
image1.src = "../images/cage.png"

var image0 = new Image();
image0.src = "../images/logo.bmp"


var objectPos = []; //적 충돌 좌표
var moveCount = 0;

var prevXPos = 1;
var prevZPos = -10;
var xPos = 1; //적 생성 위치 x
var zPos = -10; //적 생성 위치 z

var rot2 = 0;

var hpCount = 1;

var objectPos2 = [];

const groundScale = 30;

function detectCollision(newPosX, newPosZ) {
    if (newPosX < -groundScale || newPosX > groundScale || newPosZ < -groundScale || newPosZ > groundScale)
        return true;
    for (var index = 0; index < objectPos.length; index++) {
        if (Math.abs(newPosX - objectPos[index][0]) < 1.0 && Math.abs(newPosZ - objectPos[index][2]) < 1.0)
            return true;
    }
    return false;
};
function detectCollisionTrap(newPosX, newPosZ) {
    for (var index = 0; index < objectPos2.length; index++) {
        if (Math.abs(newPosX - objectPos2[index][0]) < 1.0 && Math.abs(newPosZ - objectPos2[index][2]) < 1.0)
            return true;
    }
    return false;
}

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available!");
    }

    edgeWall(groundScale);
    generateTexCube();
    generateTexGround(groundScale);
    hpBar();
    Trap();

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
    program0 = initShaders(gl, "colorVS", "colorFS");
    gl.useProgram(program0);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program0, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelMatrixLoc0 = gl.getUniformLocation(program0, "modelMatrix");
    viewMatrixLoc0 = gl.getUniformLocation(program0, "viewMatrix");

    // 3D perspective viewing
    var aspect = canvas.width / canvas.height;
    var projectionMatrix = perspective(90, aspect, 0.1, 1000);

    var projectionMatrixLoc = gl.getUniformLocation(program0, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));


    /////////////////////////////////////////////////////////////////////
    // program1 : phong shading

    program1 = initShaders(gl, "phongVS", "phongFS");
    gl.useProgram(program1);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    vPosition = gl.getAttribLocation(program1, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Create a buffer object, initialize it, and associate it with 
    // the associated attribute variable in our vertex shader
    var nBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program1, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    modelMatrixLoc1 = gl.getUniformLocation(program1, "modelMatrix");
    viewMatrixLoc1 = gl.getUniformLocation(program1, "viewMatrix");

    projectionMatrixLoc = gl.getUniformLocation(program1, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setLighting(program1);

    /////////////////////////////////////////////////////////////////////
    // program2 : Texture shading

    program2 = initShaders(gl, "texMapVS", "texMapFS");
    gl.useProgram(program2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    vPosition = gl.getAttribLocation(program2, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    vNormal = gl.getAttribLocation(program2, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var tBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program2, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    modelMatrixLoc2 = gl.getUniformLocation(program2, "modelMatrix");
    viewMatrixLoc2 = gl.getUniformLocation(program2, "viewMatrix");

    projectionMatrixLoc = gl.getUniformLocation(program2, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    randomX = Math.floor(Math.random() * 8 + 1);
    randomZ = Math.floor(Math.random() * 8 + 1);

    objectPos2.push(vec3(randomX, 0, randomZ));
    objectPos2.push(vec3(randomX * 2, 0, randomZ * 2));
    objectPos2.push(vec3(randomX * 3, 0, randomZ * 3));

    setLighting(program2);
    setTexture();

    // Event listeners for buttons

    render();
};

window.onkeydown = function (event) {
    var sinTheta = Math.sin(0.3);
    var cosTheta = Math.cos(0.3);
    switch (event.keyCode) {
        case 37:    // left arrow
        case 65:    // 'A'
        case 97:    // 'a'
            var newVecX = cosTheta * cameraVec[0] + sinTheta * cameraVec[2];
            var newVecZ = -sinTheta * cameraVec[0] + cosTheta * cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            break;
        case 39:    // right arrow
        case 68:    // 'D'
        case 100:   // 'd'
            var newVecX = cosTheta * cameraVec[0] - sinTheta * cameraVec[2];
            var newVecZ = sinTheta * cameraVec[0] + cosTheta * cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            break;
        case 38:    // up arrow
        case 87:    // 'W'
        case 119:   // 'w'
            var newPosX = eyePos[0] + 0.9 * cameraVec[0];
            var newPosZ = eyePos[2] + 0.9 * cameraVec[2];
            if (!detectCollision(newPosX, newPosZ)) {
                eyePos[0] = newPosX;
                eyePos[2] = newPosZ;
            }

            break;
        case 40:    // down arrow
        case 83:    // 'S'
        case 115:   // 's'
            var newPosX = eyePos[0] - 0.9 * cameraVec[0];
            var newPosZ = eyePos[2] - 0.9 * cameraVec[2];
            if (!detectCollision(newPosX, newPosZ)) {
                eyePos[0] = newPosX;
                eyePos[2] = newPosZ;
            }
            break;
    }
    render();
};

function setLighting(program) {
    var lightSrc = [0.0, 1.0, 0.0, 0.0];
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
    gl.uniform3fv(gl.getUniformLocation(program, "eyePos"), flatten(eyePos));

    gl.uniform1f(gl.getUniformLocation(program, "fogStart"), 2.0);
    gl.uniform1f(gl.getUniformLocation(program, "fogEnd"), 50.0);
    gl.uniform4f(gl.getUniformLocation(program, "fogColor"), 0.0, 0.0, 0.0, 1.0);
};

function setTexture() {

    var texture0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);



    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

    atPos[0] = eyePos[0] + cameraVec[0];
    atPos[1] = eyePos[1] + cameraVec[1] + 0.5;
    atPos[2] = eyePos[2] + cameraVec[2];
    var viewMatrix = lookAt(eyePos, atPos, upVec);
    gl.useProgram(program0);
    gl.uniformMatrix4fv(viewMatrixLoc0, false, flatten(viewMatrix));
    gl.useProgram(program1);
    gl.uniformMatrix4fv(viewMatrixLoc1, false, flatten(viewMatrix));
    gl.uniform3fv(gl.getUniformLocation(program1, "eyePos"), flatten(eyePos));
    gl.useProgram(program2);
    gl.uniformMatrix4fv(viewMatrixLoc2, false, flatten(viewMatrix));
    gl.uniform3fv(gl.getUniformLocation(program2, "eyePos"), flatten(eyePos));

    //Time
    let currTime = new Date();
    let elapsedTime = currTime.getTime() - prevTime.getTime();
    let elapsedTime2 = currTime.getTime() - prevTime2.getTime();
    theta += (elapsedTime / 10);
    prevTime = currTime;
    if (elapsedTime2 >= 210) {
        prevTime2 = currTime;
    }

    //init
    var uColorLoc = gl.getUniformLocation(program0, "uColor");
    var diffuseProductLoc = gl.getUniformLocation(program1, "diffuseProduct");
    var textureLoc = gl.getUniformLocation(program2, "texture");

    ///wall
    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 1);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(trballMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCageStart, numVertCageTri);

    modelMatrix = mult(translate(0, 0, 0), rotateY(90));
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCageStart, numVertCageTri);

    modelMatrix = mult(translate(0, 0, 0), rotateY(180));
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCageStart, numVertCageTri);

    modelMatrix = mult(translate(0, 0, 0), rotateY(270));
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCageStart, numVertCageTri);

    //ground
    gl.useProgram(program1);
    gl.uniform4f(diffuseProductLoc, 1.0, 1.0, 1.0, 1.0);
    gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(trballMatrix));
    gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);


    /////enemy pos
    objectPos = [];

    if (eyePos[0] > xPos)
        xPos = prevXPos + elapsedTime / 1000;
    else if (eyePos[0] < xPos) {
        xPos = prevXPos - elapsedTime / 1000;
    }
    else
        xPos = eyePos[0];
    if (eyePos[2] > zPos)
        zPos = prevZPos + elapsedTime / 1000;
    else if (eyePos[2] < zPos) {
        zPos = prevZPos - elapsedTime / 1000;
    }
    else
        zPos = eyePos[2];
    prevXPos = xPos;
    prevZPos = zPos;

    objectPos.push(vec3(xPos, 0, zPos)); // enemy coll

    //rotateAngle

    var prevEyeVec = normalize(vec3(prevEye[0] - xPos, 2.0, prevEye[2] - zPos));
    var eyeVec = normalize(vec3(eyePos[0] - xPos, 2.0, eyePos[2] - zPos));
    var rot = Math.acos(dot(prevEyeVec, eyeVec).toFixed(2)) * 180 / Math.PI;


    if (elapsedTime2 == 200) {

        if (prevEye[0] > eyePos[0] && zPos < eyePos[2]) {
            rot2 += rot;
        }
        else if (prevEye[0] < eyePos[0] && zPos < eyePos[2]) {
            rot2 -= rot;
        }
        else if (prevEye[0] > eyePos[0] && zPos > eyePos[2]) {
            rot2 -= rot;
        }
        else if (prevEye[0] < eyePos[0] && zPos > eyePos[2]) {
            rot2 += rot;
        }


        if (rot2 >= 360 || rot2 <= -360) {
            rot2 = 0;
        }
        prevEye[0] = eyePos[0];
        prevEye[2] = eyePos[2];
    } //수정 

    if (detectCollisionTrap(eyePos[0], eyePos[2])) {
        if (eyePos[1] < 8.0) {
            eyePos[1] += 0.1;
            console.log("@@");
        }
    }
    if (eyePos[1] > 3.0) {
        eyePos[1] -= elapsedTime / 300;
        console.log("!!!");
    }



    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 0);
    modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    modelMatrix = mult(modelMatrix, translate(xPos, 0, zPos));
    modelMatrix = mult(modelMatrix, rotateY(rot2));
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

    gl.useProgram(program0);
    gl.uniform4f(uColorLoc, 1.0, 0.0, 0.0, 1.0); // red
    modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    var sMatrix = scalem(hpCount, 1, 1); //hpCount 만큼 줄이기 
    modelMatrix = mult(modelMatrix, sMatrix);
    modelMatrix = mult(modelMatrix, translate(xPos, 0.7, zPos));
    modelMatrix = mult(modelMatrix, rotateY(rot2));
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertHpStart, numVertHpTri);

    gl.uniform4f(uColorLoc, 0.0, 0.0, 1.0, 0.2); //black
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    for (var i = 1; i < 4; i++) {
        modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        modelMatrix = mult(modelMatrix, translate(randomX * i, 0.0, randomZ * i)); //randomX, Z 값 넣기 
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertTrapStart, numVertTrapTri);

        modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        modelMatrix = mult(modelMatrix, translate(-randomX * i, 0.0, -randomZ * i)); //randomX, Z 값 넣기 
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertTrapStart, numVertTrapTri);
    }

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    window.requestAnimationFrame(render);
}

function generateTexCube() {
    vertCubeStart = points.length;
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
        vec4(-0.57735, 0.57735, 0.57735, 0.0)
    ];

    var texCoord = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];

    // two triangles: (a, b, c) and (a, c, d)
    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[b]);
    normals.push(vertexNormals[b]);
    texCoords.push(texCoord[1]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[d]);
    normals.push(vertexNormals[d]);
    texCoords.push(texCoord[3]);
    numVertCubeTri++;
}

function generateTexGround(scale) {
    vertGroundStart = points.length;
    numVertGroundTri = 0;
    points.push(vec4(-scale, -1.0, -scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    numVertGroundTri++;

    points.push(vec4(-scale, -1.0, scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    numVertGroundTri++;

    points.push(vec4(scale, -1.0, scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    numVertGroundTri++;

    points.push(vec4(-scale, -1.0, -scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    numVertGroundTri++;

    points.push(vec4(scale, -1.0, scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    numVertGroundTri++;

    points.push(vec4(scale, -1.0, -scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    numVertGroundTri++;
}
function edgeWall(scale) {
    vertCageStart = points.length;
    numVertCageTri = 0;

    points.push(vec4(scale, 10, -scale, 1.0));
    normals.push(vec4(0.0, 0.0, 1.0, 0.0));
    texCoords.push(vec2(0, 0));
    numVertCageTri++;

    points.push(vec4(scale, -1, -scale, 1.0));
    normals.push(vec4(0.0, 0.0, 1.0, 0.0));
    texCoords.push(vec2(0, 1));
    numVertCageTri++;

    points.push(vec4(-scale, -1, -scale, 1.0));
    normals.push(vec4(0.0, 0.0, 1.0, 0.0));
    texCoords.push(vec2(1, 1));
    numVertCageTri++;

    points.push(vec4(scale, 10, -scale, 1.0));
    normals.push(vec4(0.0, 0.0, 1.0, 0.0));
    texCoords.push(vec2(0, 0));
    numVertCageTri++;

    points.push(vec4(-scale, -1, -scale, 1.0));
    normals.push(vec4(0.0, 0.0, 1.0, 0.0));
    texCoords.push(vec2(1, 1));
    numVertCageTri++;

    points.push(vec4(-scale, 10, -scale, 1.0));
    normals.push(vec4(0.0, 0.0, 1.0, 0.0));
    texCoords.push(vec2(1, 0));
    numVertCageTri++;
}

function hpBar() {
    vertHpStart = points.length;
    numVertHpTri = 0;

    points.push(vec4(0.5, 0.5, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(-0.5, 0.5, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(-0.5, 0.4, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(0.5, 0.5, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(-0.5, 0.4, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(0.5, 0.4, 0.0, 1.0));
    numVertHpTri++;

}
function Trap() {
    vertTrapStart = points.length;
    numVertTrapTri = 0;

    points.push(vec4(-0.5, -1.0, -0.5, 1.0));
    numVertTrapTri++;
    points.push(vec4(-0.5, -1.0, 0.5, 1.0));
    numVertTrapTri++;
    points.push(vec4(0.5, -1.0, 0.5, 1.0));
    numVertTrapTri++;
    points.push(vec4(-0.5, -1.0, -0.5, 1.0));
    numVertTrapTri++;
    points.push(vec4(0.5, -1.0, 0.5, 1.0));
    numVertTrapTri++;
    points.push(vec4(0.5, -1.0, -0.5, 1.0));
    numVertTrapTri++;
}


function detectCollisionEnemy(newPosX, newPosZ) {
    if (newPosX < -groundScale || newPosX > groundScale || newPosZ < -groundScale || newPosZ > groundScale) {

        return 1;
    }
    for (var index = 0; index < objectPos.length; index++) {
        if (Math.abs(newPosX - objectPos[index][0]) < 3.0 && Math.abs(newPosZ - objectPos[index][2]) < 1.0) {
            console.log("en");
            return 2;
        }
    }
    return 3;
};

var prevEyeVec = normalize(vec3(prevEye[0] - xPos, 2.0, prevEye[2] - zPos));
var eyeVec = normalize(vec3(eyePos[0] - xPos, 2.0, eyePos[2] - zPos));
var rot = Math.acos(dot(prevEyeVec, eyeVec).toFixed(2)) * 180 / Math.PI;


if (elapsedTime2 == 200) {
    if (xPos < prevEye[0] && zPos < prevEye[2]) {
        if (Math.abs(prevEye[0] - eyePos[0]) > Math.abs(prevEye[2] - eyePos[2])) { //x증가량 z증가량 비교
            if (prevEye[0] < eyePos[0])
                rot2 += rot;
            else if (prevEye[0] > eyePos[0])
                rot2 -= rot;
        }
        else {
            if (prevEye[2] < eyePos[2])
                rot2 -= rot;
            else if (prevEye[2] > eyePos[2])
                rot2 += rot;
        }
    }
    else if (xPos > prevEye[0] && zPos < prevEye[2]) {
        if (Math.abs(prevEye[0] - eyePos[0]) > Math.abs(prevEye[2] - eyePos[2])) { //x증가량 z증가량 비교
            if (prevEye[0] < eyePos[0])
                rot2 -= rot;
            else if (prevEye[0] > eyePos[0])
                rot2 += rot;
        }
        else {
            if (prevEye[2] < eyePos[2])
                rot2 -= rot;
            else if (prevEye[2] > eyePos[2])
                rot2 += rot;
        }
    }
}
