const inputEl = document.querySelector("#input-el");
const inputBtn = document.querySelector("#input-btn");
const deleteBtn = document.querySelector("#delete-btn");
const tabBtn = document.querySelector("#tab-btn")
const ulEl = document.querySelector("#ul-el");

let myUrls = [];
const urlsFromLocalStorage = localStorage.getItem("urls");
if (urlsFromLocalStorage) {
    myUrls = JSON.parse(urlsFromLocalStorage);
    render(myUrls);
}

inputBtn.addEventListener("click", function() {
    if (validateUrl(inputEl.value)) {
        if (checkIfExistsInArray(inputEl.value)) return;
        addUrl(inputEl.value);
        inputEl.value = "";
    }
});

tabBtn.addEventListener("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        tabs.forEach((tab) => {
            if (!checkIfExistsInArray(tab.url)) addUrl(tab.url);
        })
    })
})

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear();
    myUrls = [];
    render(myUrls);
});

function render(array) {
    let listItems = [];
    for (let i = 0; i < array.length; i++) {
        const url = `<li><a href="${array[i]}" target="_blank">
                    ${array[i]}</a></li>`;
        listItems.push(url);
    }
    ulEl.innerHTML = listItems.join("");
}

function validateUrl(string) {
    if (string) {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }
    return false;
}

function addUrl(url) {
    myUrls.push(url);
    localStorage.setItem("urls", JSON.stringify(myUrls));
    render(myUrls);
}

function checkIfExistsInArray(url) {
    const currentUrls = localStorage.getItem("urls");
    if (currentUrls && JSON.parse(currentUrls).includes(url)) {
        return true;
    }
    return false;
}