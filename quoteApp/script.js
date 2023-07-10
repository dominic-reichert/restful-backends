const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const btn = document.querySelector("button");

function getQuote() {
  fetch("https://dummy-apis.netlify.app/api/quote")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      quote.innerText = data.quote;
      author.innerText = data.author;
    });
}

btn.addEventListener("click", getQuote);
