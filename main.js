import { animate, timeline } from "motion";
import gsap from "gsap";

window.addEventListener("load", (e) => {
  const kiryuTattooContainer = document.getElementById(
    "kiryu-tattoo-container"
  );
  const animationContainer = document.getElementById("animation-container");

  const kiryuTattoo = document.getElementById("kiryu-tattoo");
  const playBtn = document.getElementById("play-btn");
  const audio = document.getElementById("audio");
  const counter = document.getElementById("click-counter");
  const tl = new gsap.timeline();

  // const cachedAssets = {};
  const cachedImages = [];
  const cachedSounds = [];

  let count = 0;
  const localCounter = localStorage.getItem("counter");
  if (localCounter) {
    counter.textContent = "...";
    count = JSON.parse(localCounter);

    counter.textContent = count;
  }

  timeline([
    [kiryuTattooContainer, { opacity: 1 }, { duration: 0.1 }],
    [kiryuTattooContainer, { x: "-100%", opacity: 1 }, { duration: 1.5 }],
    // [
    //   "path",
    //   {
    //     strokeDashoffset: 0,
    //     visibility: "visible",
    //     easing: "ease-out",
    //   },
    //   { duration: 3 },
    // ],
    [kiryuTattooContainer, { x: "-200%" }, { opacity: 1, duration: 1 }],
  ]);

  const updateCounter = () => {
    const number = count;
    counter.innerText = count + 1;
    count++;
    localStorage.setItem("counter", count);
  };

  function imgPreloader() {
    this.images = new Array();

    this.addImages = function (images) {
      var self = this;

      if (!images) return;

      if (Array.isArray(images)) {
        images.forEach(function (ele) {
          var _image = new Image();
          _image.src = ele;
          _image.className = "animation";
          self.images.push(_image);
        });
      }
    };

    return this;
  }

  function soundPreloader() {
    this.sounds = new Array();

    this.addSounds = function (sounds) {
      var self = this;

      if (!sounds) return;

      if (Array.isArray(sounds)) {
        sounds.forEach(function (ele) {
          var sound = new Audio();
          sound.src = ele;
          self.sounds.push(sound);
        });
      }
    };

    return this;
  }

  // should probably be exported to a separate function
  const img1 = new imgPreloader();
  img1.addImages(["./img/kiryu-1.gif"]);
  cachedImages.push(img1);
  const img2 = new imgPreloader();
  img2.addImages(["./img/kiryu-2.gif"]);
  cachedImages.push(img2);
  const img3 = new imgPreloader();
  img3.addImages(["./img/kiryu-3.gif"]);
  cachedImages.push(img3);

  const sound1 = new soundPreloader();
  sound1.addSounds(["./sound/kiryu-1.mp3"]);
  cachedSounds.push(sound1);
  const sound2 = new soundPreloader();
  sound2.addSounds(["./sound/kiryu-2.mp3"]);
  cachedSounds.push(sound2);
  const sound3 = new soundPreloader();
  sound3.addSounds(["./sound/kiryu-3.mp3"]);
  cachedSounds.push(sound3);

  const playAnimationNew = (mediaSelector) => {
    console.log(cachedImages[mediaSelector - 1]);
    const image = cachedImages[mediaSelector - 1].images[0].cloneNode(true);

    const audio = cachedSounds[mediaSelector - 1].sounds[0].cloneNode(true);
    animationContainer.appendChild(image);
    audio.volume = 0.5;
    audio.play();

    timeline([
      // [
      //   image,
      //   { x: "-100%" },
      //   { duration: 0.001 },
      //   { easing: "ease-in" },
      //   { visibility: "visible" },
      // ],
      [
        image,
        { x: "52vw" },
        { duration: 1 },
        { easing: "ease-in" },
        { transformOrigin: "center center" },
        // { visibility: "visible" },
      ],
      [
        image,
        { x: "calc(100vw + 265px)" },
        { duration: 1 },
        { easing: "ease-in" },
      ],
    ]).finished.then(() => {
      image.remove();
      audio.remove();
      // audioElement.remove();
    });
  };

  playBtn.addEventListener("click", (e) => {
    // playAnimation("./assets/img/kiryu-1.gif", "./assets/sound/kiryu-1.mp3", 1);
    updateCounter();

    const mediaSelector = Math.floor(Math.random() * 4 + 1);

    // playAnimation(mediaSelector === 4 ? 3 : mediaSelector);
    playAnimationNew(mediaSelector === 4 ? 3 : mediaSelector);
  });

  // end of load listener
});
