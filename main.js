import { animate, timeline } from "motion";
import gsap from "gsap";

window.addEventListener("load", (e) => {
  const kiryuTattooContainer = document.getElementById(
    "kiryu-tattoo-container"
  );
  const kiryuTattoo = document.getElementById("kiryu-tattoo");
  const playBtn = document.getElementById("play-btn");
  const audio = document.getElementById("audio");

  const tl = new gsap.timeline();

  timeline([
    [kiryuTattooContainer, { x: "100%" }, { duration: 0.0001 }],
    [kiryuTattooContainer, { x: "0" }, { duration: 1 }],
    // [
    //   "path",
    //   {
    //     strokeDashoffset: 0,
    //     visibility: "visible",
    //     easing: "ease-out",
    //   },
    //   { duration: 3 },
    // ],
    [
      kiryuTattooContainer,
      { x: "-100%" },
      { duration: 1, easing: "ease-in-out", delay: 0.5 },
    ],
  ]);

  playBtn.addEventListener("click", (e) => {
    const newElement = document.createElement("img");

    // Set some content or attributes to the new element
    newElement.src = "./kiryu-img-1.gif";
    newElement.id = "new img";
    newElement.className = "animation";

    // Append the new element to the body or any other desired location
    document.getElementById("animation-container").appendChild(newElement);

    animate(
      newElement,
      { x: "100vw" },
      { duration: 2 },
      { easing: "ease-out" }
    ).finished.then(() => {
      newElement.remove();
    });

    const audioEl = new Audio("./kiryu-sound-1.mp3");
    audioEl.play();
  });

  // end of load listener
});
