/* globals Deferred, js */

var loaders = [];
var imgpath = "static/img/";
var imageloadprogress = 0;
var imageloadtotal = 0;

var allimages = [
  {
    "name": "city",
    "images": ["/static/media/puzzle-1.1d7037ff.jpg"],
    "dir": "",
  },
  {
    "name": "art",
    "images": ["/static/media/puzzle-2.a70b4fa5.jpg"],
    "dir": "",
  },
  {
    "name": "art2",
    "images": ["/static/media/puzzle-3.542683fc.jpg"],
    "dir": "",
  },
];

var currPuzzle = 0;
var piecex = 5;
var piecey = 4;
var hours = 0;
var mins = 0;
var timex = null;
var seconds = 0;

//preload images
function loadFile(src, array, num) {
  var deferred = new Deferred();
  var sprite = new Image();
  sprite.onload = function () {
    array[num] = sprite;
    deferred.resolve();
    imageloadprogress++;
    //document.getElementById('loading').style.width = (imageloadprogress / imageloadtotal) * 100 + '%';
  };
  sprite.src = src;
  return deferred.promise();
}

function browserTest() {
  navigator.sayswho = (function () {
    var ua = navigator.userAgent,
      tem,
      M =
        ua.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return "IE " + (tem[1] || "");
    }
    if (M[1] === "Chrome") {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(" ").replace("OPR", "Opera");
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(" ");
  })();

  // console.log(navigator.sayswho.split(" ")[1]);
  console.log(navigator.sayswho);
  browser = navigator.sayswho.split(" ")[0];
  version = parseInt(navigator.sayswho.split(" ")[1]);
  switch (browser) {
    case "Chrome":
      if (version < 81) {
        document.getElementById("alert").classList.toggle("hidden");
      }
      break;
    case "Safari":
      if (version < 12) {
        document.getElementById("alert").classList.toggle("hidden");
      }
      break;
    case "Edge":
      if (version < 80) {
        document.getElementById("alert").classList.toggle("hidden");
      }
      break;
    case "Firefox":
      if (version < 75) {
        document.getElementById("alert").classList.toggle("hidden");
      }
      break;
    default:
      break;
  }
}

//loop through and call all the preload images
function callAllPreloads(array, dir) {
  for (var z = 0; z < array.length; z++) {
    loaders.push(loadFile(dir + array[z], array, z));
  }
}
function startTimer() {
  timex = setTimeout(function () {
    seconds++;
    if (seconds > 59) {
      seconds = 0;
      mins++;
      if (mins > 59) {
        mins = 0;
        hours++;
        if (hours < 10) {
          document.getElementById("hours").innerHTML = "0" + hours;
        } else {
          document.getElementById("hours").innerHTML = hours;
        }
      }

      if (mins < 10) {
        document.getElementById("minutes").innerHTML = "0" + mins;
      } else document.getElementById("minutes").innerHTML = mins;
    }
    if (seconds < 10) {
      document.getElementById("seconds").innerHTML = "0" + seconds;
    } else {
      document.getElementById("seconds").innerHTML = seconds;
    }

    startTimer();
  }, 1000);
}

function resetTimer() {
  hours = 0;
  mins = 0;
  seconds = 0;
  document.getElementById("hours").innerHTML = "00";
  document.getElementById("minutes").innerHTML = "00";
  document.getElementById("seconds").innerHTML = "00";
  stopTimer();
}

function stopTimer() {
  clearTimeout(timex);
}

// for (var im = 0; im < allimages.length; im++) {
//   imageloadtotal += allimages[im].images.length;
//   callAllPreloads(allimages[im].images, imgpath + allimages[im].dir + "/");
// }

function NewPiece(x, y, w, h, solvedx, solvedy, spritex, spritey, rowx, rowy) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.solvedx = solvedx;
  this.solvedy = solvedy;
  this.spritex = spritex;
  this.spritey = spritey;
  this.visible = 1;
  this.solved = 0;
  this.offsetx = -1;
  this.offsety = -1;
  this.rowx = rowx;
  this.rowy = rowy;
}

