const body = document.querySelector("body");
const color = document.getElementById("hexCode");
const slider = document.querySelectorAll("input");
const redElement = document.getElementById("red");
const greenElement = document.getElementById("green");
const blueElement = document.getElementById("blue");
const btn = document.querySelector("button");

function rangeValueToHex(value) {
  value = Number.parseInt(value);
  return ("0" + value.toString(16)).substr(-2);
}

function setBackgroundColor() {
  const red = redElement.value;
  const green = greenElement.value;
  const blue = blueElement.value;

  body.style.setProperty("background-color", `rgb(${red} ${green} ${blue})`);
  color.innerText =
    "#" + rangeValueToHex(red) + rangeValueToHex(green) + rangeValueToHex(blue);
}

for (let index = 0; index < slider.length; index++) {
  const element = slider[index];
  element.addEventListener("input", setBackgroundColor);
}

setBackgroundColor();

function getRandomColor() {
  fetch("https://dummy-apis.netlify.app/api/color")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      redElement.value = data.rgb.r;
      greenElement.value = data.rgb.g;
      blueElement.value = data.rgb.b;
    });
  setBackgroundColor();
}

btn.addEventListener("click", getRandomColor);
