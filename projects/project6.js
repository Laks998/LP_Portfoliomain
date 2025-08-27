// Small pulse effect on "Coming Soon"
const text = document.getElementById("mainText");
if (text) {
  setInterval(() => {
    text.style.transform = "scale(1.05)";
    setTimeout(() => (text.style.transform = "scale(1)"), 300);
  }, 2000);
}