(function (window, undefined) {
  var js = {
    canvas: 0,
    ctx: 0,
    canvasw: 0,
    canvash: 0,
    canvasTopLeft: 0,
    canvasTopRight: 0,
    canvasBottomLeft: 0,
    canvasBottomRight: 0,
    savedcanvasw: 0,
    savedcanvash: 0,
    idealw: 1, //gets set later based on image size
    idealh: 1,
    canvasmode: 1,
    piececountx: 6, //number of pieces across
    piececounty: 3, //number of pieces down
    puzzle: 0,
    pieces: [],
    solvedpieces: [],
    clickedpiece: -1,
    debug: 0,

    general: {
      init: function () {
        js.canvas = document.getElementById("canvas");
        if (!js.canvas.getContext) {
          document.getElementById("canvas").innerHTML =
            "Your browser does not support canvas. Sorry.";
        } else {
          js.ctx = js.canvas.getContext("2d");
          js.general.initPuzzle();
          this.setupEvents();
          setInterval(js.general.drawPieces, 10);
        }
      },

      initPuzzle: function () {
        // var url = URL.createObjectURL(allimages[currPuzzle].images[0]);
        js.puzzle = new Image(1555, 1037);
        js.puzzle.onload = function(){
          console.log(js.puzzle)
        }
        setTimeout(() => {
          document.getElementById("body").className = "";
          js.puzzle.src = allimages[currPuzzle].images[0];
          js.idealw = js.puzzle.width;
          js.idealh = js.puzzle.height;
          js.general.initCanvasSize();
          js.savedcanvasw = js.canvasw;
          js.savedcanvash = js.canvash;
          js.piececountx = piecex;
          js.piececounty = piecey;
          // document.getElementById('piecesx').value = js.piececountx;
          // document.getElementById('piecesy').value = js.piececounty;
          js.general.createPieces();
        }, 100);
        // console.log("Curr puzzle: ", currPuzzle)

      },

      //initialise the size of the canvas based on the ideal aspect ratio and the size of the parent element
      initCanvasSize: function () {
        var parentel = document.getElementById("canvasparent");
        var targetw = parentel.offsetWidth;
        var targeth = parentel.offsetHeight;

        var sizes = js.general.calculateAspectRatio(
          js.idealw,
          js.idealh,
          targetw,
          targeth
        );
        js.canvas.width = js.canvasw = sizes[0];
        js.canvas.height = js.canvash = sizes[1];
        /*
						//resize the canvas to maintain aspect ratio depending on screen size (may result in gaps either side) - we're using this one
						if(js.canvasmode === 1){
						}
						//make canvas always full width, with appropriately scaled height (may go off bottom of page)
						else {
							js.canvas.width = targetw;
							var scaleh = js.general.calculatePercentage(targetw,js.idealw);
							js.canvas.height = (js.idealh / 100) * scaleh;
						}
						*/
      },

      //given a width and height representing an aspect ratio, and the size of the containing thing, return the largest w and h matching that aspect ratio
      calculateAspectRatio: function (idealw, idealh, parentw, parenth) {
        var aspect = Math.floor((parenth / idealh) * idealw);
        var cwidth = Math.min(idealw, parentw);
        var cheight = Math.min(idealh, parenth);
        var w = Math.min(parentw, aspect);
        var h = (w / idealw) * idealh;
        return [w, h];
      },

      //returns the percentage amount that object is of wrapper
      calculatePercentage: function (object, wrapper) {
        return (100 / wrapper) * object;
      },

      clearCanvas: function () {
        js.canvas.width = js.canvas.width; //this is apparently a hack but seems to work
      },

      resizeCanvas: function () {
        js.general.initCanvasSize();
        var diffx = (js.canvasw / js.savedcanvasw) * 100;
        var diffy = (js.canvash / js.savedcanvash) * 100;
        for (var p = 0; p < js.pieces.length; p++) {
          js.pieces[p].x = (js.pieces[p].x / 100) * diffx;
          js.pieces[p].y = (js.pieces[p].y / 100) * diffy;
          js.pieces[p].w = (js.pieces[p].w / 100) * diffx;
          js.pieces[p].h = (js.pieces[p].h / 100) * diffy;
          js.pieces[p].solvedx = (js.pieces[p].solvedx / 100) * diffx;
          js.pieces[p].solvedy = (js.pieces[p].solvedy / 100) * diffy;
        }
        for (p = 0; p < js.solvedpieces.length; p++) {
          js.solvedpieces[p].x = (js.solvedpieces[p].x / 100) * diffx;
          js.solvedpieces[p].y = (js.solvedpieces[p].y / 100) * diffy;
          js.solvedpieces[p].w = (js.solvedpieces[p].w / 100) * diffx;
          js.solvedpieces[p].h = (js.solvedpieces[p].h / 100) * diffy;
          js.solvedpieces[p].solvedx =
            (js.solvedpieces[p].solvedx / 100) * diffx;
          js.solvedpieces[p].solvedy =
            (js.solvedpieces[p].solvedy / 100) * diffy;
        }
        js.savedcanvasw = js.canvasw;
        js.savedcanvash = js.canvash;
      },

      resetPuzzle: function () {
        console.log("Reseting");
        resetTimer();
        startTimer();
        document.getElementById("body").className = "";
        // document.getElementById('options').className = 'optionswrapper';
        // document.getElementById("body").className = "";
        js.general.initPuzzle();
      },

      randomNumber: function (min, max) {
        return Math.random() * (max - min) + min;
      },

      //click events
      setupEvents: function () {
        var ondown =
          document.ontouchstart !== null ? "mousedown" : "touchstart";
        js.canvas.addEventListener(
          ondown,
          function (e) {
            var clicked = js.general.clickDown(e);
            js.general.clickPiece(clicked[0], clicked[1]);
          },
          false
        );

        var onup = document.ontouchstart !== null ? "mouseup" : "touchend";
        js.canvas.addEventListener(
          onup,
          function (e) {
            js.general.releasePiece();
          },
          false
        );

        var onmove = document.ontouchstart !== null ? "mousemove" : "touchmove";
        js.canvas.addEventListener(
          onmove,
          function (e) {
            e.preventDefault();
            if (js.clickedpiece !== -1) {
              js.general.movePiece(e);
            }
          },
          false
        );

        // var onupdate = ((document.ontouchstart!==null)?'mousedown':'touchstart');
        // document.getElementById('updatePuzzle').addEventListener(onupdate,function(e){
        // 	js.general.updateSettings();
        // },false);

        var option1 =
          document.ontouchstart !== null ? "mousedown" : "touchstart";
        document.getElementById("option1").addEventListener(
          option1,
          function (e) {
            js.general.updateSettings1();
          },
          false
        );

        var option2 =
          document.ontouchstart !== null ? "mousedown" : "touchstart";
        document.getElementById("option2").addEventListener(
          option2,
          function (e) {
            js.general.updateSettings2();
          },
          false
        );

        var option3 =
          document.ontouchstart !== null ? "mousedown" : "touchstart";
        document.getElementById("option3").addEventListener(
          option3,
          function (e) {
            js.general.updateSettings3();
          },
          false
        );

        // var showoptions = ((document.ontouchstart!==null)?'mousedown':'touchstart');
        // document.getElementById('showoptions').addEventListener(showoptions,function(e){
        // 	document.getElementById('options').className = 'optionswrapper shown';
        // },false);
        // var hideoptions = ((document.ontouchstart!==null)?'mousedown':'touchstart');
        // document.getElementById('hideoptions').addEventListener(hideoptions,function(e){
        // 	document.getElementById('options').className = 'optionswrapper';
        // },false);
        //   Difficulty settings
        document.getElementById("easy").onclick = function () {
          if (!document.getElementById("easy").classList.contains("active")) {
            document.getElementById("easy").classList.add("active");
            piecex = 5;
            piecey = 4;
            js.general.initPuzzle();
          }
          document.getElementById("medium").classList.remove("active");
          document.getElementById("hard").classList.remove("active");
        };

        document.getElementById("medium").onclick = function () {
          if (!document.getElementById("medium").classList.contains("active")) {
            document.getElementById("medium").classList.add("active");
            piecex = 8;
            piecey = 7;
            js.general.initPuzzle();
          }
          document.getElementById("easy").classList.remove("active");
          document.getElementById("hard").classList.remove("active");
        };

        document.getElementById("hard").onclick = function () {
          if (!document.getElementById("hard").classList.contains("active")) {
            document.getElementById("hard").classList.add("active");
            piecex = 11;
            piecey = 11;
            js.general.initPuzzle();
          }
          document.getElementById("easy").classList.remove("active");
          document.getElementById("medium").classList.remove("active");
        };
        //   End of difficulty settings
        var reset = document.ontouchstart !== null ? "mousedown" : "touchstart";
        document.getElementById("resetPuzzle").addEventListener(
          reset,
          function (e) {
            js.general.resetPuzzle();
          },
          false
        );
      },

      //find where on the canvas the mouse/touch is
      clickDown: function (e) {
        var rect = js.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        if (typeof e.changedTouches !== "undefined") {
          x = e.changedTouches[0].pageX - rect.left;
          y = e.changedTouches[0].pageY - rect.top;
        }
        return [x, y];
      },

      //identify which piece has been clicked on
      clickPiece: function (x, y) {
        for (var i = js.pieces.length - 1; i >= 0; i--) {
          if (js.general.checkCollision(js.pieces[i], x, y)) {
            js.clickedpiece = i;
            js.general.hideAllPieces();
            js.pieces[i].visible = 1;
            js.pieces[i].offsetx = x - js.pieces[i].x;
            js.pieces[i].offsety = y - js.pieces[i].y;
            break;
          }
        }
      },

      //let go of the current piece
      releasePiece: function () {
        if (js.clickedpiece !== -1) {
          for (var p = 0; p < js.pieces.length; p++) {
            js.pieces[p].visible = 1;
          }
          js.pieces[js.clickedpiece].offsetx = 0;
          js.pieces[js.clickedpiece].offsety = 0;
          var solved = js.general.checkSolved(js.pieces[js.clickedpiece]);

          if (!solved) {
            //move selected piece to the end of the array - makes last touched piece always be on top
            var tmp = js.pieces[js.clickedpiece];
            js.pieces.splice(js.clickedpiece, 1);
            js.pieces.push(tmp);
          }
          // else{
          // 	alert("YEEEET");
          // }

          js.clickedpiece = -1;

          if (js.pieces.length === 0) {
            document.getElementById("body").className = "solved";
            // alert("YEEET");
            stopTimer();
            var timecomplete = "00:00:00";
            if (document.getElementById("hours").innerText == "00") {
              if (document.getElementById("minutes").innerText == "00") {
                timecomplete = document.getElementById("seconds").innerText + " seconds ";
              }
              else {
                if (document.getElementById("minutes").innerText == "01") {
                  timecomplete = document.getElementById("minutes").innerText + " minute and " + document.getElementById("seconds").innerText + " seconds ";
                } else {
                  timecomplete = document.getElementById("minutes").innerText + " minutes and " + document.getElementById("seconds").innerText + " seconds ";
                }

              }
            }
            else {
              timecomplete = document.getElementById("hours").innerText + "hours, " + document.getElementById("minutes").innerText + " minutes and " + document.getElementById("seconds").innerText + " seconds ";
            }
            document.getElementById("end-time").innerHTML = timecomplete;
            setTimeout(function () {
              document
                .getElementById("share-overlay")
                .classList.toggle("closed");
            }, 1000);
          }
        }
      },

      //once selected, move a piece with the mouse
      movePiece: function (e) {
        var movement = js.general.clickDown(e);
        var thispiece = js.pieces[js.clickedpiece];
        var posx = movement[0] - thispiece.offsetx;
        var posy = movement[1] - thispiece.offsety;
        // limit the movement to within the canvas frame
        var x = Math.min(Math.max(0, posx), js.canvasw - thispiece.w);
        var y = Math.min(Math.max(0, posy), js.canvash - thispiece.h);
        thispiece.x = x;
        thispiece.y = y;
      },

      //once finished moving a piece, check to see if it is in place
      checkSolved: function (thispiece) {
        var solved = 0;
        var newx = thispiece.x;
        var newy = thispiece.y;
        var sx = thispiece.solvedx;
        var sy = thispiece.solvedy;

        var tolerance = 20;

        //if the piece is solved
        if (
          Math.abs(newx - sx) <= tolerance &&
          Math.abs(newy - sy) <= tolerance
        ) {
          solved = 1;
          thispiece.x = sx;
          thispiece.y = sy;
          thispiece.solved = 1;

          var tmp = thispiece;
          //remove the piece from the array of pieces and add to the solved array
          //means we can always draw the solved pieces first, beneath the unsolved
          js.pieces.splice(js.clickedpiece, 1);
          js.solvedpieces.push(tmp);
        }
        return solved;
      },

      checkCollision: function (obj, x, y) {
        if (!obj.solved) {
          //rule out any possible collisions, remembering that all y numbers are inverted on canvas
          //y is below obj bottom edge
          if (y > obj.y + obj.h) {
            return 0;
          }
          //y is above top edge
          if (y < obj.y) {
            return 0;
          }
          //x is beyond right edge
          if (x > obj.x + obj.w) {
            return 0;
          }
          //x is less than left edge
          if (x < obj.x) {
            return 0;
          }
          return 1; //collision
        } else {
          return 0;
        }
      },

      //update the puzzle based on entered values when 'update' is clicked
      // updateSettings: function(){
      // 	var elAcross = document.getElementById('piecesx');
      // 	var elDown = document.getElementById('piecesy');

      // 	var across = Math.min(20,elAcross.value);
      // 	var down = Math.min(20,elDown.value);

      // 	var file = document.getElementById('fileupload').files[0];

      // 	if(typeof file !== 'undefined'){
      // 		var reader = new FileReader();
      // 		reader.onload = function(){
      // 			var img = new Image();
      // 			img.src = reader.result;
      // 			img.onload = function(){
      // 				js.puzzle = img;
      // 				js.piececountx = across;
      // 				js.piececounty = down;
      // 				//fixme this is a repetition of some of the lines in init - could be more efficient
      // 				js.idealw = js.puzzle.width;
      // 				js.idealh = js.puzzle.height;
      // 				js.general.initCanvasSize();
      // 				js.savedcanvasw = js.canvasw;
      // 				js.savedcanvash = js.canvash;
      // 				js.general.createPieces();
      // 			};
      // 		};
      // 		reader.readAsDataURL(file);
      // 	}
      // 	else {
      // 		js.piececountx = across;
      // 		js.piececounty = down;
      // 		js.general.createPieces();
      // 	}
      // 	elAcross.value = across;
      // 	elDown.value = down;
      // 	document.getElementById('body').className = '';
      // 	document.getElementById('options').className = 'optionswrapper';
      // },
      // MY OWN SHIIIT

      //update the puzzle based on entered values when 'update' is clicked
      updateSettings1: function () {
        // alert("CHAAAANGEEES");
        // var elAcross = document.getElementById('piecesx');
        // var elDown = document.getElementById('piecesy');
        resetTimer();
        startTimer();
        document.getElementById("intro").classList.add("hide");
        document.getElementById("hamburger").classList.remove("active");
        document.getElementById("hamburger").classList.remove("hidden");
        document.getElementById("resetPuzzle").classList.remove("hidden");
        document.getElementById("timer-holder").classList.remove("hidden");
        document.getElementById("streetview").classList.add("hidden");
        document.getElementById("back-mobi").classList.toggle("hidden");
        document.getElementById("body").className = "";
        var across = piecex;
        var down = piecey;
        currPuzzle = 0;
        this.initPuzzle();
        // js.puzzle = new Image();
        // js.puzzle.src = allimages[currPuzzle].images[0];
        // js.idealw = js.puzzle.width;
        // js.idealh = js.puzzle.height;
        // js.general.initCanvasSize();
        // js.savedcanvasw = js.canvasw;
        // js.savedcanvash = js.canvash;
        // js.piececountx = across;
        // js.piececounty = down;
        // // document.getElementById('piecesx').value = js.piececountx;
        // // document.getElementById('piecesy').value = js.piececounty;
        // js.general.createPieces();
        // // elAcross.value = across;
        // // elDown.value = down;
        // document.getElementById('body').className = '';
        // document.getElementById('options').className = 'optionswrapper';
        return;
      },
      // update the puzzle based on entered values when 'update' is clicked
      updateSettings2: function () {
        // alert("CHAAAANGEEES");
        // var elAcross = document.getElementById('piecesx');
        // var elDown = document.getElementById('piecesy');
        resetTimer();
        startTimer();
        document.getElementById("intro").classList.add("hide");
        document.getElementById("hamburger").classList.remove("active");
        document.getElementById("hamburger").classList.remove("hidden");
        document.getElementById("resetPuzzle").classList.remove("hidden");
        document.getElementById("timer-holder").classList.remove("hidden");
        document.getElementById("streetview").classList.add("hidden");
        document.getElementById("back-mobi").classList.toggle("hidden");
        document.getElementById("body").className = "";
        var across = piecex;
        var down = piecey;
        currPuzzle = 1;
        this.initPuzzle();
        // js.puzzle = new Image();
        // js.puzzle.src = allimages[currPuzzle].images[0];
        // js.idealw = js.puzzle.width;
        // js.idealh = js.puzzle.height;
        // js.general.initCanvasSize();
        // js.savedcanvasw = js.canvasw;
        // js.savedcanvash = js.canvash;
        // js.piececountx = across;
        // js.piececounty = down;
        // // document.getElementById('piecesx').value = js.piececountx;
        // // document.getElementById('piecesy').value = js.piececounty;
        // js.general.createPieces();
        // // elAcross.value = across;
        // // elDown.value = down;
        // document.getElementById('body').className = '';
        // document.getElementById('options').className = 'optionswrapper';
      },
      //update the puzzle based on entered values when 'update' is clicked
      updateSettings3: function () {
        // alert("CHAAAANGEEES");
        // var elAcross = document.getElementById('piecesx');
        // var elDown = document.getElementById('piecesy');
        resetTimer();
        startTimer();
        document.getElementById("intro").classList.add("hide");
        document.getElementById("hamburger").classList.remove("active");
        document.getElementById("hamburger").classList.remove("hidden");
        document.getElementById("resetPuzzle").classList.remove("hidden");
        document.getElementById("timer-holder").classList.remove("hidden");
        document.getElementById("streetview").classList.add("hidden");
        document.getElementById("back-mobi").classList.toggle("hidden");
        document.getElementById("body").className = "";
        currPuzzle = 2;
        var across = piecex;
        var down = piecey;
        this.initPuzzle();
        // js.puzzle = new Image();
        // js.puzzle.src = allimages[currPuzzle].images[0];
        // js.idealw = js.puzzle.width;
        // js.idealh = js.puzzle.height;
        // js.general.initCanvasSize();
        // js.savedcanvasw = js.canvasw;
        // js.savedcanvash = js.canvash;
        // js.piececountx = across;
        // js.piececounty = down;
        // // document.getElementById('piecesx').value = js.piececountx;
        // // document.getElementById('piecesy').value = js.piececounty;
        // js.general.createPieces();
        // // elAcross.value = across;
        // // elDown.value = down;
        // document.getElementById('body').className = '';
        // document.getElementById('options').className = 'optionswrapper';
      },
      // END OF OWN SHIT

      hideAllPieces: function () {
        for (var p = 0; p < js.pieces.length; p++) {
          js.pieces[p].visible = 0;
        }
      },

      //create all the pieces of the puzzle
      createPieces: function () {
        js.pieces = [];
        js.solvedpieces = [];
        var w = js.canvasw / js.piececountx;
        var h = js.canvash / js.piececounty;

        //try to distribute the pieces within the middle of the puzzle, so we can work on the edges first
        var rangeminx = (js.canvasw / 100) * 10;
        var rangemaxx = ((js.canvasw - w) / 100) * 90;
        var rangeminy = (js.canvash / 100) * 10;
        var rangemaxy = ((js.canvash - h) / 100) * 90;

        for (var y = 0; y < js.piececounty; y++) {
          for (var x = 0; x < js.piececountx; x++) {
            var piecex = js.general.randomNumber(rangeminx, rangemaxx);
            var piecey = js.general.randomNumber(rangeminy, rangemaxy);
            if (js.debug) {
              //if in debug mode, start the puzzle completed
              piecex = w * x;
              piecey = h * y;
            }
            var solvedx = w * x;
            var solvedy = h * y;
            var spritex = 0;
            var spritey = 0;

            var newpiece = new NewPiece(
              piecex,
              piecey,
              w,
              h,
              solvedx,
              solvedy,
              spritex,
              spritey,
              x,
              y
            );
            js.pieces.push(newpiece);
          }
        }
      },

      //this seems to be returning false if the number is odd
      isEven: function (n) {
        return n % 2 == 0;
      },

      drawPieces: function () {
        js.general.clearCanvas();
        var piececount = js.solvedpieces.length;
        for (var p = 0; p < piececount; p++) {
          js.general.drawPiece(js.solvedpieces[p]);
        }
        piececount = js.pieces.length;
        for (var q = 0; q < piececount; q++) {
          js.general.drawPiece(js.pieces[q]);
        }
      },

      //edge is either 0,1,2,3 - corresponding to top, right, bottom, left, arccounterClockwise decides if tab or blank, ie. in or out
      drawTabOrBlank: function (obj, edge, arccounterClockwise) {
        var arcradius = Math.min(obj.h / 4, obj.w / 4);
        var arcx = 0;
        var arcy = 0;
        var arcstartAngle = 0;
        var arcendAngle = 0;
        switch (edge) {
          case 0:
            arcx = obj.x + obj.w / 2;
            arcy = obj.y;
            arcstartAngle = 1 * Math.PI;
            arcendAngle = 0 * Math.PI;
            break;
          case 1:
            arcx = obj.x + obj.w;
            arcy = obj.y + obj.h / 2;
            arcstartAngle = 1.5 * Math.PI;
            arcendAngle = 0.5 * Math.PI;
            break;
          case 2:
            arcx = obj.x + obj.w / 2;
            arcy = obj.y + obj.h;
            arcstartAngle = 0 * Math.PI;
            arcendAngle = 1 * Math.PI;
            break;
          case 3:
            arcx = obj.x;
            arcy = obj.y + obj.h / 2;
            arcstartAngle = 0.5 * Math.PI;
            arcendAngle = 1.5 * Math.PI;
            break;
        }
        js.ctx.arc(
          arcx,
          arcy,
          arcradius,
          arcstartAngle,
          arcendAngle,
          arccounterClockwise
        );
      },

      drawPiece: function (obj) {
        var arcx = 0;
        var arcy = 0;
        var arcradius = 0;
        var arcstartAngle = 0;
        var arcendAngle = 0;
        var arccounterClockwise = true;

        var puzzleWEven = js.general.isEven(js.piececountx);
        var puzzleHEven = js.general.isEven(js.piececounty);

        var pieceXEven = js.general.isEven(obj.rowx);
        var pieceYEven = js.general.isEven(obj.rowy);

        js.ctx.save();
        if (obj.solved) {
          js.ctx.lineWidth = 0;
          js.ctx.strokeStyle = "rgba(0,0,0,0)";
        } else {
          if (
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
          ) {
            js.ctx.lineWidth = 5;
            //   var gradient = js.ctx.createLinearGradient(0, 0, 2, 0);
            // 	gradient.addColorStop("0", "white");
            // 	gradient.addColorStop("0.5" ,"grey");
            // 	gradient.addColorStop("1.0", "black");
            // js.ctx.strokeStyle = gradient;
            js.ctx.shadowColor = "#fff";
            js.ctx.shadowOffsetX = 2;
            js.ctx.shadowOffsetY = 2;
            js.ctx.shadowBlur = 4;
            js.ctx.strokeStyle = "rgba(0,0,0,0.5)";
          }
          js.ctx.lineWidth = 3;
          js.ctx.strokeStyle = "rgba(0,0,0,0.5)";
        }

        if (!obj.visible) {
          js.ctx.globalAlpha = 0.1;
        }

        js.ctx.beginPath();
        js.ctx.moveTo(obj.x, obj.y); //top left corner

        //deal with top edge
        if (obj.rowy > 0) {
          if (pieceYEven) {
            if (pieceXEven) {
              js.general.drawTabOrBlank(obj, 0, 1); //draw a sticky bit out, top edge
            } else {
              js.general.drawTabOrBlank(obj, 0, 0); //draw a sticky bit in, top edge
            }
          } else {
            if (pieceXEven) {
              js.general.drawTabOrBlank(obj, 0, 0); //draw a sticky bit in, top edge
            } else {
              js.general.drawTabOrBlank(obj, 0, 1); //draw a sticky bit out, top edge
            }
          }
        }

        js.ctx.lineTo(obj.x + obj.w, obj.y); //top right corner

        //deal with right edge
        if (obj.rowx < js.piececountx - 1) {
          if (pieceYEven) {
            if (pieceXEven) {
              js.general.drawTabOrBlank(obj, 1, 0); //draw a sticky bit in, right edge
            } else {
              js.general.drawTabOrBlank(obj, 1, 1); //draw a sticky bit out, right edge
            }
          } else {
            if (pieceXEven) {
              js.general.drawTabOrBlank(obj, 1, 1); //draw a sticky bit out, right edge
            } else {
              js.general.drawTabOrBlank(obj, 1, 0); //draw a sticky bit in, right edge
            }
          }
        }

        js.ctx.lineTo(obj.x + obj.w, obj.y + obj.h); //bottom right corner

        //deal with bottom edge
        if (obj.rowy < js.piececounty - 1) {
          if (pieceYEven) {
            if (pieceXEven) {
              js.general.drawTabOrBlank(obj, 2, 1); //draw a sticky bit out, bottom edge
            } else {
              js.general.drawTabOrBlank(obj, 2, 0); //draw a sticky bit in, bottom edge
            }
          } else {
            if (pieceXEven) {
              js.general.drawTabOrBlank(obj, 2, 0); //draw a sticky bit in, bottom edge
            } else {
              js.general.drawTabOrBlank(obj, 2, 1); //draw a sticky bit out, bottom edge
            }
          }
        }

        js.ctx.lineTo(obj.x, obj.y + obj.h); //bottom left corner

        //deal with left edge
        if (obj.rowx > 0) {
          if (pieceYEven) {
            if (pieceXEven) {
              js.general.drawTabOrBlank(obj, 3, 0); //draw a sticky bit in, left edge
            } else {
              js.general.drawTabOrBlank(obj, 3, 1); //draw a sticky bit out, left edge
            }
          } else {
            if (pieceXEven) {
              js.general.drawTabOrBlank(obj, 3, 1); //draw a sticky bit out, left edge
            } else {
              js.general.drawTabOrBlank(obj, 3, 0); //draw a sticky bit in, left edge
            }
          }
        }

        js.ctx.lineTo(obj.x, obj.y); //top left corner - back to origin
        js.ctx.closePath();

        js.ctx.clip();
        js.ctx.drawImage(
          js.puzzle,
          0 - obj.solvedx + obj.x,
          0 - obj.solvedy + obj.y,
          js.canvasw,
          js.canvash
        );
        js.ctx.stroke();
        js.ctx.restore();
      },
    },
  };
  window.js = js;
})(window);

