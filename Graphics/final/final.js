var gl;
var points = [];
var normals = [];
var texCoords = [];
var bulletColl = []; // 부딪힘

var bulletStart = []; // 발사 위치
var bulletFire = []; // 발사 방향
var bulletRot = []; // 발사 회전
var bulletColor = []; // 총알 색

var cnt = -1; // 총 인덱스
var bullRot = 0.0; // 총알 회전
var bulletCnt = 7; // 총 총알 갯수
var remainCnt = bulletCnt; // 남은 총알 갯수

var enemyHit = false; // 다시~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!

var program0, program1, program2;
var modelMatrixLoc0, viewMatrixLoc0, modelMatrixLoc1, viewMatrixLoc1, modelMatrixLoc2, viewMatrixLoc2;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var vertTexCubeStart, numVertTexCubeTri, vertGroundStart, numVertGroundTri;
var vertCageStart, numVertCageTri, vertHpStart, numVertHpTri, vertTrapStart, numVertTrapTri;
var vertAimStart, numVertAimTri, vertCubeStart, numVertCubeTri, vertTriangleStart, numVertTriangleTri, vertPyraStart, numVertPyraTri;

const LEG_HEIGHT = 0.471405 + 0.942809;
const BODY_HEIGHT = 3.0;
const BODY_WIDTH = 5.0;
const ARM_HEIGHT = 3.0;
const ARM_WIDTH = 1.0;
const HEAD_HEIGHT = 3.0;
const HEAD_WIDTH = 3.0;
const HORN_HEIGHT = 2.0;
const HORN_WIDTH = 0.5;
const BROW_HEIGHT = 0.5;
const BROW_WIDTH = 0.2;

var audio1 = new Audio('../images/pop.wav');
var audio2 = new Audio('../images/hit.wav');
var audio3 = new Audio('../images/jump.wav');


var eyePos = vec3(0.0, 3.0, 10.0);
var atPos = vec3(0.0, 0.0, 0.0);
var upVec = vec3(0.0, 1.0, 0.0);
var cameraVec = normalize(vec3(0.0, -0.4, -1.0)); // 1.0/Math.sqrt(2.0)

var prevEye = vec3(0.0, 3.0, 0.0);

var prevTime = new Date();
var prevTime2 = new Date(); //이전시간 체크용
var prevTime3 = new Date(); //피격시간 
var hitTime = 0.0;


var image1 = new Image();
image1.src = "../images/cage.png"

var image0 = new Image();
image0.src = "../images/angry.png"

var image2 = new Image();
image2.src = "../images/ddd.png"


var objectPos = []; //적 충돌 좌표
var objectPos2 = []; // 함정
var enemyColl = 0;

var prevXPos = 1;
var prevZPos = -10;
var xPos = 1; //적 생성 위치 x
var zPos = -10; //적 생성 위치 z

var rot2 = 0;

var hpCount = 10;

const groundScale = 30;


//콜라이더
function detectCollision(newPosX, newPosZ) {
    if (newPosX < -groundScale || newPosX > groundScale || newPosZ < -groundScale || newPosZ > groundScale) {
        return true;
    }
    for (var index = 0; index < objectPos.length; index++) {
        if (Math.abs(newPosX - objectPos[index][0]) < 3.0 && Math.abs(newPosZ - objectPos[index][2]) < 3.0) {
            enemyColl = 1;
            return true;
        }
    }
    return false;
};

