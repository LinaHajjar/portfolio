document.getElementById("toggleInfo").addEventListener("click", function() {
    const info = document.getElementById("extraInfo");

    // Toggle klassen "hidden" af eller på
    info.classList.toggle("hidden");

    // Skift tekst på knappen
    if (info.classList.contains("hidden")) {
        this.textContent = "Vis mere";
    } else {
        this.textContent = "Skjul";
    }
});
