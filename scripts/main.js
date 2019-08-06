console.log("Script loaded");
//DOM element
const emojiListElem = document.querySelector(".emojiList > ul");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#search-categories");
const favoriteListElem = document.querySelector(".favoriteList > ul");

//global variable
let listOfEmoji;
let categoryList = [];
let emojisFavorite = [];

/**
 * fetch api
 * api link: https://raw.githubusercontent.com/amio/emoji.json/master/emoji.json
 *
 */
function emojiFetch() {
  const url =
    "https://raw.githubusercontent.com/amio/emoji.json/master/emoji.json";
  fetch(url)
    .then(response => response.json())
    .then(data => {
      listOfEmoji = data;
      categoryList = addToCategory(listOfEmoji);
      renderList(listOfEmoji);

      //loading favorite list
      emojisFavorite = JSON.parse(
        localStorage.getItem("emojisFavorite") || "[]"
      );
      renderList(emojisFavorite, favoriteListElem);
    });
}

/**
 * render list of emojis to html file
 *
 * @param {array} listOfEmoji => list of emojis
 */
function renderList(listOfEmoji, listElem = emojiListElem) {
  listElem.innerHTML = "";

  //emoji list
  listOfEmoji.forEach(emoji => {
    const emojiElem = document.createElement("li");

    const emojiSpan = document.createElement("div");
    emojiSpan.innerHTML = emoji.char;
    emojiSpan.classList.add("emoji");
    emojiElem.appendChild(emojiSpan);

    const nameSpan = document.createElement("div");
    nameSpan.innerHTML = emoji.name;
    nameSpan.classList.add("emojiName");
    emojiElem.appendChild(nameSpan);

    //save to clipboard
    emojiElem.addEventListener("click", () => {
      writeToClipboard(emoji.char);
      saveToFavorite(emoji);
    });

    listElem.appendChild(emojiElem);
  });

  //full category select element
  categoryList.forEach(category => {
    const categoryElem = document.createElement("option");
    categoryElem.innerHTML = category;
    categorySelect.appendChild(categoryElem);
  });
}

/**
 * filter emojis
 *
 * @param {string} searchStr => word that we looking for
 * @param {array} listOfEmoji => array of emojis
 * @param {string} searchOption => option of search
 * @returns => array of filtered emojis
 */
function searchEmoji(searchStr, listOfEmoji, searchOption) {
  return listOfEmoji.filter(emoji => {
    return emoji[searchOption].includes(searchStr);
  });
}

/**
 * add to category list
 *
 * @param {array} listOfEmoji
 * @returns
 */
function addToCategory(listOfEmoji) {
  let categoryList = [];
  listOfEmoji.forEach(emoji => {
    const category = emoji.category;
    if (!categoryList.includes(category)) {
      categoryList.push(category);
    }
  });
  return categoryList;
}

/**
 * save a emoji that clicked on localstorage
 *
 * @param {Object} emoji => emoji object from json data
 */

function saveToFavorite(emoji) {
  //modifying localstorage
  if (!emojisFavorite.includes(emoji)) {
    emojisFavorite.push(emoji);
  }

  if (emojisFavorite.length >= 10) {
    emojisFavorite.shift();
  }
  //saving to localstorage
  localStorage.setItem("emojisFavorite", JSON.stringify(emojisFavorite));

  //render favorite list
  renderList(emojisFavorite, favoriteListElem);
}

function filterByCategory() {
  let listOfFilteredEmoji;
  if (categorySelect.value === "all") {
    listOfFilteredEmoji = listOfEmoji;
  } else {
    listOfFilteredEmoji = searchEmoji(
      categorySelect.value,
      listOfEmoji,
      "category"
    );
  }
  return listOfFilteredEmoji;
}

searchInput.addEventListener("keyup", () => {
  const listOfFilteredEmoji = searchEmoji(
    searchInput.value,
    filterByCategory(),
    "name"
  );
  renderList(listOfFilteredEmoji);
});

categorySelect.addEventListener("change", () => {
  searchInput.value = "";
  renderList(filterByCategory());
});

emojiFetch();