function detectCollisionTrap(newPosX, newPosZ) {
    for (var index = 0; index < objectPos2.length; index++) {
        if (Math.abs(newPosX - objectPos2[index][0]) < 2.0 && Math.abs(newPosZ - objectPos2[index][2]) < 2.0) {
            audio3.play();
            return true;
        }
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

    generateAim(); // 에임    
    generateRemainBul(); // 남은 총알
    generateHexaPyramid(); // 뿔
    generateTetrahedron(); // 다리
    generateCube(); // 몸통 팔 총알

    initBullet(); // 총알 관련 배열 초기화

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

    for (var i = 1; i < 4; i++) {
        objectPos2.push(vec3(randomX * i, 0, randomZ * i));
        objectPos2.push(vec3(-randomX * i, 0, -randomZ * i));
    }

    setLighting(program2);
    setTexture();

    render();
};

window.onkeydown = function (event) {
    var sinTheta = Math.sin(0.3);
    var cosTheta = Math.cos(0.3);
    switch (event.keyCode) {
        case 32:  // bullet 발사            
            if (cnt + 1 == bulletCnt) {
                alert("총알 다씀!\n'R'키를 눌러 재장전하쇼!");
                break;
            }
            cnt++;

            var start = bulletStart[cnt]; // 발사 지점
            start[0] = eyePos[0];
            start[2] = eyePos[2];
            var dir = bulletFire[cnt]; // 발사 방향
            dir[0] = atPos[0] - start[0];
            dir[2] = atPos[2] - start[2];
            bulletRot[cnt] = bullRot; // 회전값

            audio1.play();
            remainCnt--;
            break;
        case 82: // r : 재장전
        case 114:
            if (bulletColl[bulletCnt - 1]) { // cnt만큼 다 사라졌어
                alert("재장전했땨!\n");
                cnt = -1;
                remainCnt = bulletCnt;
                initBullColl();
            }
            else if (bulletColl[bulletCnt - remainCnt - 1]) { // 마지막으로 쏜 총알이 사라짐?
                alert("아직 총알 남았다네!");
            }
            else {
                alert("아직 총알이 날아가는 중임둥");
            }
            break;
        case 37:    // left arrow
        case 65:    // 'A'
        case 97:    // 'a'
            var newVecX = cosTheta * cameraVec[0] + sinTheta * cameraVec[2];
            var newVecZ = -sinTheta * cameraVec[0] + cosTheta * cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            bullRot -= 5.73 * 3;
            break;
        case 39:    // right arrow
        case 68:    // 'D'
        case 100:   // 'd'
            var newVecX = cosTheta * cameraVec[0] - sinTheta * cameraVec[2];
            var newVecZ = sinTheta * cameraVec[0] + cosTheta * cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            bullRot += 5.73 * 3;
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

    gl.uniform1f(gl.getUniformLocation(program, "fogStart"), 2.0); //fog  
    gl.uniform1f(gl.getUniformLocation(program, "fogEnd"), 25.0);
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


    var texture2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);

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
    var modelView = mult(viewMatrix, trballMatrix); // 트랙볼 먼저 곱해야 함
    // viewMatrix
    {
        gl.useProgram(program0);
        gl.uniformMatrix4fv(viewMatrixLoc0, false, flatten(modelView));
        gl.useProgram(program1);
        gl.uniformMatrix4fv(viewMatrixLoc1, false, flatten(modelView));
        gl.uniform3fv(gl.getUniformLocation(program1, "eyePos"), flatten(eyePos));
        gl.useProgram(program2);
        gl.uniformMatrix4fv(viewMatrixLoc2, false, flatten(modelView));
        gl.uniform3fv(gl.getUniformLocation(program2, "eyePos"), flatten(eyePos));
    }

    //Time
    let currTime = new Date();
    let elapsedTime = currTime.getTime() - prevTime.getTime();
    let elapsedTime2 = currTime.getTime() - prevTime2.getTime();
    let elapsedTime3 = currTime.getTime() - prevTime3.getTime();
    prevTime = currTime;
    if (elapsedTime2 >= 210) {
        prevTime2 = currTime;
    }

    if (elapsedTime3 >= hitTime) { //00초가 지나면 다시 진정상태
        enemyHit = false;
        prevTime3 = currTime;
    }


    //init    
    var uColorLoc = gl.getUniformLocation(program0, "uColor");
    var diffuseProductLoc = gl.getUniformLocation(program1, "diffuseProduct");
    var textureLoc = gl.getUniformLocation(program2, "texture");

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

    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 2);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(trballMatrix));
    gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);

    gl.useProgram(program0);
    // aim
    modelMatrix = mult(translate(atPos[0], atPos[1] + 0.2, atPos[2]), rotateY(bullRot));
    modelMatrix = mult(modelMatrix, rotateX(34)); // 카메라 회전만큼
    gl.uniform4f(uColorLoc, 1.0, 0.0, 0.0, 1.0); // red
    aim(modelMatrix);

    // enemy

    modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    modelMatrix = mult(modelMatrix, translate(xPos, -1.0, zPos));
    modelMatrix = mult(modelMatrix, rotateY(rot2));

    gl.uniform4f(uColorLoc, 0.1, 0.1, 0.1, 1.0);
    // left leg
    var tx = 1.5;
    leg(modelMatrix, tx);

    // right leg
    tx = -1.5;
    leg(modelMatrix, tx);

    gl.uniform4f(uColorLoc, 0.2, 0.1, 0.1, 1.0);
    // body
    modelMatrix = mult(modelMatrix, translate(0.0, LEG_HEIGHT, 0.0)); // 다리 위로
    body(modelMatrix);

    gl.uniform4f(uColorLoc, 0.4, 0.1, 0.1, 1.0);
    // leg arm
    tx = -0.45 * BODY_WIDTH;
    arm(modelMatrix, tx, 1);

    // right arm
    tx = 0.45 * BODY_WIDTH;
    arm(modelMatrix, tx, 2);

    // head
    modelMatrix = mult(modelMatrix, translate(0.0, BODY_HEIGHT, 0.0)); // 몸통 위로
    head(modelMatrix);

    gl.uniform4f(uColorLoc, 0.0, 0.0, 0.0, 1.0); // black
    // brow
    tx = 1.0;
    brow(modelMatrix, tx, 1);

    // brow
    tx = -1.0;
    brow(modelMatrix, tx, 2);


    // 뿔
    gl.uniform4f(uColorLoc, 0.1, 0.1, 0.6, 1.0); // blue
    modelMatrix = mult(modelMatrix, translate(0.0, HEAD_HEIGHT, 0.0));
    tx = -1.0;
    horn(modelMatrix, tx);

    // 뿔
    tx = 1.0;
    horn(modelMatrix, tx);

    // hp bar       
    gl.uniform4f(uColorLoc, 1.0, 0.0, 0.0, 1.0); // red
    hp(modelMatrix);




    // bullet
    for (var i = 0; i <= cnt; i++) {
        if (bulletColl[i]) {
            continue;
        }
        var start = bulletStart[i];
        var dir = bulletFire[i]; // 발사 방향

        modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

        modelMatrix = mult(modelMatrix, translate(start)); // 생성 위치

        dir[0] += normalize(dir[0]) * elapsedTime * 0.01;
        dir[2] += normalize(dir[2]) * elapsedTime * 0.01;

        if (detectCollision(eyePos[0] + dir[0], eyePos[2] + dir[2])) { //부딪쳤어?
            bulletColl[i] = 1;
            if (enemyColl) { // 근데 적이야?                
                enemyHit = true;
                hitTime += 300;
                hpCount -= 1;

                audio2.play();
                if (hpCount <= 0) {
                    hpCount = 0;
                    alert("Clear");
                }
                enemyColl = 0;
            }
        }
        modelMatrix = mult(modelMatrix, translate(dir)); // 발사 방향  
        modelMatrix = mult(modelMatrix, rotateY(bulletRot[i]));
        gl.uniform4f(uColorLoc, bulletColor[i][0], bulletColor[i][1], bulletColor[i][2], bulletColor[i][3]); // color
        bullet(modelMatrix);
    }

    // remain bullet  
    for (var i = bulletCnt - remainCnt; i < bulletCnt; i++) {
        modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        gl.uniform4f(uColorLoc, bulletColor[i][0], bulletColor[i][1], bulletColor[i][2], bulletColor[i][3]); // red

        var ty = i * 0.7 + 1.0;
        remain(modelMatrix, ty);
    }



    if (detectCollisionTrap(eyePos[0], eyePos[2])) {
        if (eyePos[1] < 8.0) {
            eyePos[1] += 0.1;
        }
    }
    if (eyePos[1] > 3.0) {
        eyePos[1] -= elapsedTime / 300;
    }

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


    if (enemyHit) { //
        gl.useProgram(program2);
        gl.uniform1i(textureLoc, 0);
        modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        var sMatrix = scalem(1.5, 1, 1); //hpCount 만큼 줄이기 
        modelMatrix = mult(modelMatrix, sMatrix);
        modelMatrix = mult(modelMatrix, translate(xPos - 1, 6.6, zPos));
        modelMatrix = mult(modelMatrix, rotateY(rot2));
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertTexCubeStart, numVertTexCubeTri);
    }
    gl.enable(gl.DEPTH_TEST);


    window.requestAnimationFrame(render);
}

