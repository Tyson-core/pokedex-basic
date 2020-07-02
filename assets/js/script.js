const container = document.querySelector('.container'),
      inputPoke = document.querySelector('.pokeInput'),
      imgbody = document.querySelector('.img-body'),
      btnreturn = document.querySelector('.btn-return');


const bgColor = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};      
const pokeType = Object.keys(bgColor);

const url = 'https://pokeapi.co/api/v2/pokemon';
const limit = '?limit=807'

const capitalize = (w)=> w[0].toUpperCase() + w.slice(1);


const getPokemon= async (pokemon)=>{
    try{
        const data = await fetch(url+"/"+pokemon)
        const res = await data.json();
        const abilities = res.abilities.map(resp=>resp.ability.name)
        const types = res.types.map(type=> type.type.name)
        btnreturn.classList.remove('displayNone')
        imgbody.classList.add('displayNone')
        createCard(res,abilities,types) 
        prevNext(res.id)
    }catch(e){
        return 
    }
}

inputPoke.addEventListener('keypress',(e)=>{
    const value = inputPoke.value
    if(e.key === 'Enter' && value.trim() !=""){
        validatePoke(value.toLowerCase())
    }
});


const validatePoke = async(name)=>{
    const data = await fetch(url+limit)
    const resp = await data.json();
    const results = resp.results.map(resp => resp.name)
    const vali = results.find(resp=> resp === name)
    const idTrans= parseInt(name)

    if(vali){
        getPokemon(name.toLowerCase())
        inputPoke.value=''
        inputPoke.placeholder="Pokémon / Number (1-807)"
    }else if(!isNaN(idTrans)){
        if(idTrans <= 0 || idTrans >= 808){
            inputPoke.value=''
            inputPoke.placeholder="Number (1-807)"
        }else{
            getPokemon(idTrans)
            inputPoke.value=''
            inputPoke.placeholder="Pokémon / Number (1-807)"
        }
    }else{
        inputPoke.value=''
        inputPoke.placeholder="Write a correct Pokémon"
    }
}



const createCard = (poke, abi, type)=>{

    const t = pokeType.find(res => type.indexOf(res) > -1);
    const color = bgColor[t];

    const divCar = document.createElement('div');
    divCar.classList.add('cardPoke','animate__animated','animate__fadeIn')
    divCar.innerHTML=`
            <section class="cardIMG mt-5 text-center">

            <div class="btn-previous">
              <a class="nes-btn is-warning" id="prev">Previous</a>
            </div>

            <div class="nes-container with-title is-rounded containerIMG mb-5">
              <p class="title">${capitalize(poke.name)}</p>
              <small>N° ${(poke.id).toString().padStart(3, '0')}</small><br>
              ${poke.id>= 650 && poke.id <= 808 ?
                `<img src="https://img.pokemondb.net/sprites/bank/normal/${poke.name}.png" alt="Card image" class="img-card">`
                : `<img src="https://img.pokemondb.net/sprites/black-white/anim/normal/${poke.name}.gif" alt="Card image" class="img-card">`
               }
              <br>
              <a class="nes-btn is-primary mt-5" id="btn-shiny">Shiny</a>
            </div>

            <div class="btn-next">
              <a  class="nes-btn is-warning" id="next" >Next</a>
          </div>
        </section>

        <section class="nes-container is-rounded mb-5">
              <section class="header-info">
                  <div id="abilities" >
                      <p style="color:red">Abilities:<br><small style="color:black">${abi.join(" - ")}</small>
                      </p>
                    </div>
                    <div id="type">
                      <a class="nes-badge mb-3">
                      <span class="is-dark" id="badge" >${(type[0]).toUpperCase()}</span>
                        </a>
                    </div>
              </section>
            <div id="stats">
              HP ${poke.stats[0].base_stat}<progress class="nes-progress is-error" value="${poke.stats[0].base_stat}" max="300"></progress>
              Attack ${poke.stats[1].base_stat}<progress class="nes-progress is-primary" value="${poke.stats[1].base_stat}" max="300"></progress>
              Defense ${poke.stats[2].base_stat}<progress class="nes-progress is-warning" value="${poke.stats[2].base_stat}" max="300"></progress>
              Special Attack ${poke.stats[3].base_stat}<progress class="nes-progress " value="${poke.stats[3].base_stat}" max="300"></progress>
              Special Defense ${poke.stats[4].base_stat}<progress class="nes-progress is-success" value="${poke.stats[4].base_stat}" max="300"></progress>
              Speed ${poke.stats[5].base_stat}<progress class="nes-progress is-pattern" value="${poke.stats[5].base_stat}" max="300"></progress>
            </div>

        </section>    
    `;
    container.append(divCar);
    const containerIMG= document.querySelector('.containerIMG'),
          badge= document.querySelector('#badge')
    containerIMG.style.setProperty("background-color", color, "important"); 
    badge.style.setProperty("background-color", color, "important"); 
    badge.style.color="#212529"




    btnreturn.addEventListener('click',()=>{
        divCar.remove('div')
        btnreturn.classList.add('displayNone')
        imgbody.classList.remove('displayNone')
        inputPoke.placeholder="Pokémon / Number (1-807)"
    })

    
    inputPoke.addEventListener('keypress',(e)=>{
        const value = inputPoke.value
        if(e.key === 'Enter' && value.trim() !=""){
            divCar.remove('div')
        }else{
            return
        }
    });

    shinyChange(poke)
}


const shinyChange=(poke)=>{
    const btnShiny = document.querySelector("#btn-shiny");
    imgCard = document.querySelector(".img-card");

    btnShiny.addEventListener("click", () => {
      if (btnShiny && btnShiny.innerHTML === "Shiny") {
        btnShiny.innerHTML = "Normal";
        btnShiny.classList.remove("is-primary");
        if (poke.id >= 650 && poke.id <= 808) {
          imgCard.src = `https://img.pokemondb.net/sprites/bank/shiny/${poke.name}.png`;
        } else {
          imgCard.src = `https://img.pokemondb.net/sprites/black-white/anim/shiny/${poke.name}.gif`;
        }
      } else {
        btnShiny.innerHTML = "Shiny";
        btnShiny.classList.add("is-primary");
        if (poke.id >= 650 && poke.id <= 808) {
          imgCard.src = `https://img.pokemondb.net/sprites/bank/normal/${poke.name}.png`;
        } else {
          imgCard.src = `https://img.pokemondb.net/sprites/black-white/anim/normal/${poke.name}.gif`;
        }
      }
    })
}


const prevNext =(idPoke)=>{
    let num = parseInt(idPoke)
    const btnPrev = document.querySelector('#prev'),
          btnNext = document.querySelector('#next'),
          divCar = document.querySelector('.cardPoke');
          btnPrev.addEventListener('click',()=>{
        if(num === 1){
            btnPrev.classList.remove('is-warning');
            btnPrev.classList.add('is-error');
        }else{
            divCar.remove('div')
            validatePoke(num-1)
        }
    })
    btnNext.addEventListener('click',()=>{
        if(num === 807){
            btnNext.classList.remove('is-warning');
            btnNext.classList.add('is-error');
        }else{
            divCar.remove('div')
            validatePoke(num+1)
        }
    })
}







