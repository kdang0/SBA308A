import {
  generateRandNum,
  validateQuery,
  isCorrect,
  convertToURL,
} from "./calculation.js";

import { createPanelItem, createSprite, createText } from "./panel.js";

const form = document.getElementById("pokeForm");
const entry = form.elements["entry"];
export const pokeSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species`;
export const pokeEvolUrl = `https://pokeapi.co/api/v2/evolution-chain`;
export const pokeUrl = `https://pokeapi.co/api/v2/pokemon`;

//generates pokemon information based on given ID
export const generatePokemon = async (id) => {
  const promise1 = isNaN(id)
    ? await axios.get(convertToURL(id))
    : await axios.get(pokeSpeciesUrl + `/${id}`);
  const promise2 = await axios
    .get(promise1.data.evolution_chain.url)
    //error handling through axios
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
  const promise3 = isNaN(id)
    ? await axios.get(pokeUrl + `/${promise1.data.id}`).catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      })
    : await axios.get(pokeUrl + `/${id}`).catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  const pokemon = Promise.all([promise2, promise3]).then(
    ([evolChain, physical]) => {
      let current = evolChain.data.chain.evolves_to;
      let counter = 1;
      const typeArr = [];
      while (current.length > 0) {
        if (evolChain.data.chain.species.name === physical.data.species.name) {
          break;
        } else if (current[0].species.name === physical.data.species.name) {
          counter++;
          break;
        }
        counter++;
        current = current[0].evolves_to;
      }
      for (let i = 0; i < physical.data.types.length; i++) {
        typeArr.push(physical.data.types[i].type.name);
      }
      return {
        evolutionStages: counter,
        color: promise1.data.color.name,
        weight: physical.data.weight,
        height: physical.data.height,
        name: physical.data.species.name,
        generation: promise1.data.generation.name.split("-").slice(1).join("-"),
        type: typeArr,
        sprite: physical.data.sprites.front_default,
      };
    }
  );
  // console.log(pokemon);
  return pokemon;
};

//generates random pokemon
const generateRandPokemon = async () => {
  const res = await axios.get(pokeSpeciesUrl).catch(function (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
  const totalCount = res.data.count;
  const pokeId = generateRandNum(1, totalCount);
  const pokemon = await generatePokemon(pokeId);
  return pokemon;
};

//grabs pokemon names database
const getPokemonDB = async () => {
  const res = await axios
    .get(pokeSpeciesUrl + `?offset=0&limit=1025`)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
  const data = res.data;
  console.log(data.results);
  return data.results;
};

const rand_pokemon = await generateRandPokemon();
console.log(rand_pokemon);

export const pokeDB = await getPokemonDB();

//upon submitting guess, will check if the guess is correct
//if not will check which categories are correct
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await validateQuery(entry.value);
  console.log(res);

  if (res) {
    const result = await isCorrect(entry.value, rand_pokemon);

    const body = document.querySelector("body");
    const randNum = generateRandNum(1, 500);
    createPanelItem(
      "generation",
      result.generation.value,
      result.generation.color,
      randNum
    );
    createPanelItem(
      "evolution",
      result.evolutionStages.value,
      result.evolutionStages.color,
      randNum
    );
    createPanelItem("type", result.type.value, result.type.color, randNum);
    createPanelItem(
      "weight",
      result.weight.arrow,
      result.weight.color,
      randNum
    );
    createPanelItem(
      "height",
      result.height.arrow,
      result.height.color,
      randNum
    );
    createPanelItem("color", result.color.value, result.color.color, randNum);
    const boxes = document.querySelectorAll(`.res${randNum}`);
    body.scrollTop = boxes.scrollHeight;
    const guessPanel = document.querySelector(`#guessContainer`);
    var tl = gsap.timeline();
    var tl2 = gsap.timeline();
    tl.fromTo(boxes, { opacity: 0 }, { opacity: 1, stagger: 0.5 });

    //if the guessed pokemon has the same name as the randomly generated pokemon then load up the winning screen
    const isSameName = result.name === rand_pokemon.name;
    if (isSameName) {
      setTimeout(() => {
        createSprite(rand_pokemon.sprite);
        createText();
        const pokemon = document.querySelector(".pokeImage");
        const text = document.querySelector("#winner");
        const button = document.querySelector("#replayButton");
        body.classList.add("hidden");
        tl.to(guessPanel, {
          opacity: 0,
          onComplete: () => {
            guessPanel.remove();
          },
        });
        tl.to(pokemon, {
          opacity: 1,
          y: 600,
          ease: "bounce.out",
          duration: 2,
        });
        tl.fromTo(
          text,
          { scale: 0 },
          { scale: 1, ease: "bounce.out", duration: 0.5 },
          ">"
        );
        tl.from(button, { scale: 0, ease: "bounce.out" });
      }, 3000);
      tl2.timeline();
    }
  } else {
    window.alert("Not a valid pokemon");
  }
  entry.value = "";
});