function hp(modelMatrix) {
    var sMatrix = scalem(hpCount * 0.1, 8, 1); //hpCount 만큼 줄이기 
    modelMatrix = mult(modelMatrix, sMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertHpStart, numVertHpTri);
}
function leg(modelMatrix, tx) {
    modelMatrix = mult(modelMatrix, translate(tx, 0.0, 0.0));
    var tMatrix = mult(translate(0.0, LEG_HEIGHT, 0.0), rotateX(160));
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertTriangleStart, numVertTriangleTri);
}

function body(modelMatrix) {
    var sMatrix = scalem(BODY_WIDTH, BODY_HEIGHT, BODY_WIDTH);
    var tMatrix = mult(translate(0.0, 0.5 * BODY_HEIGHT, 0.0), sMatrix);
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
}

function arm(modelMatrix, tx, mFlag) {
    var mmHeight = 2.5;
    var mmRotate = 140;
    if (enemyHit) {
        mmRotate = 30;
    }
    modelMatrix = mult(modelMatrix, translate(tx, mmHeight, 0.0));
    if (mFlag == 1) {
        modelMatrix = mult(modelMatrix, rotateZ(-mmRotate));
    }
    else if (mFlag == 2) {
        modelMatrix = mult(modelMatrix, rotateZ(mmRotate));
    }
    var sMatrix = scalem(ARM_WIDTH, ARM_HEIGHT, ARM_WIDTH);
    var tMatrix = mult(translate(0.0, 0.5 * ARM_HEIGHT, 0.0), sMatrix);
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
}

