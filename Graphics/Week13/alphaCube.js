var gl;
var points = [];
var colors = [];

//var modelMatrix;
var modelMatrixLoc;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var numVertCubeTri;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available!");
    }

    generateColorCube();



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

    //gl.enable(gl.DEPTH_TEST); // 깊이 설정
    gl.enable(gl.BLEND); //블랜딩 활성화
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MIMUS_SRC_ALPHA); //매개변수 (factor, 배경)
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

    var projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(trballMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numVertCubeTri);

    requestAnimationFrame(render);
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
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0)
    ];

    vertexColor = [
        vec4(0.0, 0.0, 0.0, 0.5),   // black
        vec4(1.0, 0.0, 0.0, 0.5),   // red
        vec4(1.0, 1.0, 0.0, 0.5),   // yellow
        vec4(0.0, 1.0, 0.0, 0.5),   // green
        vec4(0.0, 0.0, 1.0, 0.5),   // blue
        vec4(1.0, 0.0, 1.0, 0.5),   // magenta
        vec4(1.0, 1.0, 1.0, 0.5),   // white
        vec4(0.0, 1.0, 1.0, 0.5)    // cyan
    ];

    // We need to partition the quad into two triangles in order for WebGL
    // to be able to render it. In this case, we create two triangles from
    // the quad indices. 
    points.push(vertexPos[a]);
    colors.push(vertexColor[a]);
    numVertCubeTri++;

    points.push(vertexPos[b]);
    colors.push(vertexColor[a]);
    numVertCubeTri++;
    
    points.push(vertexPos[c]);
    colors.push(vertexColor[a]);
    numVertCubeTri++;

    points.push(vertexPos[a]);
    colors.push(vertexColor[a]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    colors.push(vertexColor[a]);
    numVertCubeTri++;

    points.push(vertexPos[d]);
    colors.push(vertexColor[a]);
    numVertCubeTri++;
}
