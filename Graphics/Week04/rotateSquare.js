var gl;
var theta = 0;
var thetaLoc;
var direction = true; // button을 다룰 때 bool함수와 if /else로 사용
var stop = false;
var delay = 100;
var length = 1;
var lengthLoc;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    document.getElementById("directionButton").onclick = function () {
        direction = !direction;
    };
    document.getElementById("myMenu").onclick = function (event) {
        switch (event.target.value) {
            case '0':
                delay *= 0.5; //곱하기 연산이 빠름
                break;
            case '1':
                delay *= 2.0;
                break;
            case '2':
                length *= 1.1;
                break;
            case '3':
                length *=0.9;
                break;
        }
    };
    document.getElementById("speedSlider").onchange = function(event){
        delay = event.target.value;
    };
    document.getElementById("stopButton").onclick = function(event){
        stop = !stop;
        if(stop) {
            event.target.innerText = "Start Rotation";
        }
        else{
            event.target.innerText = "Stop Rotation";
        }
    }
    var vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(0, -1),
        vec2(1, 0)
    ];

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader"); //gpu에서 사용하기에 init~ 사용
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();     //bufferId라는 버퍼(GPU에게 데이터를 전달하는 방법) 생성 후 
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId); //bufferId를 작업 할 버퍼로 설정함 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertics), gl.STATIC_DRAW);//flatten = gpu메모리상 32비트로 변환 
    //데이터를 현재 버퍼로 복사 (vertics의 값을 flatten을 이용해 Gpu상에서 사용 할 수 있도록 변형 후 현재 버퍼로 사용)

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition"); //데이터가 vPosition으로 전달되도록 위치 설정 
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // WebGl에게 vPosition에서 데이터를 가져오도록 설정한다. 
    gl.enableVertexAttribArray(vPosition); // WebGl에게 우리가 버퍼(vPosition)로부터 데이터를 제공 할 것을 알려줌 


    thetaLoc = gl.getUniformLocation(program,"theta");
    gl.uniform1f(thetaLoc,theta);

    lengthLoc = gl.getUniformLocation(program,"length");
    gl.uniform1f(lengthLoc,length);

    render();
};

function render()
{
    setTimeout(function() { //단위는 ms이며 왕복하는 시간을 정하기에 작을수록 빠르게 반복됨
    gl.clear(gl.COLOR_BUFFER_BIT); //색상 관련된 버퍼 지우기
    theta += (stop ? 0 : (direction ? 0.1 : -0.1));
    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(lengthLoc,length);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    window.requestAnimationFrame(render); //재귀함수 (더블 버퍼링을 한다는 뜻(백,프론트 버퍼 번갈))
    }, delay);
}