function head(modelMatrix) {
    var sMatrix = scalem(HEAD_WIDTH, HEAD_HEIGHT, HEAD_WIDTH);
    var tMatrix = mult(translate(0.0, 0.5 * HEAD_HEIGHT, 0.0), sMatrix);
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
}

function horn(modelMatrix, tx) {
    modelMatrix = mult(modelMatrix, translate(0.0, 1.5, 0.0)); // 원래 길이
    modelMatrix = mult(modelMatrix, translate(tx, 0.0, 0.0));
    modelMatrix = mult(modelMatrix, rotateX(180));
    var sMatrix = scalem(HORN_WIDTH, HORN_HEIGHT, HORN_WIDTH);
    var tMatrix = mult(translate(0.0, 0.5 * HORN_HEIGHT, 0.0), sMatrix);
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);
}

function brow(modelMatrix, tx, mFlag) {
    mmRotate = 0.0;
    if (enemyHit)
        mmRotate = 50;
    if (mFlag == 1)
        modelMatrix = mult(modelMatrix, rotateZ(-mmRotate));
    else
        modelMatrix = mult(modelMatrix, rotateZ(mmRotate));
    modelMatrix = mult(modelMatrix, translate(tx, 0.0, 0.0));
    var sMatrix = scalem(BROW_WIDTH, BROW_HEIGHT, BROW_WIDTH);
    var tMatrix = mult(translate(0.0, 2.0, 0.5 * HEAD_WIDTH + 0.5 * BROW_WIDTH), sMatrix);
    var instanceMatrix = mult(modelMatrix, tMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
}

function aim(modelMatrix) {
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.LINES, vertAimStart, numVertAimTri);
}

function remain(modelMatrix, ty) {
    var trMatrix = mult(translate(atPos[0], atPos[1], atPos[2]), rotateY(bullRot));
    modelMatrix = mult(modelMatrix, trMatrix);
    modelMatrix = mult(modelMatrix, scalem(0.1, 0.1, 0.1));
    modelMatrix = mult(modelMatrix, rotateX(-7));
    modelMatrix = mult(modelMatrix, translate(-13.0, -(ty + 2.0), 0.0));
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertRemainStart, numVertRemainTri);
}

function generateAim() {
    vertAimStart = points.length;
    numVertAimTri = 0;
    points.push(vec4(-0.2, 0.0, -1.0, 1.0));
    numVertAimTri++;
    points.push(vec4(0.2, 0.0, -1.0, 1.0));
    numVertAimTri++;

    points.push(vec4(0.0, -0.2, -1.0, 1.0));
    numVertAimTri++;
    points.push(vec4(0.0, 0.2, -1.0, 1.0));
    numVertAimTri++;
}

function generateRemainBul() {
    vertRemainStart = points.length;
    numVertRemainTri = 0;

    points.push(vec4(0.0, 0.0, 0.0, 1.0));
    numVertRemainTri++;
    points.push(vec4(0.0, -0.5, 0.0, 1.0));
    numVertRemainTri++;
    points.push(vec4(0.5, 0.0, 0.0, 1.0));
    numVertRemainTri++;

    points.push(vec4(0.0, -0.5, 0.0, 1.0));
    numVertRemainTri++;
    points.push(vec4(0.5, 0.0, 0.0, 1.0));
    numVertRemainTri++;
    points.push(vec4(0.5, -0.5, 0.0, 1.0));
    numVertRemainTri++;
}

