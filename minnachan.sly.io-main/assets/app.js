function sb_open() {
    document.getElementsByTagName("nav")[0].style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function sb_close() {
    document.getElementsByTagName("nav")[0].style.display = "none";
    document.getElementById("overlay").style.display = "none";
}