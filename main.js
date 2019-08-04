console.log("Script loaded");
//DOM element
const emojiListElem = document.querySelector(".emojiList");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#categories");
console.log(categorySelect);

//global variable
let listOfEmoji;
let categoryList = [];

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
    });
}

/**
 * render list of emojis to html file
 *
 * @param {array} listOfEmoji => list of emojis
 */
function renderList(listOfEmoji) {
  emojiListElem.innerHTML = "";

  //emoji list
  listOfEmoji.forEach(emoji => {
    const emojiElem = document.createElement("li");

    const emojiSpan = document.createElement("span");
    emojiSpan.innerHTML = emoji.char;
    emojiSpan.classList.add("emoji");
    emojiElem.appendChild(emojiSpan);

    const nameSpan = document.createElement("span");
    nameSpan.innerHTML = emoji.name;
    nameSpan.classList.add("emojiName");
    emojiElem.appendChild(nameSpan);

    //save to clipboard
    emojiElem.addEventListener("click", () => {
      writeToClipboard(emoji.char);
    });

    emojiListElem.appendChild(emojiElem);
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

searchInput.addEventListener("keyup", () => {
  const listOfFilteredEmoji = searchEmoji(
    searchInput.value,
    listOfEmoji,
    "name"
  );
  renderList(listOfFilteredEmoji);
});

categorySelect.addEventListener("change", () => {
  const listOfFilteredEmoji = searchEmoji(
    categorySelect.value,
    listOfEmoji,
    "category"
  );
  renderList(listOfFilteredEmoji);
});

emojiFetch();
