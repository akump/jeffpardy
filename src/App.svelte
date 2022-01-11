<script>
  import { onMount } from "svelte";
  let question = "";
  let answer = "";
  let category = "";
  let price = "";
  let attempts = 0;
  let header = "-";
  let showSettings = false;
  let alwaysShowAnswer = localStorage.getItem("alwaysShowAnswer");
  if (alwaysShowAnswer === null) {
    localStorage.setItem("alwaysShowAnswer", false);
  }
  alwaysShowAnswer = alwaysShowAnswer === "true";

  let tutorialLearned = localStorage.getItem("tutorialLearned");
  if (tutorialLearned === null || tutorialLearned === "null") {
    localStorage.setItem("tutorialLearned", null);
  } else {
    tutorialLearned = true;
  }

  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function setAnswerVisible() {
    localStorage.setItem("tutorialLearned", true);
    const tutorial = document.getElementById("tutorial");
    if (tutorial) {
      document.getElementById("tutorial").style.display = "none";
    }
    const hiddenAnswer = document.getElementById("hiddenAnswer");
    if (hiddenAnswer) {
      hiddenAnswer.style.visibility = "visible";
    }
  }

  function handleSettingsClick() {
    showSettings = !showSettings;
  }

  function showAnswerHandler(e) {
    const { checked } = e.target;
    localStorage.setItem("alwaysShowAnswer", checked);
    alwaysShowAnswer = checked;
  }

  async function onMountHandler() {
    const tutorial = document.getElementById("tutorial");
    if ((tutorial && tutorialLearned === null) || tutorialLearned === "null") {
      tutorial.style.display = "block";
    }
    const response = await fetch("https://jservice.io/api/random");
    const [data] = await response.json();
    attempts++;
    if (attempts > 5) {
      question = "Failed to find question. Refresh the page.";
      category = "Error loading";
      attempts = 0;
      return;
    }
    if (!data.question || !data.answer) {
      await sleep();
      return onMountHandler();
    }
    question = data.question;
    answer = `What's ${removeTags(data.answer)}?`;
    category = data.category.title;
    price = data.value || 0;
    header = `${category} - $${price}`;
    if (alwaysShowAnswer) {
      setAnswerVisible();
    }
  }

  onMount(onMountHandler);
</script>

<main on:click={setAnswerVisible}>
  <span on:click={handleSettingsClick} class="settings material-icons"
    >settings</span
  >
  {#if showSettings}
    <h1 class="header">Settings</h1>
    <h3 style="margin-bottom: 0">
      I build this website for free and would love your support through a small
      coffee donation at <a
        href="https://www.buymeacoffee.com/akump"
        target="_blank">buy me a coffee</a
      >
    </h3>
    <span class="material-icons">coffee</span>

    <h3 class="show-answer">
      <label style="padding-right: 5px" for="showAnswer"
        >Always show answer</label
      >
      <input
        on:change={(e) => showAnswerHandler(e)}
        bind:checked={alwaysShowAnswer}
        style="margin: 0; width: 20px; height: 20px;"
        type="checkbox"
        id="showAnswer"
      />
    </h3>
  {:else}
    <h1 class="header">{header}</h1>
    <h1 class="question">{question}</h1>
    <div id="tutorial" class="tutorial" style="display: none;">
      <h1>
        Click/tap the screen to show the answer. Refresh the page for new
        questions.
      </h1>
    </div>
    <div id="answer" class="answer">
      <h1 id="hiddenAnswer">{answer}</h1>
      <!-- <span class="material-icons">
replay
</span> -->
    </div>
  {/if}
</main>

<style>
  .show-answer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .settings {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 32px;
    cursor: pointer;
  }

  #hiddenAnswer {
    visibility: hidden;
  }

  .answer {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 8px;
  }

  .tutorial {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 8px;
  }
  .header {
    padding-bottom: 5px;
    border-bottom: 2px solid white;
  }
  main {
    text-align: center;
    padding: 0 1em 1em 1em;
    margin: 0 auto;
    height: 50vh;
  }
</style>
