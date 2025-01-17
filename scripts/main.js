console.log("Script loaded");
//DOM element
const emojiListElem = document.querySelector(".emojiList > ul");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#search-categories");
const favoriteListElem = document.querySelector(".favoriteList > ul");

//global variable
let listOfEmoji;

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

      //loading favorite list
      emojisFavorite = JSON.parse(
        localStorage.getItem("emojisFavorite") || "[]"
      );

      //full category select element
      const categoryList = addToCategory(listOfEmoji);
      categoryList.forEach(category => {
        const categoryElem = document.createElement("option");
        categoryElem.innerHTML = category;
        categorySelect.appendChild(categoryElem);
      });

      renderList(emojisFavorite, favoriteListElem);
      renderList(listOfEmoji);
    });
}

/**
 * render list of emojis to html file
 *
 * @param {array} listOfEmoji => list of emojis
 */
function renderList(listOfEmoji, listElem = emojiListElem) {
  listElem.innerHTML = "";

  listOfEmoji = chunkEmojiList(listOfEmoji, 30);
  //emoji list
  listOfEmoji.forEach(list => {
    setTimeout(() => {
      createEmojiList(list, listElem);
    }, 0);
  });
}

/**
 * load batch of data in list on html
 *
 * @param {array} list
 * @param {DomElement} listElem
 */
function createEmojiList(list, listElem) {
  list.forEach(emoji => {
    const emojiElem = document.createElement("li");

    const emojiDiv = document.createElement("div");
    emojiDiv.innerHTML = emoji.char;
    emojiDiv.classList.add("emoji");
    emojiElem.appendChild(emojiDiv);

    const nameDiv = document.createElement("div");
    nameDiv.innerHTML = emoji.name;
    nameDiv.classList.add("emojiName");
    emojiElem.appendChild(nameDiv);

    //save to clipboard
    emojiElem.addEventListener("click", () => {
      writeToClipboard(emoji.char);
      saveToFavorite(emoji);
    });

    listElem.appendChild(emojiElem);
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
 * chunk a emoji list
 *
 * @param {array} list
 * @param {number} sizeOfChunk
 * @returns chunked array
 */
function chunkEmojiList(list, sizeOfChunk) {
  let result = [];
  for (let i = 0; i < list.length; i += sizeOfChunk) {
    let chunk = list.slice(i, i + sizeOfChunk);
    result.push(chunk);
  }
  return result;
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
    const category = emoji.category.split("(")[0];
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
  emojisFavorite.unshift(emoji);

  emojisFavorite = emojisFavorite.filter((emoji, index) => {
    return emojisFavorite.indexOf(emoji) === index;
  });

  if (emojisFavorite.length >= 10) {
    emojisFavorite.pop();
  }
  //saving to localstorage
  localStorage.setItem("emojisFavorite", JSON.stringify(emojisFavorite));

  //render favorite list
  renderList(emojisFavorite, favoriteListElem);
}

/**
 * filtered emoji with category
 *
 * @returns => list of emoji filtered by category
 */
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
