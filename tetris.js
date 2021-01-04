document.addEventListener('DOMContentLoaded',()=>{
    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoredisplay=document.querySelector("#score");
    const startbutton=document.querySelector("#start-button");
    const GRID_WIDTH = 10;
    let nextrandom=0;
    let timerId;
    let score=0;
    let down=300;
    var best=0;
    //console.log(document.getElementById("one").innerText);
     var sound= new Audio("Tetris.mp3");

    //console.log(squares);
    if(localStorage.getItem("tetrisusername")==null)
    {
        document.getElementById("cover").classList.add("hide");
        document.getElementById("username").classList.remove("hide");
    }
    if(localStorage.getItem("tetrisusername")!="")
    {
       // console.log(localStorage.getItem("tetrisusername"));
        document.getElementById("cover").innerText=localStorage.getItem("tetrisusername");
        document.getElementById("cover").classList.remove("hide");
        document.getElementById("username").classList.add("hide");
    }
    else{
        document.getElementById("cover").classList.add("hide");
        document.getElementById("username").classList.remove("hide");
    }

    document.getElementById("reset").addEventListener("click",()=>{
        console.log("why");
        localStorage.setItem("tetrisusername","");
        document.getElementById("cover").innerText="";
        document.getElementById("cover").classList.add("hide");
        document.getElementById("username").classList.remove("hide");
        window.location.reload();
    })
    
    
    //the tetrominoes
    const lTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
      ];
    
      const zTetromino = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH -1, GRID_WIDTH * 2, GRID_WIDTH * 2+1]
      ];
    
      const tTetromino = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
      ];
    
      const oTetromino = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
      ];
    
      const iTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
      ];
    
      const thetetrominoes=[lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];

      let currentposition=4;
      let currentrotation=0;
      //random selection of tetrominos

      let random =Math.floor(Math.random()*thetetrominoes.length);
      //console.log(random);
      let current = thetetrominoes[random][currentrotation];
     // console.log(thetetrominoes);

     // draw tetromino
      function draw(){
          current.forEach(index=>{
              squares[currentposition+index].classList.add("tetromino");
          });
      }
      //draw();


      // Undraw tetromino
      function undraw(){
        current.forEach(index=>{
            squares[currentposition+index].classList.remove("tetromino");
        });
    }
    // keyboard function
    function control(e){
        if(e.keyCode===37){
            moveleft();
            console.log("left");
        }
        else if (e.keyCode===40)
        {
            movedown();
        }
        else if (e.keyCode===38)
        {
            const isatrightedge = current.some(index=>(currentposition+index)%GRID_WIDTH===GRID_WIDTH-1);
            const isatleftedge = current.some(index=>(currentposition+index)%GRID_WIDTH===0);
            console.log(isatrightedge);
            console.log(isatleftedge);
            if(!isatleftedge){
                if(!isatrightedge){
               rotate();}}
        }
        else if(e.keyCode===39){
            moveright();
        }
    }
    document.addEventListener("keyup",control);
    
    //move down tetromino after one second

    //timerId = setInterval(movedown,500);
    
    // movedown function
    function movedown(){
        undraw();
        currentposition+=GRID_WIDTH;
        draw();
        freeze();
        console.log(down);
    }
    // freeze the tetromino
    function freeze(){
        if(current.some(index=> squares[currentposition+index+GRID_WIDTH].classList.contains("taken"))){
            current.forEach(index=>squares[currentposition+index].classList.add("taken"));
            // new tetromino selection
            random=nextrandom;
            nextrandom=Math.floor(Math.random()*thetetrominoes.length);
            current=thetetrominoes[random][currentrotation];
            currentposition= 4;
            draw();
            displayShape();
            addscore();
            gameover();
        }
    }
    // moving left
    function moveleft(){
        undraw();
        const isatleftedge = current.some(index=>(currentposition+index)%GRID_WIDTH===0);
        if(!isatleftedge) currentposition-=1;
        if(current.some(index=>squares[currentposition+index].classList.contains("taken"))){
            currentposition+=1;
        }
        draw();
    }
    //move right
    function moveright(){
        undraw();
        const isatrightedge = current.some(index=>(currentposition+index)%GRID_WIDTH===GRID_WIDTH-1);
        if(!isatrightedge) currentposition+=1;
        if(current.some(index=>squares[currentposition+index].classList.contains("taken"))){
            currentposition-=1;
        }
        draw();
    }
    //rotation of tetromino

    function rotate(){
        // if(current.some(index=>(currentposition+index)%GRID_WIDTH!==GRID_WIDTH-1)||current.some(index=>(currentposition+index)%GRID_WIDTH!==0))
        // {
        undraw();
        currentrotation++;
        if(currentrotation === current.length)
        {
            currentrotation=0;
        }
        current=thetetrominoes[random][currentrotation];
        draw();
    //}
    }
   //show previous tetromino in scoreDisplay
  const displayWidth = 4;
  const displaySquares = document.querySelectorAll(".mini-grid div");
  let displayIndex = 0;

  const smallTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
    [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
    [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
  ]
  //displaying the tetromino in mini-grid
  function displayShape(){

      displaySquares.forEach(square=>{
          square.classList.remove("tetromino");
      })
     smallTetrominoes[nextrandom].forEach(index=>{
         displaySquares[displayIndex+index].classList.add("tetromino");
     })
  }
  //start and pause
  startbutton.addEventListener("click",()=>{
      if(localStorage.getItem("tetrisusername")=="" || localStorage.getItem("tetrisusername")==null)
{
    document.getElementById("details").classList.remove("hide");
    //document.getElementById("").classList.remove("hide");
    document.getElementById("whole").style.display="none";
    document.getElementById("goto").classList.add("hide");
    document.getElementById("reset").classList.add("hide");
    document.getElementById("start-button").classList.add("hide");
    console.log("hey");
}
// else if(localStorage.getItem("tetrisusername")==null){
//     document.getElementById("details").classList.remove("hide");
//     document.getElementById("username").classList.add("hide");
//     document.getElementById("cover").classList.remove("hide");
//     document.getElementById("whole").style.display="none";
//     document.getElementById("goto").classList.add("hide");
//     document.getElementById("reset").classList.add("hide");
//     document.getElementById("start-button").classList.add("hide");
// }
else{
    if(timerId){
        console.log("hey2");
        clearInterval(timerId);
        timerId=null;
        startbutton.innerText="Start";
        document.getElementById("details-button").classList.remove("hide");
    }
    else{
        draw();
        console.log("hey3");
        startbutton.innerText="Pause";
        timerId=setInterval(movedown,down);
        //nextrandom=Math.floor(Math.random()*thetetrominoes.length);
        document.getElementById("details-button").classList.add("hide");
        displayShape();
    }
}
  });
  document.getElementById("submit").addEventListener("click",()=>{
      var name=document.getElementById("username").value;
      localStorage.setItem("tetrisusername",name);
      document.getElementById("details").classList.add("hide");
      document.getElementById("start-button").classList.remove("hide");
      document.getElementById("whole").style.display="flex";
  });
  document.getElementById("details-button").addEventListener("click",()=>{
    document.getElementById("whole").style.display="none";
    document.getElementById("details").classList.remove("hide");
    document.getElementById("details-button").classList.add("hide");
    document.getElementById("start-button").classList.add("hide");
    document.getElementById("submit").classList.add("hide");
    document.getElementById("goto").classList.remove("hide");
    document.getElementById("reset").classList.remove("hide");
  });
  document.getElementById("goto").addEventListener("click",()=>{
    document.getElementById("whole").style.display="flex";
    document.getElementById("details-button").classList.remove("hide");
    document.getElementById("start-button").classList.remove("hide");
    document.getElementById("details").classList.add("hide");
  })

  function addscore(){
      for(let i=0; i<199; i+=GRID_WIDTH){
          const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
          if(row.every(index => squares[index].classList.contains("taken"))){
              score+=10;
              scoredisplay.innerHTML=score;
              row.forEach(index=>{
                  squares[index].classList.remove("taken");
                  squares[index].classList.remove("tetromino");
              })
              const squaresRemoved = squares.splice(i, GRID_WIDTH);
              squares= squaresRemoved.concat(squares);
              squares.forEach(cell=> grid.appendChild(cell));
              down=1;
          }
      }
  }

   function gameover() {
       if(current.some(index=> squares[currentposition+index].classList.contains("taken"))){
        scoredisplay.innerHTML="END";
        clearInterval(timerId);
        if(score>best){
            document.getElementById("three").innerText=document.getElementById("two").innerText;
            document.getElementById("two").innerText=document.getElementById("one").innerText;
            document.getElementById("one").innerText=score;
            best=score;
        }
       }
    }
    document.getElementById("left").addEventListener("click",()=>{
        undraw();
        const isatleftedge = current.some(index=>(currentposition+index)%GRID_WIDTH===0);
        if(!isatleftedge) currentposition-=1;
        if(current.some(index=>squares[currentposition+index].classList.contains("taken"))){
            currentposition+=1;
        }
        draw();
    });
    document.getElementById("right").addEventListener("click",()=>{
        undraw();
        const isatrightedge = current.some(index=>(currentposition+index)%GRID_WIDTH===GRID_WIDTH-1);
        if(!isatrightedge) currentposition+=1;
        if(current.some(index=>squares[currentposition+index].classList.contains("taken"))){
            currentposition-=1;
        }
        draw();
    });
    document.getElementById("mdown").addEventListener("click",()=>{
        undraw();
        currentposition+=GRID_WIDTH;
        draw();
        freeze();
    });
    document.getElementById("rotate").addEventListener("click",()=>{
        const isatrightedge = current.some(index=>(currentposition+index)%GRID_WIDTH===GRID_WIDTH-1);
        const isatleftedge = current.some(index=>(currentposition+index)%GRID_WIDTH===0);
        console.log(isatrightedge);
        console.log(isatleftedge);
        if(!isatleftedge){
            if(!isatrightedge){
           rotate();}}
    });
    document.getElementById("play-button").addEventListener("click",()=>{
    if(sound.play)
    {
        sound.pause();
       // document.getElementById("play-button").innerHTML="<i class="fas fa-play"></i>";
    }
     sound.play();
     sound.loop=true;
    });
    // document.getElementById("dark-button").addEventListener("click",()=>{
    //    document.getElementById("body").classList.remove("black");
    //    document.getElementById("body").classList.add("light");
    // }) 
});