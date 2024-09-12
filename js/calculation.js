import {
  pokeDB,
  generatePokemon
} from "./index.js";

export const generateRandNum = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};

export const validateQuery = async (value) => {
  return pokeDB.some((e) => e.name.toLowerCase() === value.toLowerCase());
};

export const convertToURL = (entry) => {
  const result = pokeDB.find((e) => e.name.toLowerCase() === entry.toLowerCase());
  return result.url;
}

export const isCorrect = async (source, target) => {
  const result = {};

  const pokemon = await generatePokemon(source);
  console.log(pokemon);
  //CHECK IF GENERATION MATCHES
  if (pokemon.generation === target.generation) {
    result["generation"] = { color: "#8fb935", value: pokemon.generation };
  } else {
    result["generation"] = { color: "#e64747", value: pokemon.generation };
  }
  //CHECK IF WEIGHT AND HEIGHT MATCHES
  if (pokemon.weight === target.weight) {
    result["weight"] = {color:"#8fb935", arrow:"./assets/check.png"};
  } else if (pokemon.weight > target.weight) {
    result["weight"] = { color: "#e64747", arrow: "./assets/down_arrow.png" };
  } else {
    result["weight"] = { color: "#e64747", arrow: "./assets/up_arrow.png" };
  }

  if (pokemon.height === target.height) {
    result["height"] = {color:"#8fb935", arrow:"./assets/check.png"};
  } else if (pokemon.height > target.height) {
    result["height"] = { color: "#e64747", arrow: "./assets/down_arrow.png" };
  } else {
    result["height"] = { color: "#e64747", arrow: "./assets/up_arrow.png" };
  }
  //CHECK FOR TYPE
  let counter = 0;
  for (let i = 0; i < pokemon.type.length; i++) {
    if (target.type.includes(pokemon.type[i])) {
      counter++;
    }
  }
  if (counter === pokemon.type.length) {
    result["type"] = { color: "#8fb935", value: pokemon.type };
  } else if (counter > 0) {
    result["type"] = { color: "#e6e22e", value: pokemon.type };
  } else {
    result["type"] = { color: "#e64747", value: pokemon.type };
  }
  //CHECK FOR EVOLUTION STAGE
  if (pokemon.evolutionStages === target.evolutionStages) {
    result["evolutionStages"] = {
      color: "#8fb935",
      value: pokemon.evolutionStages,
    };
  } else {
    result["evolutionStages"] = {
      color: "	#e64747",
      value: pokemon.evolutionStages,
    };
  }
  //CHECK FOR COLOR
  if (pokemon.color === target.color) {
    result["color"] = { color: "#8fb935", value: pokemon.color };
  } else {
    result["color"] = { color: "#e64747", value: pokemon.color };
  }

  result['name'] = pokemon.name;
  console.log(result);
  return result;
};
