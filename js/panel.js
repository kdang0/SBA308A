
export const createPanelItem = (type, value, color, num) => {
    const container = document.getElementById(type);
    if(type==="weight" || type==="height"){
        const image = document.createElement('img');
        image.setAttribute('src', value);
        image.classList.add('box-arrow');
        image.classList.add(`res${num}`);
        image.style.backgroundColor = color;
        container.appendChild(image);
    } 
    else{
        const box = document.createElement('div');
        box.classList.add('box');
        box.classList.add(`res${num}`);
        if(type==='type'){
            for(let i=0; i<value.length; i++){
                const text = document.createElement('p');
                text.textContent = value[i];
                text.classList.add('type');
                box.appendChild(text);
            }
        } else{
            const text = document.createElement('p');
            text.textContent = value;
            box.appendChild(text);
        }
        box.style.backgroundColor = color;
        container.appendChild(box);
    }
}


export const createSprite = (sprite) => {
    const image = document.createElement('img');
    const body = document.querySelector('body');
    image.setAttribute('src', sprite);
    image.classList.add('pokeImage');
    body.appendChild(image);
}

export const createText = () => {
    const text = document.createElement('p');
    const body = document.querySelector('body');
    text.textContent = "YOU GOT IT !";
    text.setAttribute('id', 'winner');
    body.appendChild(text);
    const button = document.createElement('btn');
    const container = document.createElement('div');
    container.classList.add('buttonContainer');
    button.setAttribute('id', 'replayButton');
    button.textContent = "PLAY AGAIN";
    container.appendChild(button);
    body.appendChild(container);
    button.addEventListener("click", ()=> {
        location.reload();
      })      
}