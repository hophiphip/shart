document.getElementById("open")!.onclick = () => {
    document.getElementById("sidenav")!.style.width = "250px";
}

document.getElementById("close")!.onclick = () => {
    document.getElementById("sidenav")!.style.width = "0";
}

export {};