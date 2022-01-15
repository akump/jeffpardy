<script>
  import { onMount } from "svelte";
  import { sanitizeText, sleep } from "./helper.js";
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

  let showReplay = localStorage.getItem("showReplay");
  if (showReplay === null) {
    localStorage.setItem("showReplay", false);
  }
  showReplay = showReplay === "true";

  let tutorialLearned = localStorage.getItem("tutorialLearned");
  if (tutorialLearned === null || tutorialLearned === "null") {
    localStorage.setItem("tutorialLearned", null);
  } else {
    tutorialLearned = true;
  }

  function setAnswerVisible() {
    const answer = document.getElementById("answer");
    if (answer && answer.style.visibility === "visible" && showReplay) {
      location.reload();
    }
    localStorage.setItem("tutorialLearned", true);
    const tutorial = document.getElementById("tutorial");
    if (tutorial) {
      document.getElementById("tutorial").style.display = "none";
    }
    if (answer) {
      answer.style.visibility = "visible";
    }
  }

  function handleSettingsClick() {
    showSettings = !showSettings;
  }

  function alwaysShowAnswerHandler(e) {
    const { checked } = e.target;
    localStorage.setItem("alwaysShowAnswer", checked);
    alwaysShowAnswer = checked;
  }

  function showReplayHandler(e) {
    const { checked } = e.target;
    localStorage.setItem("showReplay", checked);
    showReplay = checked;
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
    question = sanitizeText(data.question, true);
    answer = `What's ${sanitizeText(data.answer)}?`;
    category = data.category.title;
    price = data.value ? `$${data.value}` : "Final Jeopardy";
    header = `${category} - ${price}`;
    if (alwaysShowAnswer) {
      setAnswerVisible();
    }
  }

  onMount(onMountHandler);
</script>

<svelte:body on:click={setAnswerVisible} />

<main>
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
    <h3>
      Create bug reports on <a
        href="https://github.com/akump/jeffpardy/issues"
        target="_blank">Github</a
      >
    </h3>

    <h3 class="checkbox-setting">
      <label style="padding-right: 5px" for="showAnswer"
        >Always show answer</label
      >
      <input
        on:change={(e) => alwaysShowAnswerHandler(e)}
        bind:checked={alwaysShowAnswer}
        style="margin: 0; width: 20px; height: 20px;"
        type="checkbox"
        id="showAnswer"
      />
    </h3>

    <h3 class="checkbox-setting">
      <label style="padding-right: 5px" for="showReplay"
        >Click to reload page</label
      >
      <input
        on:change={(e) => showReplayHandler(e)}
        bind:checked={showReplay}
        style="margin: 0; width: 20px; height: 20px;"
        type="checkbox"
        id="showAnswer"
      />
    </h3>
  {:else}
    <h1 class="header">{header}</h1>
    <h2 class="question">{question}</h2>
    <div id="tutorial" class="tutorial" style="display: none;">
      <h2>
        Click/tap the screen to show the answer. Refresh the page for new
        questions.
      </h2>
    </div>
    <div id="answer" class="answer">
      <h2 id="hiddenAnswer">{answer}</h2>
      {#if showReplay}
        <span class="replay material-icons">replay</span>
      {/if}
    </div>
  {/if}
</main>

<style>
  .replay {
    font-size: 48px;
    cursor: pointer;
  }
  .checkbox-setting {
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

  #answer {
    visibility: hidden;
  }

  .answer {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 8px;
    flex-direction: column;
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
  }
</style>
