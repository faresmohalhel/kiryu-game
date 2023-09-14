import "./style.css";
import { animate, timeline } from "motion";
import gsap from "gsap";
window.addEventListener("load", (e) => {
  const kiryuTattooContainer = document.getElementById(
    "kiryu-tattoo-container"
  );
  const kiryuTattoo = document.getElementById("kiryu-tattoo");

  const tl = new gsap.timeline();
  // tl.from(kiryuTattooContainer, {
  //   x: "150%",
  //   duration: 1,
  //   ease: "power2.Out",
  //   // onComplete() {
  //   //   timeline([[".cls-1", draw(1), { duration: 2 }]]);
  //   // },
  // }).to(
  //   kiryuTattooContainer,
  //   {
  //     x: "-100%",
  //     duration: 2,
  //     ease: "power2.Out",
  //   },
  //   "<4"
  // );

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

  // end of load listener
});
