let currentInstrument=null

const popup=document.getElementById("popup")
const instrumentMenu=document.getElementById("instrument-menu")
const tunerBar=document.getElementById("tuner-bar")
const cursor=document.getElementById("tuner-cursor")
const noteDisplay=document.getElementById("note-display")

const guitarNotes=[
{note:"E",freq:82.41},
{note:"A",freq:110},
{note:"D",freq:146.83},
{note:"G",freq:196},
{note:"B",freq:246.94},
{note:"E",freq:329.63}
]

const ukuleleNotes=[
{note:"G",freq:196},
{note:"C",freq:261.63},
{note:"E",freq:329.63},
{note:"A",freq:440}
]

function renderNotes(instrument){

noteDisplay.innerHTML=""

let notes=instrument==="ukulele"?ukuleleNotes:guitarNotes

notes.forEach(n=>{

let el=document.createElement("span")

el.className="note"

el.textContent=n.note

noteDisplay.appendChild(el)

})

}

document.getElementById("btn-start").onclick=()=>{

popup.style.display="none"

instrumentMenu.style.display="block"

}

document.getElementById("btn-guitare").onclick=()=>{

currentInstrument="guitare"

tunerBar.style.display="block"

renderNotes("guitare")

startTuner()

}

document.getElementById("btn-ukulele").onclick=()=>{

currentInstrument="ukulele"

tunerBar.style.display="block"

renderNotes("ukulele")

startTuner()

}

let audioContext
let analyser
let dataArray

async function startTuner(){

if(audioContext)return

audioContext=new(window.AudioContext||window.webkitAudioContext)()

const stream=await navigator.mediaDevices.getUserMedia({audio:true})

const source=audioContext.createMediaStreamSource(stream)

analyser=audioContext.createAnalyser()

analyser.fftSize=2048

source.connect(analyser)

dataArray=new Float32Array(analyser.fftSize)

update()

}

function update(){

analyser.getFloatTimeDomainData(dataArray)

let freq=autoCorrelate(dataArray,audioContext.sampleRate)

if(freq!==-1){

let notes=currentInstrument==="ukulele"?ukuleleNotes:guitarNotes

let closest=notes.reduce((a,b)=>{

return Math.abs(b.freq-freq)<Math.abs(a.freq-freq)?b:a

})

let diff=freq-closest.freq

let percent=Math.max(-1,Math.min(1,diff/closest.freq))

cursor.style.left=(50+percent*50)+"%"

if(Math.abs(percent)<0.02){

cursor.style.background="#4CAF50"

}

else if(percent<0){

cursor.style.background="#2196F3"

}

else{

cursor.style.background="#ff4444"

}

const noteEls=document.querySelectorAll(".note")

noteEls.forEach(n=>{

n.classList.remove("active")
n.classList.remove("correct")

if(n.textContent===closest.note){

n.classList.add("active")

if(Math.abs(percent)<0.02){

n.classList.add("correct")

}

}

})

}

requestAnimationFrame(update)

}

function autoCorrelate(buf,sampleRate){

let SIZE=buf.length

let rms=0

for(let i=0;i<SIZE;i++){

rms+=buf[i]*buf[i]

}

rms=Math.sqrt(rms/SIZE)

if(rms<0.01)return-1

let r=new Array(SIZE).fill(0)

for(let i=0;i<SIZE;i++){

for(let j=0;j<SIZE-i;j++){

r[i]+=buf[j]*buf[j+i]

}

}

let d=0

while(r[d]>r[d+1])d++

let maxval=-1
let maxpos=-1

for(let i=d;i<SIZE;i++){

if(r[i]>maxval){

maxval=r[i]
maxpos=i

}

}

if(maxpos===-1)return-1

return sampleRate/maxpos

}
