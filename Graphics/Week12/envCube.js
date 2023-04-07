var gl;
var points = [];
var normals = [];

var program;
//var modelMatrix;
var modelMatrixLoc;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    generateTetrahedron(4);

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
    var nBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

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

    setTexture();
    
    render();
};

function setTexture() {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    const faceInfos = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: '../images/LobbyXPos.bmp' },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: '../images/LobbyXNeg.bmp' },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: '../images/LobbyYPos.bmp' },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: '../images/LobbyYNeg.bmp' },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: '../images/LobbyZPos.bmp' },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: '../images/LobbyZNeg.bmp' },
    ];


    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    faceInfos.forEach((faceInfo) => {
        const {target, url} = faceInfo;

        
        gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);


        const image = new Image();
        image.src = url;
        image.addEventListener('load', function() {
            gl.texImage2D(target,level,internalFormat,format,type,image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
    });
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //NEARST는 계단현상 일어남
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST); //LINEAR, NEARST 빈칸 넣기 

}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(trballMatrix));
    
    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    requestAnimationFrame(render);
}

function generateTetrahedron(level){
    var va = vec4(0.0, 0.0, 1.0, 1.0);
    var vb = vec4(0.0, 0.942809, -0.333333, 1.0);
    var vc = vec4(-0.816497, -0.471405, -0.333333, 1.0);
    var vd = vec4(0.816497, -0.471405, -0.333333, 1.0);

    divideTriangle(va, vb, vc, level);
    divideTriangle(va, vc, vd, level);
    divideTriangle(va, vd, vb, level);
    divideTriangle(vd, vc, vb, level);
}

function divideTriangle(a, b, c, level){
    if (level > 1){
        var ab = normalize(mix(a,b,0.5), true);
        var ac = normalize(mix(a,c,0.5), true);
        var bc = normalize(mix(b,c,0.5), true);

        divideTriangle(a, ab, ac, level -1 );
        divideTriangle(ab, b, bc, level - 1);
        divideTriangle(bc, c, ac, level - 1);
        divideTriangle(ab, bc, ac, level - 1);
    }
    else {
        points.push(a);
        normals.push(vec4(a[0], a[1], a[2], 0.0));
        points.push(b);
        normals.push(vec4(b[0], b[1], b[2], 0.0));
        points.push(c);
        normals.push(vec4(c[0], c[1], c[2], 0.0));
    }
}
