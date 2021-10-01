var textareaParagraph = document.getElementById('paragraph');
var inputWord = document.getElementById('wordNotAllowed');
var btnAddWordsNotAllowed = document.getElementById('btnAddWordsNotAllowed');
var btnValidateParagraph = document.getElementById('btnValidateParagraph');
var btnExample1 = document.getElementById('btnExample1');
var btnExample2 = document.getElementById('btnExample2');
var btnClearAll = document.getElementById('btnClearAll');
var ToastColor;
(function (ToastColor) {
    ToastColor[ToastColor["SUCCESS"] = 0] = "SUCCESS";
    ToastColor[ToastColor["DANGER"] = 1] = "DANGER";
    ToastColor[ToastColor["WARNING"] = 2] = "WARNING";
})(ToastColor || (ToastColor = {}));
var notAllowedWords = [];
textareaParagraph.addEventListener("input", getParagraph);
inputWord.addEventListener("input", getWord);
btnAddWordsNotAllowed.addEventListener("click", setWordsNotAllowed);
btnValidateParagraph.addEventListener("click", actionValidateParagraph);
btnExample1.addEventListener("click", setExample1);
btnExample2.addEventListener("click", setExample2);
btnClearAll.addEventListener("click", clearAll);
function getParagraph() {
    countingLength(textareaParagraph, "paragraphHelp");
}
function getWord() {
    countingLength(inputWord, "wordHelp");
    var letters = /^[A-Za-z]+$/;
    if (inputWord.value.length > 0)
        if (!inputWord.value.match(letters))
            setInvalidWord();
        else
            setValidWord();
}
function setInvalidWord() {
    btnAddWordsNotAllowed.classList.add("d-none");
    inputWord.classList.add("is-invalid");
}
function setValidWord() {
    btnAddWordsNotAllowed.classList.remove("d-none");
    inputWord.classList.remove("is-invalid");
}
function countingLength(input, idElement) {
    var maxLength = input.getAttribute("maxlength");
    var currentLength = input.value.length;
    var counterEle = document.getElementById(idElement);
    counterEle.innerHTML = currentLength + "/" + maxLength;
}
function setWordsNotAllowed() {
    var word = document.getElementById('wordNotAllowed');
    var wordText = word.value.toLowerCase();
    addWord(wordText);
}
function actionValidateParagraph() {
    try {
        var paragraph = document.getElementById('paragraph');
        if (notAllowedWords.length > 100)
            throw new Error("Words not allowed, can't be more than 100 ☠️");
        if (hasNumbers(paragraph.value))
            throw new Error("Paragraph have numbers 🔢");
        var response = validateParagraph(paragraph.value, notAllowedWords);
        var answer = document.getElementById("answer");
        answer.textContent = response;
        actionToast("We have the answer! ✔️", ToastColor.SUCCESS);
    }
    catch (err) {
        actionToast(err.message, ToastColor.DANGER);
    }
}
function actionToast(message, color) {
    switch (color) {
        case ToastColor.DANGER:
            generateToast("alert-danger", message);
            break;
        case ToastColor.SUCCESS:
            generateToast("alert-success", message);
            break;
        case ToastColor.WARNING:
            generateToast("alert-warning", message);
            break;
        default:
            break;
    }
}
function generateToast(color, message) {
    var alert = document.createElement('div');
    alert.classList.add("alert", "alert-dismissible", color);
    var btnClose = document.createElement('button');
    btnClose.setAttribute('data-bs-dismiss', "alert");
    btnClose.classList.add("btn-close");
    var text = document.createElement("span");
    text.textContent = message;
    alert.appendChild(btnClose);
    alert.appendChild(text);
    document.body.appendChild(alert);
    setTimeout(function () {
        alert.remove();
    }, 3000);
}
function hasNumbers(text) {
    var regex = /\d/;
    return regex.test(text);
}
function addWord(word) {
    try {
        if (word.length === 0)
            throw new Error("Word empty 😅'");
        if (notAllowedWords.includes(word))
            throw new Error("This word is already added 😅'");
        notAllowedWords.push(word);
        var words = document.getElementById('wordsNotAllowed');
        var badge = document.createElement("span");
        badge.classList.add("badge", "bg-danger", "mh-3");
        badge.innerText = word;
        words === null || words === void 0 ? void 0 : words.appendChild(badge);
        badge === null || badge === void 0 ? void 0 : badge.addEventListener("click", function (e) {
            var parent = e === null || e === void 0 ? void 0 : e.target;
            parent.remove();
            notAllowedWords = notAllowedWords.filter(function (word) { return word !== parent.textContent; });
        });
        actionToast("Word added!", ToastColor.SUCCESS);
    }
    catch (err) {
        actionToast(err.message, ToastColor.DANGER);
    }
}
function setExample1() {
    cleanWords();
    addWord('hit');
    textareaParagraph.value = "Bob hit a ball, the hit BALL flew far after it was hit.";
    getWord();
    getParagraph();
}
function setExample2() {
    clearAll();
    textareaParagraph.value = "a.";
}
function cleanWords() {
    notAllowedWords = [];
    var words = document.getElementById('wordsNotAllowed');
    while (words === null || words === void 0 ? void 0 : words.firstChild) {
        words.removeChild(words.lastChild);
    }
}
function clearParagraph() {
    textareaParagraph.value = "";
}
function clearAll() {
    cleanWords();
    clearParagraph();
    getWord();
    getParagraph();
}
function validateParagraph(paragraph, wordsNotAllowed) {
    var wordCutter = new Set(["!", "?", "'", ",", ";", ".", " "]);
    var notAllowed = new Set(wordsNotAllowed);
    var words = new Map();
    var buffer = "";
    var result = "";
    for (var char = 0; char < paragraph.length; char++) {
        if (!wordCutter.has(paragraph[char])) {
            buffer += paragraph[char].toLowerCase();
            if (char !== paragraph.length - 1) {
                continue;
            }
        }
        if (buffer) {
            if (!notAllowed.has(buffer)) {
                var occurrences = (words.get(buffer) || 0) + 1;
                var mostOccurrences = (words.get(result) || 0);
                words.set(buffer, occurrences);
                if (occurrences > mostOccurrences) {
                    result = buffer;
                }
                else if (occurrences === mostOccurrences) {
                    result = result + "," + buffer;
                }
            }
            buffer = "";
        }
    }
    return result;
}