bulletColor = [
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 0.5, 0.0, 1.0), // orange
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 1.0, 1.0, 1.0), // cyan
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(0.7, 0.0, 0.8, 1.0) // violet
]

function bullet(modelMatrix) {
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
}

function initBullColl() {
    for (var i = 0; i < bulletCnt; i++) {
        bulletColl[i] = 0;
    }
}
function initBullet() {
    for (var i = 0; i < bulletCnt; i++) {
        bulletStart[i] = vec3(0.0, 0.0, 0.0);
        bulletFire[i] = vec3(0.0, 0.0, 0.0);
        bulletRot[i] = 0.0;
        bulletColl[i] = 0;
    }
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
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0)
    ];

    var index = [a, b, c, a, c, d];
    for (var i = 0; i < index.length; i++) {
        points.push(vertexPos[index[i]]);
        numVertCubeTri++;
    }
}

function generateHexaPyramid() {
    vertPyraStart = points.length;
    numVertPyraTri = 0;
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

    for (var i = 1; i < 6; i++) {
        points.push(vertexPos[0]);
        numVertPyraTri++;
        points.push(vertexPos[i]);
        numVertPyraTri++;
        points.push(vertexPos[i + 1]);
        numVertPyraTri++;

        points.push(vertexPos[7]);
        numVertPyraTri++;
        points.push(vertexPos[i + 1]);
        numVertPyraTri++;
        points.push(vertexPos[i]);
        numVertPyraTri++;
    }
    points.push(vertexPos[0]);
    numVertPyraTri++;
    points.push(vertexPos[6]);
    numVertPyraTri++;
    points.push(vertexPos[1]);
    numVertPyraTri++;

    points.push(vertexPos[7]);
    numVertPyraTri++;
    points.push(vertexPos[1]);
    numVertPyraTri++;
    points.push(vertexPos[6]);
    numVertPyraTri++;
}

function generateTetrahedron() {
    vertTriangleStart = points.length;
    numVertTriangleTri = 0;
    var va = vec4(0.0, 0.471405, 1.0, 1.0);
    var vb = vec4(0.0, 0.942809 + 0.471405, -0.333333, 1.0);
    var vc = vec4(-0.816497, 0.0, -0.333333, 1.0);
    var vd = vec4(0.816497, 0.0, -0.333333, 1.0);

    divideTriangle(va, vb, vc);
    divideTriangle(va, vc, vd);
    divideTriangle(va, vd, vb);
    divideTriangle(vd, vc, vb);
}

function divideTriangle(a, b, c) {
    points.push(a);
    numVertTriangleTri++;
    points.push(b);
    numVertTriangleTri++;
    points.push(c);
    numVertTriangleTri++;
}

function generateTexCube() {
    vertTexCubeStart = points.length;
    numVertTexCubeTri = 0;
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
    numVertTexCubeTri++;

    points.push(vertexPos[b]);
    normals.push(vertexNormals[b]);
    texCoords.push(texCoord[1]);
    numVertTexCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    texCoords.push(texCoord[2]);
    numVertTexCubeTri++;

    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    texCoords.push(texCoord[0]);
    numVertTexCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    texCoords.push(texCoord[2]);
    numVertTexCubeTri++;

    points.push(vertexPos[d]);
    normals.push(vertexNormals[d]);
    texCoords.push(texCoord[3]);
    numVertTexCubeTri++;
}

function generateTexGround(scale) {
    vertGroundStart = points.length;
    numVertGroundTri = 0;

    points.push(vec4(scale, -1.0, scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    texCoords.push(vec2(0, 0));
    numVertGroundTri++;

    points.push(vec4(scale, -1.0, -scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    texCoords.push(vec2(0, 1));
    numVertGroundTri++;

    points.push(vec4(-scale, -1.0, -scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    texCoords.push(vec2(1, 1));
    numVertGroundTri++;

    points.push(vec4(scale, -1.0, scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    texCoords.push(vec2(0, 0));
    numVertGroundTri++;

    points.push(vec4(-scale, -1.0, -scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    texCoords.push(vec2(1, 1));
    numVertGroundTri++;

    points.push(vec4(-scale, -1.0, scale, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    texCoords.push(vec2(1, 0));
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

    points.push(vec4(1.5, 0.5, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(-1.5, 0.5, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(-1.5, 0.4, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(1.5, 0.5, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(-1.5, 0.4, 0.0, 1.0));
    numVertHpTri++;
    points.push(vec4(1.5, 0.4, 0.0, 1.0));
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