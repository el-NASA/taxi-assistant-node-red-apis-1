var socketRecord = new WebSocket('ws://node-red-ugoae-2021-05-27.mybluemix.net/ws/driverAudio');

socketRecord.onopen = function (event) {
    socketRecord.send("con");
    console.log('Conectado');
};
socketRecord.onmessage = function (event) {
    var message = event.data;
    if (typeof (message) == "string") {
        console.log(message);
    } else {
        console.log(message);
        playAudio(message);
    }

};

socketRecord.onclose = function (event) {
    console.log('Desconectado del WebSocket.');
};

var constraints = { audio: true };

var mediaRecorder;

navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {

    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.onstart = function (e) {
        this.chunks = [];
    };
    mediaRecorder.ondataavailable = function (e) {
        this.chunks.push(e.data);
    };
    mediaRecorder.onstop = function (e) {
        var blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
        socketRecord.send(blob);
    };

});

function grabar() {
    mediaRecorder.start();
    setTimeout(function () {
        mediaRecorder.stop()
    }, 2000);
}


function playAudio(arrayBuffer) {
    var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
    var audio = document.createElement('audio');
    audio.src = window.URL.createObjectURL(blob);
    audio.play();
}
