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

  const cachedAssets = {};

  let count = 0;
  const localCounter = localStorage.getItem("counter");
  if (localCounter) {
    counter.textContent = "...";
    count = JSON.parse(localCounter);

    counter.textContent = count;
  }

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

  const updateCounter = () => {
    const number = count;
    counter.innerText = count + 1;
    count++;
    localStorage.setItem("counter", count);
  };

  async function fetchAndCacheResources(imageUrl, audioUrl, mediaSelector) {
    try {
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageUrl}`);
      }

      const audioResponse = await fetch(audioUrl);
      if (!audioResponse.ok) {
        throw new Error(`Failed to fetch audio: ${audioUrl}`);
      }

      const cache = await caches.open("kiryuCache");

      const imageBlob = await imageResponse.blob();
      const audioBlob = await audioResponse.blob();

      // console.log(imageBlob, audioBlob);

      await cache.put(`image${mediaSelector}`, new Response(imageBlob));
      await cache.put(`audio${mediaSelector}`, new Response(audioBlob));

      console.log("Resources cached successfully.");
    } catch (error) {
      console.error("Error fetching and caching resources:", error);
    }
  }
  async function checkIfKeyExistsInCache(cacheName, key) {
    try {
      const cache = await caches.open(cacheName);
      const response = await cache.match("./" + key, { ignoreVary: true });

      if (response) {
        console.log(`Key "${key}" found in cache.`);
        return response;
      } else {
        console.log(`Key "${key}" not found in cache.`);
        return false;
      }
    } catch (error) {
      console.error("Error checking cache:", error);
      return false;
    }
  }

  const playAnimation = async (mediaSelector) => {
    // const imageBlob = cachedAssets[image];
    // const audioBlob = cachedAssets[audio];

    const image = await checkIfKeyExistsInCache(
      "kiryuCache",
      `image${mediaSelector}`
    );
    const audio = await checkIfKeyExistsInCache(
      "kiryuCache",
      `audio${mediaSelector}`
    );

    // console.log(image.blob, audio);

    if (image && audio) {
      const imageUrlBlob = URL.createObjectURL(new Blob([image.blob]));
      const audioUrlBlob = URL.createObjectURL(new Blob([audio.blob]));

      console.log(imageUrlBlob, audioUrlBlob);

      const imgElement = document.createElement("img");

      // imgElement.src = imageUrlBlob;

      // testing
      imgElement.src = imageUrlBlob;
      imgElement.className = "animation";

      // const audioElement = new Audio(audioUrlBlob);
      // testing
      const audioElement = new Audio(audioUrlBlob);
      audioElement.crossOrigin = "anonymous";

      animationContainer.appendChild(imgElement);
      animationContainer.appendChild(audioElement);
      audioElement
        .play()
        .then(() => {
          // Audio is playing.
        })
        .catch((error) => {
          console.log(error);
        });

      timeline([
        [
          imgElement,
          { x: "-100%" },
          { duration: 0.001 },
          { easing: "ease-in" },
          { visibility: "hidden" },
        ],
        [
          imgElement,
          { x: "35vw" },
          { duration: 1 },
          { easing: "ease-in" },
          { transformOrigin: "center center" },
        ],
        [imgElement, { x: "100vw" }, { duration: 1 }, { easing: "ease-in" }],
      ]).finished.then(() => {
        imgElement.remove();
        audioElement.remove();
        URL.revokeObjectURL(new Blob([image.blob]));
        URL.revokeObjectURL(new Blob([audio.blob]));
      });

      // const audioEl = new Audio("./sound/kiryu-1.mp3");
      // audioEl.play();
    } else {
      fetchAndCacheResources(
        `./img/kiryu-${mediaSelector}.gif`,
        `./sound/kiryu-${mediaSelector}.mp3`,
        mediaSelector
      );
      // fetchAndCacheResources(image1, sound1, mediaSelector);
    }
  };

  playBtn.addEventListener("click", (e) => {
    // playAnimation("./assets/img/kiryu-1.gif", "./assets/sound/kiryu-1.mp3", 1);
    updateCounter();

    const mediaSelector = Math.floor(Math.random() * 4 + 1);

    playAnimation(mediaSelector === 4 ? 3 : mediaSelector);
  });

  // end of load listener
});
