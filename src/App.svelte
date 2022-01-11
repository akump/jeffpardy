<script>
  import { onMount } from "svelte";
  let question = "";
  let answer = "";
  let category = "";
  let price = "";
  let attempts = 0;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function handleMouseDown() {
    document.getElementById("hiddenAnswer").style.visibility = "visible";
  }

  async function getQuestion() {
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
      return getQuestion();
    }
    question = data.question;
    answer = `What's ${data.answer}?`;
    category = data.category.title;
    price = data.value || 0;
  }

  onMount(getQuestion);
</script>

<main on:mousedown={handleMouseDown}>
  <span class="settings material-icons">settings</span>
  <h1 class="category">{category} - ${price}</h1>
  <h1 class="question">{question}</h1>
  <div id="answer" class="answer">
    <h1 id="hiddenAnswer">{answer}</h1>
  </div>
</main>

<style>
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

  .category {
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
