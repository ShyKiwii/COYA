const storyElement = document.getElementById("story");
const choicesElement = document.getElementById("choices");
const skipButton = document.getElementById("skipBtn");
const nameSection = document.getElementById("nameSection");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");

let enteredName = "";
let story = null;
let skipTyping = false;
let loadingDotsInterval = null;
const selectedChoices = new Set();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startLoadingIndicator() {
    stopLoadingIndicator();
    let dotCount = 0;
    const updateText = () => {
        const dots = ".".repeat(dotCount || 0);
        storyElement.textContent = `Loading${dots}`;
    };

    updateText();
    loadingDotsInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        updateText();
    }, 400);
}

function stopLoadingIndicator() {
    if (loadingDotsInterval) {
        clearInterval(loadingDotsInterval);
        loadingDotsInterval = null;
    }
}

async function loadJson() {
    startLoadingIndicator();
    const loadingStartedAt = Date.now();

    try {
        const response = await fetch("story.json");
        if (!response.ok) {
            throw new Error(`Failed to load story: ${response.status}`);
        }

        story = await response.json();

        const elapsed = Date.now() - loadingStartedAt;
        if (elapsed < 600) {
            await delay(600 - elapsed);
        }

        nameSection.hidden = false;
        userInput.focus();
    } catch (error) {
        console.error(error);
        stopLoadingIndicator();
        storyElement.textContent = "Error loading story.";
        choicesElement.innerHTML = "";
        skipButton.hidden = true;
    }
}

function logSceneError(sceneKey, details = {}) {
    const message = `Error: Could not find scene "${sceneKey}".`;
    console.error(message, details);
    storyElement.textContent = message;
    choicesElement.innerHTML = "";
    skipButton.hidden = true;
}

async function typeText(text, element, speed = 15) {
    skipTyping = false;
    element.textContent = "";

    for (let i = 0; i < text.length; i++) {
        if (skipTyping) {
            element.textContent = text;
            return;
        }

        element.textContent += text[i];
        await delay(speed);
    }
}

async function changeScene(sceneKey, fromSceneKey = null) {
    if (!story) {
        await loadJson();
    }

    const scene = story[sceneKey];
    if (!scene) {
        logSceneError(sceneKey, {
            fromSceneKey,
            enteredName
        });
        return;
    }

    skipButton.hidden = false;
    const sceneText = scene.text.replaceAll("[enteredName]", enteredName);

    choicesElement.innerHTML = "";
    await typeText(sceneText, storyElement);
    skipButton.hidden = true;

    scene.choices.forEach(choice => {
        if (selectedChoices.has(choice.id)) return;

        if (!choice || !choice.next || !story[choice.next]) {
            logSceneError(choice?.next || "<missing>", {
                fromSceneKey: sceneKey,
                choiceId: choice?.id,
                choiceText: choice?.text,
                enteredName
            });
            return;
        }

        const button = document.createElement("button");
        button.textContent = choice.text;
        button.addEventListener("click", async () => {
            selectedChoices.add(choice.id);
            await changeScene(choice.next, sceneKey);
        });
        choicesElement.appendChild(button);
    });
}

skipButton.addEventListener("click", () => {
    skipTyping = true;
});

function startGame() {
    enteredName = userInput.value.trim();
    userInput.value = "";

    nameSection.hidden = true;
    changeScene("START_SCENE");
}

submitBtn.addEventListener("click", async () => {
    if (!story) {
        await loadJson();
    }

    stopLoadingIndicator();
    startGame();
});

window.addEventListener("DOMContentLoaded", () => {
    loadJson();
});