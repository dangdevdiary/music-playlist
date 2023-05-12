const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const pl = $('.playlist');
const cd = $('.cd');
const header = $('header');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const cdWidth = cd.offsetWidth;
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
let isPlaying = false;
const app = {
    currentIndex: 0,
    isRandomSong: false,
    isRepeat: false,
    songPlayed: [],
    song: [
        {
            name: 'Anh Đã Lạc Vào',
            singer: 'Green',
            path: './assets/music/anhdalacvao.mp3',
            image: './assets/img/anhdalacvao.jpg'
        },
        {
            name: 'Anh Sẽ Đợi',
            singer: 'Tlong',
            path: './assets/music/anhsedoi.mp3',
            image: './assets/img/anhsedoi.jpg'
        },
        {
            name: 'Dễ Đến Dễ Đi',
            singer: 'Quang Hùng',
            path: './assets/music/dedendedi.mp3',
            image: './assets/img/dedendedi.jpg'
        },
        {
            name: 'Past Live',
            singer: 'Born',
            path: './assets/music/pastlive.mp3',
            image: './assets/img/pastlive.jpg'
        },
        {
            name: 'Tình Đầu',
            singer: 'Tăng Duy Tăng',
            path: './assets/music/tinhdau.mp3',
            image: './assets/img/tinhdau.jpg'
        },
        {
            name: 'Where U At',
            singer: 'Green',
            path: './assets/music/whereuat.mp3',
            image: './assets/img/whereuat.jpg'
        },
    ],
    // render playlist
    render: function(){
        const htmls = this.song.map((song,index) => {
          return  `<div class="song" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
        })
        pl.innerHTML = htmls.join('');
    },
    // xử lý sự kiện
    handleEvent: function(){
        const playListSong = Array.from($$('.song'));
        playListSong[0].classList.add('active');
        const cdThumbAnimate = this.cdAnimation();
        // xử lý phóng to thu nhỏ
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth +'px': 0;
            cd.style.opacity = newCdWidth/cdWidth
        }
        // xử lý khi click nút play
        playBtn.onclick = function(){
            isPlaying ? audio.pause() : audio.play();
        }
        audio.onplay=function(){
            isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause=function(){
            isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        // xử lý tua song
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }

        }
        progress.oninput = function(){
            const currentSongTime = this.value * audio.duration / 100;
            audio.currentTime = currentSongTime;
        }
        // xử lý next bài hát
        nextBtn.onclick = function(){
            if(app.isRandomSong){
                app.randomSong();
            }else{
                app.nextSong();
            }
            audio.play();
            app.activeSong(playListSong);
        }
        // xử lý lui bài hát
        prevBtn.onclick = function(){
            if(app.isRandomSong){
                app.randomSong();
            }else{
                app.prevSong();
            }
            audio.play();
            app.activeSong(playListSong);
        }
        // xử lý phát ngẫu nhiên
        randomBtn.onclick = function(){
            app.isRandomSong = !app.isRandomSong;
            this.classList.toggle("active",app.isRandomSong)
        }
        // xử lý lặp bài hát
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat;
            this.classList.toggle("active",app.isRepeat);
        }
        // xử lý khi phát đến cuối bài hát
        audio.onended = function(){
            setTimeout(()=>{
                if(app.isRepeat){
                    audio.play()
                }else{
                    nextBtn.click();
                }
            },2000)
        }
        // xử lý khi click vào song
        pl.onclick = function(e){
            const songElement = e.target.closest('.song:not(.active)')
            if(songElement || e.target.closest('.option')){
                if(songElement){
                    app.currentIndex = Number(songElement.dataset.index);
                    app.loadCurrentSong();
                    audio.play(); 
                    app.activeSong(playListSong); 
                }else{

                }
            }
        }
    },
    // định nghĩa các properties
    defineProperties: function(){
      Object.defineProperty(this,'currentSong',{
        get: function(){
            return this.song[this.currentIndex];
        }
      })  
    },
    // load bài hát hiện tại
    loadCurrentSong: function(){
        header.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage=`url(${this.currentSong.image})`;
        audio.src=this.currentSong.path;
    },
    // cd quay
    cdAnimation: function (){
        const cdAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 15000,
            iterations: Infinity
        });
        cdAnimate.pause();
        return cdAnimate
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.song.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.song.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        // cach 1
        this.currentIndex = Math.round(Math.random()*(this.song.length-1));
        if(this.songPlayed.indexOf(this.currentIndex) == -1){
            this.songPlayed.push(this.currentIndex);
        }else{
            if(this.songPlayed.length == this.song.length){
                this.songPlayed = this.songPlayed.splice(4,2);
            }
            this.randomSong();
        }
        // cach 2
        // do{
        //     this.currentIndex = Math.round(Math.random()*(this.song.length-1));
        //     if(this.songPlayed.indexOf(this.currentIndex) == -1){
        //         this.songPlayed.push(this.currentIndex);
        //         break;
        //     }
        //     if(this.songPlayed.length == this.song.length){
        //         this.songPlayed = this.songPlayed.splice(4,2);
        //     }
        // }while(this.songPlayed.length <= this.song.length)
        app.loadCurrentSong();
    },
    activeSong: function(listSong){
        listSong.map(song=>{
            if(song.classList.contains('active')){
                song.classList.remove('active');
            }
            if(app.currentIndex==song.dataset.index){
               song.classList.add('active');
               song.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
            }
        })
    },
    start: function(){
        this.defineProperties()
        this.loadCurrentSong()
        this.render();
        this.handleEvent();
    }
}
app.start()