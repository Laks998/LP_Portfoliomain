document.addEventListener("DOMContentLoaded", function() {
  const text = "HI, I'M LAKSHMI PRATAP";
  const element = document.querySelector(".typewriter");
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }

  element.textContent = "";
  typeWriter();
});
