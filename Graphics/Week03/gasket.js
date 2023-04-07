var gl;
var points;
var numPoints = 5000;

window.onload = function init() //웹 페이지를 부를 때 마다 = 새로고침 할 때 마다
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    // Sierpinski Gasket
    generatePoints();

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition"); //html의 vPosition이란 변수에 program을 넣고 사용해라는 함수 
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length); //포인트의 크기만큼 넣기
}

function generatePoints() {
    // Initialize the data for the Sierpinski Gasket
    // First, initialize the corners of a gasket with three points
    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    // Specify a starting point p for iterations
    // p must lie inside any set of three vertices
    var u = add(vertices[0], vertices[1]);
    var v = add(vertices[0], vertices[2]);
    var p = scale(0.25, add(u, v)); //계산을 편하게 하기위해서 0.25 적용
    //1변 2변 2로 나눈 지점에 선을 내리고 그 선을 나누어 그 점을 찾음 

    // Add an initial point into the array of points
    points = [p];

    // Compute the new points
    // Each new point is located midway between last point and a randomly chosen vertex
    for (var i=0; points.length<numPoints; i++) {
        var j = Math.floor(Math.random() * 3); //floor는 소수점 내림 이용
        p = add(points[i], vertices[j]); 
        p = scale(0.5, p);
        points.push(p);
    }
}
function drawGasket() {
    numPoints = parseInt(document.getElementById("numPoints").value);
    if (numPoints > 0 && numPoints <= 50000) {
        generatePoints();
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
        render();
    }
    else {
        alert("점의 개수는 0보다 크고 50,000보다 작거나 같아야 합니다.");
    }
}