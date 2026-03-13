<!DOCTYPE html>
<html lang="fr">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Acadie Tuner</title>

<style>

body{
font-family:sans-serif;
background:#a9a9a9;
margin:0;
padding:0;
text-align:center;
}

/* POPUP */

#popup{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.6);
display:flex;
align-items:center;
justify-content:center;
}

#popup-content{
background:#d77b7b;
padding:20px;
border-radius:10px;
}

#btn-start{
background:#e7e0e0;
border:none;
padding:10px 20px;
border-radius:5px;
cursor:pointer;
}

/* MENU */

#instrument-menu{
display:none;
margin:20px;
}

#instrument-menu button{
margin:10px;
padding:10px 20px;
cursor:pointer;
border-radius:5px;
}

/* TUNER */

#tuner-bar{
display:none;
position:relative;
margin:30px auto;
background:#ebe6e6;
height:25px;
width:80%;
border-radius:10px;
}

#tuner-cursor{
position:absolute;
height:25px;
width:12px;
background:#ff6666;
border-radius:5px;
left:50%;
transform:translateX(-50%);
transition:left 0.08s;
}

/* NOTES */

#note-display{
margin-top:25px;
}

.note{
display:inline-block;
padding:8px 12px;
margin:5px;
background:#fb8c8c;
border-radius:5px;
font-weight:bold;
font-size:20px;
}

.note.active{
background:#ff6666;
color:white;
}

.note.correct{
background:#4CAF50;
color:white;
}

</style>

</head>

<body>

<div id="popup">
<div id="popup-content">

<h2>Bienvenue sur Acadie Tuner</h2>

<p>Application créée par Martin Duguay</p>

<button id="btn-start">Commencer</button>

</div>
</div>

<div id="instrument-menu">

<button id="btn-guitare">Guitare acoustique</button>

<button id="btn-ukulele">Ukulélé</button>

</div>

<div id="tuner-bar">

<div id="tuner-cursor"></div>

</div>

<div id="note-display"></div>

<script src="app.js"></script>

</body>
</html>
