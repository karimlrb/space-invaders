const container = document.querySelector(".grille");
const affichage = document.querySelector("h3");
let resultats = 0;
let toutesLesDivs;
let alienInvaders = [];
let tireurPosition = 229;
let direction = 1;
let width = 20;

function creationGrilleEtAliens() {
  let indexAttr = 0;

  for (i = 0; i < 240; i++) {
    if (indexAttr === 0) {
      const bloc = document.createElement("div");
      bloc.setAttribute("data-left", "true");
      container.appendChild(bloc);
      indexAttr++;
    } else if (indexAttr === 19) {
      const bloc = document.createElement("div");
      bloc.setAttribute("data-right", "true");
      container.appendChild(bloc);
      indexAttr = 0;
    } else {
      const bloc = document.createElement("div");
      container.appendChild(bloc);
      indexAttr++;
    }
  }
  // Creation des aliens
  for (let i = 1; i < 53; i++) {
    if (i === 13) {
      i = 21;
      alienInvaders.push(i);
    } else if (i === 33) {
      i = 41;
      alienInvaders.push(i);
    } else {
      alienInvaders.push(i);
    }
  }

  toutesLesDivs = document.querySelectorAll(".grille div");
  alienInvaders.forEach((invader) => {
    toutesLesDivs[invader].classList.add("alien");
  });
  toutesLesDivs[tireurPosition].classList.add("tireur");
}
creationGrilleEtAliens();

// Deplacer le vaisseau
function deplacerTireur(e) {
  toutesLesDivs[tireurPosition].classList.remove("tireur");

  if (e.keyCode === 37) {
    if (tireurPosition > 220) {
      tireurPosition--;
    }
  }
  if (e.keyCode === 39) {
    if (tireurPosition < 239) {
      tireurPosition++;
    }
  }
  toutesLesDivs[tireurPosition].classList.add("tireur");
}
document.addEventListener("keydown", deplacerTireur);

// deplacer les aliens
let descendreRight = true;
let descendreLeft = true;

function bougerLesAliens() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (toutesLesDivs[alienInvaders[i]].getAttribute("data-right") === "true") {
      if (descendreRight) {
        direction = 20;
        setTimeout(() => {
          descendreRight = false;
        }, 50);
      } else if (descendreRight === false) {
        direction = -1;
      }
      descendreLeft = true;
    } else if (
      toutesLesDivs[alienInvaders[i]].getAttribute("data-left") === "true"
    ) {
      if (descendreLeft) {
        direction = 20;
        setTimeout(() => {
          descendreLeft = false;
        }, 50);
      } else if (descendreLeft === false) {
        direction = 1;
      }
      descendreRight = true;
    }
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    toutesLesDivs[alienInvaders[i]].classList.remove("alien");
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    toutesLesDivs[alienInvaders[i]].classList.add("alien");
  }

  //Si on perd
  //   Quand on est touché
  if (toutesLesDivs[tireurPosition].classList.contains("alien", "tireur")) {
    affichage.textContent = "Game Over, les aliens sont sur terre !";
    toutesLesDivs[tireurPosition].classList.add("boom");
    clearInterval(invaderId);
  }
  // Si les aliens sont derrière nous
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > toutesLesDivs.length - width) {
      affichage.style.color = "red";
      affichage.textContent = "Game Over, les aliens sont sur terre !";
      clearInterval(invaderId);
    }
  }
}

invaderId = setInterval(bougerLesAliens, 500);

// Le laser
function tirer(e) {
  let laserId;
  let laserEnCours = tireurPosition;

  function deplacerLaser() {
    toutesLesDivs[laserEnCours].classList.remove("laser");
    laserEnCours -= width;
    toutesLesDivs[laserEnCours].classList.add("laser");

    // Faire disparaitre les aliens quand on les touches
    if (toutesLesDivs[laserEnCours].classList.contains("alien")) {
      //   Si notre div a la classe alien donc on ea touché un alien
      // On supprime le laser
      toutesLesDivs[laserEnCours].classList.remove("laser");
      // On supprime l'alien
      toutesLesDivs[laserEnCours].classList.remove("alien");
      // On ajoute l'effet boom
      toutesLesDivs[laserEnCours].classList.add("boom");

      alienInvaders = alienInvaders.filter((el) => el !== laserEnCours);

      setTimeout(
        () => toutesLesDivs[laserEnCours].classList.remove("boom"),
        250
      );
      clearInterval(laserId);
      resultats++;
      //   Si on gagne
      if (resultats === 36) {
        affichage.style.color = "lightgreen";
        affichage.textContent = "Bravo, vous avez SAUVÉ la terre !!!";
        clearInterval(invaderId);
      } else {
        affichage.textContent = ` Score : ${resultats}`;
      }
    }

    // Si le laser sort du canva on supprime la classe laser
    if (laserEnCours < width) {
      clearInterval(laserId);
      setTimeout(() => {
        toutesLesDivs[laserEnCours].classList.remove("laser");
      }, 100);
    }
  }

  if (e.keyCode === 32) {
    laserId = setInterval(deplacerLaser, 100);
    // laserId = setInterval(() => {
    //   deplacerLaser();
    // }, 100);
  }
}

document.addEventListener("keyup", tirer);
