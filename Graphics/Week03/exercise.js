var gl;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    var vertices = [ 
       vec2(-0.4, -0.5), vec2(-0.3, 0.4), vec2(0.3,0.4),vec2(0.4,-0.5), 
       vec2(-0.2,-0.7),vec2(-0.2,-0.5),vec2(-0.1,-0.5),vec2(-0.1,-0.7),
       vec2(-0.3,-0.8),vec2(-0.3,-0.7),vec2(-0.1,-0.7),vec2(-0.1,-0.8),
       vec2(0.2, -0.7), vec2(0.2, -0.5), vec2(0.1, -0.5), vec2(0.1, -0.7),
        vec2(0.3, -0.8), vec2(0.3, -0.7), vec2(0.1, -0.7), vec2(0.1, -0.8),
        vec2(-0.32,0.2),vec2(-0.33,0.1),vec2(-0.6,-0.1),vec2(-0.65,-0.05),
        vec2(0.32, 0.2), vec2(0.33, 0.1), vec2(0.6, -0.1), vec2(0.65, -0.05),
        vec2(-0.65,-0.05),vec2(-0.6,-0.1),vec2(-0.65,-0.15),vec2(-0.7,-0.1),
        vec2(0.65, -0.05), vec2(0.6, -0.1), vec2(0.65, -0.15), vec2(0.7, -0.1),
        vec2(-0.4,0.4),vec2(-0.5,0.8),vec2(0.5,0.8),vec2(0.4,0.4),
        vec2(-0.5,0.8),vec2(-0.4,0.9),vec2(0.4,0.9),vec2(0.5,0.8),
        vec2(-0.2,0.7),vec2(-0.1,0.7),vec2(-0.1,0.6),vec2(-0.2,0.6),
        vec2(0.2, 0.7), vec2(0.1, 0.7), vec2(0.1, 0.6), vec2(0.2, 0.6),
        vec2(0.2,0.5),vec2(-0.2,0.5),vec2(0,0.45)
    ];
    var colors = [
        vec4(1, 0, 0, 1), vec4(1, 0, 0, 1),vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), //몸 

        vec4(1, 0, 0, 1), vec4(1, 0, 0, 1),vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), //왼다리 
        vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), //왼발
        vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), //오다리 
        vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), vec4(1, 1, 0, 1),//오발 
        vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), //왼팔
        vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), vec4(1, 0, 0, 1), //오팔
        vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), //왼주
        vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), vec4(1, 1, 0, 1), //오주
        vec4(0, 1, 0, 1), vec4(0, 1, 0, 1), vec4(0, 1, 0, 1), vec4(0, 1, 0, 1), //머리
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), //머리카락 
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), //왼눈
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), //오눈
        vec4(0, 0, 0, 1),vec4(0, 0, 0, 1),vec4(0, 0, 0, 1) //입 

        ];

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

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

    var cbufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,cbufferId);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(colors),gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program,"vColor");
    gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vColor);
    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);  //0 = 처음 시작하는 인덱스 
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 44, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 48, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 52, 3);
}
