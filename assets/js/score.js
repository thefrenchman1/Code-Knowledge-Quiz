function printHighscores() {
  var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];

  highscores.sort((a, b) => b.score - a.score);

  highscores.forEach(score => {
    var liTag = document.createElement("li");
    liTag.textContent = `${score.initials} - ${score.score}`;

    var olEl = document.getElementById("highscores");
    olEl.appendChild(liTag);
  });
}

function clearHighscores() {
  window.localStorage.removeItem("highscores");
  window.location.reload();
}

document.getElementById("clear-btn").addEventListener("click", clearHighscores);

printHighscores();
