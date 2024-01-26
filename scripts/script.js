const audioCtx = new (window.AudioContext || webkitAudioContext)();
const waveformCanvas = document.getElementById('waveformCanvas');
const waveformContext = waveformCanvas.getContext('2d');

const buffers = {};

async function loadSound(soundName, soundPath) {
    try {
        const response = await fetch(soundPath);
        const audioData = await response.arrayBuffer();
        buffers[soundName] = await audioCtx.decodeAudioData(audioData);
    } catch (error) {
        alert(`Error loading ${soundName} sound: `, error);
    }
}

loadSound('kick', 'sounds/kick.wav')
loadSound('snare', 'sounds/snare.wav')
loadSound('lowTom', 'sounds/lowTom.wav')
loadSound('midTom', 'sounds/midTom.wav')
loadSound('hiTom', 'sounds/hiTom.wav')
loadSound('rim', 'sounds/rim.wav')
loadSound('clap', 'sounds/clap.wav')
loadSound('cowbell', 'sounds/cowbell.wav')
loadSound('cymbal', 'sounds/cymbal.wav')
loadSound('openHH', 'sounds/openHH.wav')
loadSound('closedHH', 'sounds/closedHH.wav')

function playSound(soundName) {
    const soundBuffer = buffers[soundName];
    if (!soundBuffer) {
        alert("Buffer not available");
        return;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = soundBuffer;

    if (delayActive && delayPattern[step]) {
        const delayed = audioCtx.createDelay();
        delayed.delayTime.value = delayTime;

        const feedback = audioCtx.createGain();
        feedback.gain.value = feedbackAmount;

        source.connect(delayed);
        delayed.connect(feedback);
        feedback.connect(delayed);
        delayed.connect(audioCtx.destination);

        source.start();
    } else {
        source.connect(audioCtx.destination);
        source.start();
    }
}

document.getElementById('kickButton').addEventListener('click', () => playSound('kick'));
document.getElementById('snareButton').addEventListener('click', () => playSound('snare'));
document.getElementById('lowTomButton').addEventListener('click', () => playSound('lowTom'));
document.getElementById('midTomButton').addEventListener('click', () => playSound('midTom'));
document.getElementById('hiTomButton').addEventListener('click', () => playSound('hiTom'));
document.getElementById('rimButton').addEventListener('click', () => playSound('rim'));
document.getElementById('clapButton').addEventListener('click', () => playSound('clap'));
document.getElementById('cowBellButton').addEventListener('click', () => playSound('cowbell'));
document.getElementById('cymbalButton').addEventListener('click', () => playSound('cymbal'));
document.getElementById('openHHButton').addEventListener('click', () => playSound('openHH'));
document.getElementById('closedHHButton').addEventListener('click', () => playSound('closedHH'));

const drumPattern = {
    kick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    lowTom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    midTom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    hiTom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    rim: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    clap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    cowbell: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    cymbal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    openHH: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    closedHH: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

const delayPattern = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const delayNode = audioCtx.createDelay();
const feedbackNode = audioCtx.createGain();
const dryGain = audioCtx.createGain();

delayNode.connect(feedbackNode);
feedbackNode.connect(delayNode);
dryGain.connect(audioCtx.destination);

let delayTime = 0.5;
let feedbackAmount = 0.5;
let delayActive = false;

function toggleDelay() {
    delayActive = !delayActive;
    if (delayActive) {
        delayNode.delayTime.value = delayTime;
        feedbackNode.gain.value = feedbackAmount;
    } else {
        delayNode.delayTime.value = 0;
    }
}

function changeDelayTime(newDelayTime) {
    delayTime = newDelayTime;
    if (delayActive) {
        delayNode.delayTime.value = delayTime;
    }
}

var delayButton = document.getElementById('toggleDelay');

delayButton.addEventListener('click', function () {
    this.classList.toggle('on');
    this.classList.toggle('off');
});

document.getElementById('toggleDelay').addEventListener('click', toggleDelay);

document.getElementById('delayAmount').addEventListener('input', function (event) {
    const newDelayAmount = parseFloat(event.target.value);
    changeDelayTime(newDelayAmount);
    delayNode.delayTime.value = newDelayAmount;
});

let bpm = 120
const stepsPerBar = 16
const stepSubdivisions = ['1', 'e', '&', 'a'];
let currentSubdivision = 0;
let beatInterval
let step = 0
const intervalTime = (60 / bpm) * (4 / stepsPerBar) * 1000

function playDrumStep() {
    for (const soundName in drumPattern) {
        if (drumPattern[soundName][step]) {
            if (delayPattern[step] && delayActive) {
                const soundBuffer = buffers[soundName];
                const source = audioCtx.createBufferSource();
                source.buffer = soundBuffer;

                const delayed = audioCtx.createDelay();
                delayed.delayTime.value = delayTime;
                const feedback = audioCtx.createGain();
                feedback.gain.value = feedbackAmount;

                source.connect(delayed);
                delayed.connect(feedback);
                feedback.connect(delayed);
                delayed.connect(audioCtx.destination);

                source.start();
            } else {
                playSound(soundName);
            }
        }
    }

    step = (step + 1) % stepsPerBar;
}

let isPlaying = false

function startBeat() {
    if (!isPlaying) {
        isPlaying = true;
        step = 0;
        currentSubdivision = 0;
        const msPerStep = (60 / bpm) / 4 * 1000;

        beatInterval = setInterval(() => {
            if (currentSubdivision === 0) {
                playDrumStep();
            }
            currentSubdivision = (currentSubdivision + 1) % stepSubdivisions.length;
        }, msPerStep / stepSubdivisions.length);
    }
}

function stopBeat() {
    isPlaying = false;
    clearInterval(beatInterval);
}

function changeTempo(newBPM) {
    bpm = newBPM
    document.getElementById('tempoValue').textContent = `${bpm} BPM`;
    intervalTime = (60 / bpm) * (4 / stepsPerBar) * 1000
    if (beatInterval) {
        stopBeat()
        startBeat()
    }
}

document.getElementById('tempoRange').addEventListener('input', function (event) {
    const newTempo = parseInt(event.target.value)
    changeTempo(newTempo)
})

const btnPlay = document.getElementById("play")
const btnStop = document.getElementById("stop")

Object.keys(drumPattern).forEach(sound => {
    document.querySelectorAll(`#${sound}-grid .step-inner`).forEach((stepInner, index) => {
        stepInner.addEventListener('click', () => {
            stepInner.parentElement.classList.toggle('active');
            const soundName = stepInner.parentElement.parentNode.id.replace('-grid', '');
            drumPattern[soundName][index] = stepInner.parentElement.classList.contains('active') ? 1 : 0;
        });
    });
});

btnPlay.addEventListener('click', startBeat)
btnStop.addEventListener('click', stopBeat)

const btnSeq = document.getElementById("seq")
const sequencer = document.getElementById("sequencer")
const btnClose = document.getElementById("closeBtn")
btnSeq.addEventListener('click', () => {
    sequencer.classList.remove("hidden");
})

btnClose.addEventListener('click', () => {
    sequencer.classList.add("hidden")
})

function drawWaveform(buffer) {
    const data = buffer.getChannelData(0);
    const width = waveformCanvas.width;
    const height = waveformCanvas.height;

    waveformContext.clearRect(0, 0, width, height);
    waveformContext.beginPath();
    waveformContext.lineWidth = 2;
    waveformContext.strokeStyle = '#333';

    for (let i = 0; i < data.length; i++) {
        const x = (i / data.length) * width;
        const y = (data[i] + 1) * 0.5 * height;

        if (i === 0) {
            waveformContext.moveTo(x, y);
        } else {
            waveformContext.lineTo(x, y);
        }
    }

    waveformContext.stroke();
}

async function loadAndPlaySample(soundName, soundPath) {
    try {
        const response = await fetch(soundPath);
        const audioData = await response.arrayBuffer();
        const soundBuffer = await audioCtx.decodeAudioData(audioData);

        const source = audioCtx.createBufferSource();
        source.buffer = soundBuffer;

        const analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.start();

        analyser.getByteTimeDomainData(dataArray);
        drawWaveform(soundBuffer);
    } catch (error) {
        alert(`Error loading ${soundName} sound: ${error}`);
    }
}

document.getElementById('kickButton').addEventListener('click', () => loadAndPlaySample('Kick', 'sounds/kick.wav'));
document.getElementById('snareButton').addEventListener('click', () => loadAndPlaySample('Snare', 'sounds/snare.wav'));
document.getElementById('lowTomButton').addEventListener('click', () => loadAndPlaySample('Low Tom', 'sounds/lowTom.wav'));
document.getElementById('midTomButton').addEventListener('click', () => loadAndPlaySample('Mid Tom', 'sounds/midTom.wav'));
document.getElementById('hiTomButton').addEventListener('click', () => loadAndPlaySample('Hi Tom', 'sounds/hiTom.wav'));
document.getElementById('rimButton').addEventListener('click', () => loadAndPlaySample('Rim', 'sounds/rim.wav'));
document.getElementById('clapButton').addEventListener('click', () => loadAndPlaySample('Clap', 'sounds/clap.wav'));
document.getElementById('cowBellButton').addEventListener('click', () => loadAndPlaySample('Cowbell', 'sounds/cowbell.wav'));
document.getElementById('cymbalButton').addEventListener('click', () => loadAndPlaySample('Cymbal', 'sounds/cymbal.wav'));
document.getElementById('openHHButton').addEventListener('click', () => loadAndPlaySample('Open HH', 'sounds/openHH.wav'));
document.getElementById('closedHHButton').addEventListener('click', () => loadAndPlaySample('Closed HH', 'sounds/closedHH.wav'));