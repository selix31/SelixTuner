let currentInstrument = null;

const popup = document.getElementById("popup");
const instrumentMenu = document.getElementById("instrument-menu");
const tunerBar = document.getElementById("tuner-bar");
const cursor = document.getElementById("tuner-cursor");
const noteDisplay = document.getElementById("note-display");

const guitarNotes = ["E", "A", "D", "G", "B", "E"];
const ukuleleNotes = ["G", "C", "E", "A"];

// Affiche les notes sur l’écran
function renderNotes(instrument) {
    noteDisplay.innerHTML = "";
    let notes = instrument === "ukulele" ? ukuleleNotes : guitarNotes;
    notes.forEach(note => {
        let noteElem = document.createElement("span");
        noteElem.className = "note";
        noteElem.textContent = note;
        noteDisplay.appendChild(noteElem);
    });
}

// ===== Listeners =====
document.getElementById("btn-start").addEventListener("click", () => {
    popup.style.display = "none";
    instrumentMenu.style.display = "block";
});

document.getElementById("btn-guitare").addEventListener("click", () => {
    currentInstrument = "guitare";
    tunerBar.style.display = "block";
    renderNotes("guitare");
    startTuner();
});
document.getElementById("btn-ukulele").addEventListener("click", () => {
    currentInstrument = "ukulele";
    tunerBar.style.display = "block";
    renderNotes("ukulele");
    startTuner();
});

// ===== Tuner avec micro =====
let audioContext;
let analyser;
let dataArray;

async function startTuner() {
    if (audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    dataArray = new Float32Array(analyser.fftSize);

    requestAnimationFrame(updateTunerCursor);
}

// Convertit fréquence en note MIDI
function frequencyToNote(freq) {
    return 12 * (Math.log2(freq / 440)) + 69; // 440Hz = A4
}

// Met à jour la position du curseur et la couleur des notes
function updateTunerCursor() {
    analyser.getFloatTimeDomainData(dataArray);

    let peak = autoCorrelate(dataArray, audioContext.sampleRate);

    if (peak !== -1) {
        // Déviation du curseur (-1 à 1)
        let deviation = Math.max(-1, Math.min(1, (peak - Math.round(peak))));
        cursor.style.left = `${50 + deviation * 50}%`;

        // Active note correspondante
        const notes = noteDisplay.querySelectorAll(".note");
        notes.forEach(n => {
            n.classList.remove("active");
            n.classList.remove("correct");
        });

        let nearestNoteIndex = Math.round(peak) % notes.length;
        if (notes[nearestNoteIndex]) {
            notes[nearestNoteIndex].classList.add("active");

            // Si le curseur est proche du centre, la note est juste
            if (Math.abs(deviation) < 0.05) {
                notes[nearestNoteIndex].classList.add("correct");
            }
        }
    }

    requestAnimationFrame(updateTunerCursor);
}

// ===== Auto-corrélation pour détecter la fréquence =====
function autoCorrelate(buf, sampleRate) {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE - i; j++) r[i] += buf[j] * buf[j + i];
    }

    let d = 0; while (r[d] > r[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
        if (r[i] > maxval) { maxval = r[i]; maxpos = i; }
    }
    return maxpos === -1 ? -1 : sampleRate / maxpos;
}