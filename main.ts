const textareaParagraph: HTMLTextAreaElement = document.getElementById('paragraph') as HTMLTextAreaElement;
const inputWord: HTMLInputElement = document.getElementById('wordNotAllowed') as HTMLInputElement;
const btnAddWordsNotAllowed: HTMLButtonElement = document.getElementById('btnAddWordsNotAllowed') as HTMLButtonElement;
const btnValidateParagraph: HTMLButtonElement = document.getElementById('btnValidateParagraph') as HTMLButtonElement;
const btnExample1: HTMLButtonElement = document.getElementById('btnExample1') as HTMLButtonElement;
const btnExample2: HTMLButtonElement = document.getElementById('btnExample2') as HTMLButtonElement;
const btnClearAll: HTMLButtonElement = document.getElementById('btnClearAll') as HTMLButtonElement;

enum ToastColor {
  SUCCESS,
  DANGER,
  WARNING
}

let notAllowedWords: string[] = [];
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
  let letters = /^[A-Za-z]+$/;
  if (inputWord.value.length > 0)
    if (!inputWord.value.match(letters))
      setInvalidWord();
    else
      setValidWord()
}

function setInvalidWord() {
  btnAddWordsNotAllowed.classList.add("d-none")
  inputWord.classList.add("is-invalid");
}

function setValidWord() {
  btnAddWordsNotAllowed.classList.remove("d-none")
  inputWord.classList.remove("is-invalid");
}

function countingLength(input: HTMLInputElement | HTMLTextAreaElement, idElement: string): void {
  const maxLength = input.getAttribute("maxlength");
  const currentLength = input.value.length;
  const counterEle = document.getElementById(idElement) as HTMLElement;
  counterEle.innerHTML = `${currentLength}/${maxLength}`;
}

function setWordsNotAllowed() {
  let word: HTMLInputElement = document.getElementById('wordNotAllowed') as HTMLInputElement;
  let wordText = word.value.toLowerCase();
  addWord(wordText);
}

function actionValidateParagraph() {
  try {
    let paragraph: HTMLTextAreaElement = document.getElementById('paragraph') as HTMLTextAreaElement;
    if (notAllowedWords.length > 100)
      throw new Error("Words not allowed, can't be more than 100 ☠️")
    if (hasNumbers(paragraph.value))
      throw new Error("Paragraph have numbers 🔢")

    let response = validateParagraph(paragraph.value, notAllowedWords);
    let answer: HTMLSpanElement = document.getElementById("answer") as HTMLSpanElement;
    answer.textContent = response;
    actionToast("We have the answer! ✔️", ToastColor.SUCCESS)
  } catch (err: any) {
    actionToast(err.message, ToastColor.DANGER);
  }
}

function actionToast(message: string, color: ToastColor) {

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

function generateToast(color: string, message: string): void {
  let alert = document.createElement('div');
  alert.classList.add("alert", "alert-dismissible", color);
  let btnClose = document.createElement('button');
  btnClose.setAttribute('data-bs-dismiss', "alert");
  btnClose.classList.add("btn-close")
  let text = document.createElement("span")
  text.textContent = message;
  alert.appendChild(btnClose);
  alert.appendChild(text);
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

function hasNumbers(text: string): boolean {
  const regex = /\d/;
  return regex.test(text);
}

function addWord(word: string): void {
  try {
    if (word.length === 0)
      throw new Error("Word empty 😅'")
    if (notAllowedWords.includes(word))
      throw new Error("This word is already added 😅'")

    notAllowedWords.push(word);
    let words = document.getElementById('wordsNotAllowed');
    let badge = document.createElement("span");
    badge.classList.add("badge", "bg-danger", "mh-3");
    badge.innerText = word;
    words?.appendChild(badge);
    badge?.addEventListener("click",
      function (e) {
        let parent = e?.target as HTMLSpanElement;
        parent.remove();
        notAllowedWords = notAllowedWords.filter((word) => word !== parent.textContent)
      })
    actionToast("Word added!", ToastColor.SUCCESS);
  }
  catch (err: any) {
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
  let words = document.getElementById('wordsNotAllowed');
  while (words?.firstChild) {
    words.removeChild(words.lastChild as Node);
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


function validateParagraph(paragraph: string, wordsNotAllowed: string[]): string {
  let wordCutter = new Set(["!", "?", "'", ",", ";", ".", " "]);
  let notAllowed = new Set(wordsNotAllowed);
  let words = new Map();
  let buffer: string = ""
  let result: string = "";

  for (let char = 0; char < paragraph.length; char++) {
    if (!wordCutter.has(paragraph[char])) {
      buffer += paragraph[char].toLowerCase();
      if (char !== paragraph.length - 1) {
        continue;
      }
    }
    if (buffer) {
      if (!notAllowed.has(buffer)) {
        let occurrences = (words.get(buffer) || 0) + 1;
        let mostOccurrences = (words.get(result) || 0);
        words.set(buffer, occurrences);
        if (occurrences > mostOccurrences) {
          result = buffer;
        }
        else if (occurrences === mostOccurrences) {
          result = `${result},${buffer}`;
        }
      }
      buffer = "";
    }
  }
  return result;
};

// let something1 = mostCommonWord('a.', []);
// let something2 = mostCommonWord('Bob hit2 a ball, the hit2 BALL  ?  123 flew far after it was hit2.', ["hit"]);
// let something3 = mostCommonWord('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum', ["hit"]);
// console.log(something1);
// console.log(something2);