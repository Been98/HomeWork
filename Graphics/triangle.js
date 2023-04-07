var gl;

//시험문제는 이 함수가 어떤 역할을 하는가? 를 물어봄 

window.onload = function init() //onload = 처음 열렸을 때 작동하는 함수 
{
    var canvas = document.getElementById("gl-canvas"); //초기화하기 위한 함수 

    gl = WebGLUtils.setupWebGL(canvas); //초기화 
    if( !gl ) { //없으면 경고 
        alert("WebGL isn't available!");
    }
 
    var vertices = new Float32Array([-0.5, -0.5, 0.0, 0.5, 0.5, -0.5]);

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height); //비율(왜곡) 없애기 위해 
    gl.clearColor(0.3, 0.3, 0.8, 1.0); // 배경색 지정(r,g,b,투명도)
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT); //배경색 지우기 
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