window.onload = function () {

  this.browserTest();

  document.getElementById("hamburger").onclick = function () {
    document.getElementById("hamburger").classList.toggle("active");
    document.getElementById("intro").classList.toggle("hide");
    document.getElementById("timer-holder").classList.toggle("hidden");
    document.getElementById("resetPuzzle").classList.toggle("hidden");
    document.getElementById("streetview").classList.toggle("hidden");
  };

  document.getElementById("back-mobi").onclick = function () {
    document.getElementById("back-mobi").classList.toggle("hidden");
    document.getElementById("intro").classList.toggle("hide");
    document.getElementById("timer-holder").classList.toggle("hidden");
    document.getElementById("resetPuzzle").classList.toggle("hidden");
    document.getElementById("streetview").classList.toggle("hidden");
  };

  // this.document.getElementById("expand").onclick = function () {
  //   var elem = document.getElementById("body");
  //   if (document.getElementById("expand").classList.contains("contract")) {
  //     document.getElementById("expand").classList.remove("contract");
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //     } else if (document.mozCancelFullScreen) {
  //       document.mozCancelFullScreen();
  //     } else if (document.webkitExitFullscreen) {
  //       document.webkitExitFullscreen();
  //     } else if (document.msExitFullscreen) {
  //       document.msExitFullscreen();
  //     }
  //   } else {
  //     document.getElementById("expand").classList.add("contract");
  //     if (elem.requestFullscreen) {
  //       elem.requestFullscreen();
  //     } else if (elem.mozRequestFullScreen) {
  //       /* Firefox */
  //       elem.mozRequestFullScreen();
  //     } else if (elem.webkitRequestFullscreen) {
  //       /* Chrome, Safari & Opera */
  //       elem.webkitRequestFullscreen();
  //     } else if (elem.msRequestFullscreen) {
  //       /* IE/Edge */
  //       elem.msRequestFullscreen();
  //     }
  //   }
  // };

  document.getElementById("close").onclick = function () {
    document.getElementById("share-overlay").classList.toggle("closed");
  };

  Deferred.when(loaders).then(function () {
    js.general.init();
    //js.general.addClass(document.getElementById('loading'),'fadeout');
  });

  var resize;
  window.addEventListener("resize", function (event) {
    clearTimeout(resize);
    resize = setTimeout(js.general.resizeCanvas, 200);
  });
};