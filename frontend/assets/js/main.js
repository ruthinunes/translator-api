const setSelectLanguage = () => {
  const buttons = document.querySelectorAll(".translator__button");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      displayLanguages(event.currentTarget);
    });
  });
};

const fetchLanguages = async () => {
  try {
    const response = await fetch("https://translator-api.macao.net/languages");
    const data = await response.json();
    const languages = data.data.languages;
    populateLanguageOptions(languages);
  } catch (error) {
    console.error("Erro ao buscar os idiomas:", error);
  }
};

const populateLanguageOptions = (languages) => {
  const inputOptionsContainer = document.querySelector(
    ".translator__select--input .translator__options"
  );
  const outputOptionsContainer = document.querySelector(
    ".translator__select--output .translator__options"
  );

  inputOptionsContainer.innerHTML = ""; // clear all existing options
  outputOptionsContainer.innerHTML = ""; // clear all existing options

  languages.forEach((option) => {
    const optionDiv = document.createElement("div");

    addClass(optionDiv, "translator__option");
    optionDiv.textContent = option.name;
    optionDiv.dataset.value = option.language;

    inputOptionsContainer.appendChild(optionDiv.cloneNode(true));
    outputOptionsContainer.appendChild(optionDiv.cloneNode(true));
  });

  // add click events for the new options
  setSelectedLanguage(
    inputOptionsContainer,
    inputOptionsContainer.previousElementSibling
  );
  setSelectedLanguage(
    outputOptionsContainer,
    outputOptionsContainer.previousElementSibling
  );
};

const displayLanguages = (button) => {
  const icon = button.querySelector(".translator__icon");
  const languagesContainer = button.nextElementSibling;

  toggleElement(icon, "toggle");
  toggleElement(languagesContainer, "active");
  setSelectedLanguage(languagesContainer, button);
};

const setSelectedLanguage = (container, button) => {
  const languages = container.querySelectorAll(".translator__option");

  languages.forEach((option) => {
    option.addEventListener("click", (event) => {
      handleSelectedLangage(event, button, container);
    });
  });
};

const handleSelectedLangage = (event, button, container) => {
  const selectedLanguage = event.target;

  if (selectedLanguage) {
    // remove 'selected' class from others options
    const siblings = container.querySelectorAll(".translator__option");
    siblings.forEach((sibling) => removeClass(sibling, "selected"));

    // add 'selected' class in the selected option
    addClass(selectedLanguage, "selected");

    enableInputTextarea(button);
    updateInputText(selectedLanguage.textContent, button, container);
    updatePlaceholders(selectedLanguage.textContent, button);
    updateOppositeContainer(selectedLanguage.textContent, button);
  }
};

const updateInputText = (language, button, container) => {
  const inputText = button.querySelector(".translator__text");
  const icon = button.querySelector(".translator__icon");

  inputText.textContent = language;
  removeClass(icon, "toggle");
  removeClass(container, "active");
};

const enableInputTextarea = (button) => {
  const parentBox = button.closest(".translator__box");
  const textarea = parentBox.querySelector("textarea");

  if (textarea.id === "input-text") {
    textarea.disabled = false;
  }
};

const updatePlaceholders = (option, button) => {
  const parentBox = button.closest(".translator__box");
  const inputTextarea = document.getElementById("input-text");
  const outputTextarea = document.getElementById("output-text");

  if (inputTextarea && outputTextarea) {
    if (parentBox.querySelector(".translator__select--input")) {
      inputTextarea.placeholder = "Digite o texto";
    }
    if (parentBox.querySelector(".translator__select--output")) {
      outputTextarea.placeholder = `Tradução em ${option}`;
    }
  }
};

const updateOppositeContainer = (selectedOption, button) => {
  const isInputFilter = button.closest(".translator__select--input");
  const oppositeContainer = document.querySelector(
    isInputFilter
      ? ".translator__select--output .translator__options"
      : ".translator__select--input .translator__options"
  );

  const languages = oppositeContainer.querySelectorAll(".translator__option");

  languages.forEach((option) => {
    if (option.textContent === selectedOption) {
      option.style.display = "none";
    } else {
      option.style.display = "";
    }
  });
};

const setButtonTranslate = () => {
  const button = document.querySelector(".button");
  button.addEventListener("click", translate);
};

const translate = () => {
  const inputTextElem = document.getElementById("input-text");
  const outputTextElem = document.getElementById("output-text");
  const inputLanguageDropdown = document.querySelector(
    ".translator__select--input .translator__options"
  );
  const outputLanguageDropdown = document.querySelector(
    ".translator__select--output .translator__options"
  );

  const selectedInputLanguage =
    inputLanguageDropdown.querySelector(".selected");
  const selectedOutputLanguage =
    outputLanguageDropdown.querySelector(".selected");

  if (!selectedInputLanguage || !selectedOutputLanguage) {
    alert("Por favor, selecione os idiomas de entrada e saída.");
    return;
  }

  const inputText = inputTextElem.value;
  const inputLanguage = selectedInputLanguage.dataset.value;
  const outputLanguage = selectedOutputLanguage.dataset.value;

  fetch("https://translator-api.macao.net/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputText,
      inputLanguage,
      outputLanguage,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      outputTextElem.value = data.translatedText;
    })
    .catch((error) => {
      console.log(error);
    });
};

// reusable functions
const toggleElement = (element, className) => {
  element.classList.toggle(className);
};

const addClass = (element, className) => {
  element.classList.add(className);
};

const removeClass = (element, className) => {
  element.classList.remove(className);
};

window.addEventListener("DOMContentLoaded", () => {
  setSelectLanguage();
  fetchLanguages();
  setButtonTranslate();
});
