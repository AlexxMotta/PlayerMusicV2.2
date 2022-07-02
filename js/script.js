//let´s select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressBar = wrapper.querySelector(".progress-bar"), //progressBar a mesma da V1
    progressArea = wrapper.querySelector(".progress-area"), //progressBar a mesma da V1
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = wrapper.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex); // calling load music function once window
    playingNow();
})


//load music function
function loadMusic(indexNumb) {
    //pode usar o textContent ou o innerText eles fazem a mesma coisa
    musicName.textContent = allMusic[indexNumb - 1].name;
    musicArtist.textContent = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `musics/${allMusic[indexNumb - 1].src}.mp3`;
    playMusic();

}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").textContent = "pause";
    mainAudio.play();
}

//pause musci function
function pauseMusic() {
    wrapper.classList.remove("paused");
    console.log(wrapper.classList);
    playPauseBtn.querySelector("i").textContent = "play_arrow";
    mainAudio.pause();
}


//next music function
function nextMusic() {
    //here we`ll just increment of index by 1
    musicIndex++;
    //se o incremento ultrapassar o tamanho do array ele volta pra 1, assim tocando a primeira musica.
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}


//prev music function
function prevMusic() {
    //here we`ll just decrecrement of index by 1
    musicIndex--;
    //if musicIndex is less than 1 the musicIndex will be array le
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//play or music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pausedMusic else call playMusic
    isMusicPlay ? pauseMusic() : playMusic();
});

//next music btn event
nextBtn.addEventListener("click", () => {

    nextMusic(); //calling next music function
})

//prev music btn event
prevBtn.addEventListener("click", () => {

    prevMusic(); //calling prev music function
})

//função pra atualizar a barra de progresso
//pelo que eu entendi o timeupdate so atualiza a todo momento
mainAudio.addEventListener('timeupdate', (e) => {
    //função pra atualizar o tempo da musica (current)s
    const currentTime = e.target.currentTime; //Getting current time of music
    const durationTime = e.target.duration; //getting total duration of music
    let progressWidth = (currentTime / durationTime) * 100; //width styles of progress bar, baseado no current time e duration
    //o valor do progressWidth é recebido em %
    progressBar.style.width = `${progressWidth}%`;
    //console.log("Duration - ", durationTime);



    //pegando as classes HTML
    let currentMusic = wrapper.querySelector(".current");
    let durationMusic = wrapper.querySelector(".duration");

    /*pelo que eu entendi o loadeddata so atualiza uma vez
    esa function abaixo e desnecessaria, a pagina nao atualiza o duration a todo momento
    apenas o currentSegundos, eu olhei no elements do navegador.*/
    mainAudio.addEventListener('loadeddata', () => {
        let audioDuration = mainAudio.duration;
        let durationMinutos = Math.floor(audioDuration / 60),
            durationSegundos = Math.floor(audioDuration % 60);
        if (durationSegundos < 10) {
            durationSegundos = `0${durationSegundos}`;
        }
        durationMusic.textContent = `${durationMinutos}:${durationSegundos}`;

    })

    let audioDuration = mainAudio.duration;
    let durationMinutos = Math.floor(audioDuration / 60),
        durationSegundos = Math.floor(audioDuration % 60);
    if (durationSegundos < 10) {
        durationSegundos = `0${durationSegundos}`;
    }
    durationMusic.textContent = `${durationMinutos}:${durationSegundos}`;


    let currentMinutos = Math.floor(currentTime / 60),
        currentSegundos = Math.floor(currentTime % 60);
    if (currentSegundos < 10) {
        currentSegundos = `0${currentSegundos}`;
    }
    currentMusic.textContent = `${currentMinutos}:${currentSegundos}`;


});

//funciton que atualiza o tempo da musica manualmente
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;
    let cliekedOffSetx = e.offsetX; //
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (cliekedOffSetx / progressWidthval) * songDuration;
    playMusic();
});

//let's work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    //first we get the innertText of the icon then we'll change according
    let getText = repeatBtn.innerText; //getting innerText of icon
    //let's do different changes on different icon click using switch
    switch (getText) {
        case "repeat": //if this icon is repeat then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": //if icon icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle": // if ifcon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});


mainAudio.addEventListener("ended", () => {

    let getText = repeatBtn.innerText; //getting innerText of icon
    //let's do different changes on different icon click using switch
    switch (getText) {
        case "repeat": //if this icon is repeat the simly we call the nextMusic funciton so th next song will play
            nextMusic();
            break;
        case "repeat_one": //if icon icon is repeat_one the we'll change the current playing song current time to 0 so song will play from beginning
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic(); //calling playMusic function
            break;
        case "shuffle": //if icon is shuffle the change it to repeat
            //generating random index betweem the max range array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex); //this loop run until the next random number won't be the same of currente music index
            musicIndex = randIndex; // pasing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex); // calling loadMusic funciton
            playMusic(); //calling playMusic function
            break;
    }
});


showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
//let`s creat li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array to li
    let liTag = `<li li-index = "${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="musics/${allMusic[i].src}.mp3"> </audio>
                    <span id="${allMusic[i].src}" class "audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`),
    liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration,
            durationMinutos = Math.floor(audioDuration / 60),
            durationSegundos = Math.floor(audioDuration % 60);
        if (durationSegundos < 10) {
            durationSegundos = `0${durationSegundos}`;
        }
        liAudioDuration.innerText = `${durationMinutos}:${durationSegundos}`;
        //adding t duration attribute which we´ll use below
        liAudioDuration.setAttribute("t-duration",`${durationMinutos}:${durationSegundos}`);
    });
}




function playingNow(){
    //let`s work on play particular song on click
    const allLiTags = ulTag.querySelectorAll("li");

    for(let j = 0; j < allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //let`s remove playing  class from all other li expect the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            //let`s get that audio duration value and pass to .audio-duration innertext
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; //passing t-duration value to audio duration innerText
        }
        //if there is an li tag which li-index is equal to musicindex
        //then this music is playing now and we`ll style ir
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "playing";
        }
        //adding conlcik atribute in all li tags
        allLiTags[j].setAttribute("onclick","clicked(this)");
    }
}

//let`s play song on li click
function clicked(element){
    //getting li index of particular click li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //passing that liindex to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//PAREI NOS 52 MINUTOS, PRECISO VOLTAR UM POUCO 
//E IMPLEMENTAR O CURRENT TIME E DURATION NO HTML
// E NO JS PRA FAZER O TEMPO DA MUSICA APARECER




/*
ESTUDAR
TUDO
https://www.codingnepalweb.com/create-music-player-in-javascript/
progressArea.clientWidth;
https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
cliekedOffSetx = e.offsetX;
https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX


*/