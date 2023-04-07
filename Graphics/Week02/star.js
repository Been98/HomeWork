var gl;
var gl2;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");
    var canvas2 = document.getElementById("gl-canvas2");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }
    gl2 = WebGLUtils.setupWebGL(canvas2);
    if (!gl2) {
        alert("WebGL isn't available!");
    }

    var vertices = [ 
        vec2(0, 0.7),
        vec2(-0.6, -0.6),
        vec2(0.8, 0.2),
        vec2(-0.8, 0.2),
        vec2(0.6, -0.6),
 
    ];

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl2.viewport(canvas.width, canvas.height, canvas2.width, canvas2.height);
    gl2.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);//flatten = 벡터를 사용해도 gpu메모리에 맞게 바꿔주는 함수

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    program = initShaders(gl2, "vertex-shader", "fragment-shader");
    gl2.useProgram(program);

    // Load the data into the GPU
    bufferId = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, bufferId);
    gl2.bufferData(gl2.ARRAY_BUFFER, flatten(vertices), gl2.STATIC_DRAW);//flatten = 벡터를 사용해도 gpu메모리에 맞게 바꿔주는 함수

    // Associate our shader variables with our data buffer
    vPosition = gl2.getAttribLocation(program, "vPosition");
    gl2.vertexAttribPointer(vPosition, 2, gl2.FLOAT, false, 0, 0);
    gl2.enableVertexAttribArray(vPosition);

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_LOOP, 0, 5); 

    gl2.clear(gl2.COLOR_BUFFER_BIT);
    gl2.drawArrays(gl2.LINE_LOOP, 5, 5); 

    //STRIP = 이전에 2개를 가지고 그림 
    //FAN = 부채꼴 1번 선을 가지고 이어감 123,134,145,,,, 이런식 

}
