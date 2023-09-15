// note this is not working and needs fixing
export async function fetchAndCacheResources(
  imageUrl,
  audioUrl,
  mediaSelector
) {
  try {
    const imageFullUrl = "http://localhost:5173/" + imageUrl;
    console.log(imageFullUrl);
    const imageResponse = await fetch(imageFullUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageUrl}`);
    }
    console.log(imageResponse);

    const audioResponse = await fetch("http://localhost:5173/" + audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio: ${audioUrl}`);
    }

    const cache = await caches.open("kiryuCache");

    const imageBlob = await imageResponse.blob();
    const audioBlob = await audioResponse.blob();

    // console.log(imageBlob, audioBlob);

    await cache.add(
      `image${mediaSelector}`,
      "http://localhost:5173/" + imageUrl
    );
    await cache.add(
      `audio${mediaSelector}`,
      "http://localhost:5173/" + audioUrl
    );
    // await cache.put(`image${mediaSelector}`, new Response(imageBlob));
    // await cache.put(`audio${mediaSelector}`, new Response(audioBlob));

    console.log("Resources cached successfully.");
  } catch (error) {
    console.error("Error fetching and caching resources:", error);
  }
}

export async function checkIfKeyExistsInCache(cacheName, key) {
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

export const playAnimation = async (mediaSelector) => {
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
    const imageUrlBlob = URL.createObjectURL(
      new Blob([image.blob], { type: "image/gif" })
    );
    const audioUrlBlob = URL.createObjectURL(
      new Blob([audio.blob], { type: "audio/mpeg" })
    );

    // console.log(imageUrlBlob, audioUrlBlob);

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
      `static/img/kiryu-${mediaSelector}.gif`,
      `static/sound/kiryu-${mediaSelector}.mp3`,
      mediaSelector
    );
    // fetchAndCacheResources(image1, sound1, mediaSelector);
  }
};
