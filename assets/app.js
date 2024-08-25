function sb_open() {
    document.getElementsByTagName("nav")[0].style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function sb_close() {
    document.getElementsByTagName("nav")[0].style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function show_modal(event) {
    event.currentTarget.nextElementSibling.style.visibility = "visible";
}
var asdf;
function hide_modal(event) {
    if (event.target.localName != "model-viewer")
        event.currentTarget.style.visibility = "hidden";
}

for (let element of document.getElementById("card-container").getElementsByClassName("card")){
    element.addEventListener("click", show_modal); 
}
for (let element of document.getElementById("card-container").getElementsByClassName("modal")){
    element.addEventListener("click", hide_modal); 
}