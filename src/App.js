import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./static/scss/main.scss";
import img1 from "./static/img/puzzle-1.jpg";
import img2 from "./static/img/puzzle-2.jpg";
import img3 from "./static/img/puzzle-3.jpg";
import nissanlogo from "./static/img/Nissan col.png";

function App() {
  return (
    <div className="App">
      <div className="header">
        <div id="mobi">On mobile the game is best enjoyed in landscape mode on your device</div>
        <a id="hamburger" className="hamburger hidden" href="#">
          <span></span>
        </a>
        <button
          type="submit"
          id="back-mobi"
          className="btn btn-secondary hidden"
        >
          &lt;
        </button>
        {/* <img className="logo" src={nissanlogo} alt="" /> */}
        <h2 id="streetview" className="">Streetview Puzzle</h2>
        {/* <br /> */}
        <div id="timer-holder" className="hidden">
          <h3>Timer</h3>
          <p className="time">
            <span id="hours">00</span>:<span id="minutes">00</span>:
            <span id="seconds">00</span>
          </p>
        </div>
        <button
          type="submit"
          id="resetPuzzle"
          className="btn btn-secondary hidden"
        >
          Reset
        </button>
      </div>
      <div className="intro" id="intro">
        <div id="difficulty-holder">
          <p>Difficulty</p>
          <div>
            <button
              type="submit"
              id="easy"
              className="btn btn-secondary difficult active"
            >
              Easy
            </button>
            <button
              type="submit"
              id="medium"
              className="btn btn-secondary difficult"
            >
              Medium
            </button>
            <button
              type="submit"
              id="hard"
              className="btn btn-secondary difficult"
            >
              Hard
            </button>
          </div>
        </div>

        <p>Choose a puzzle</p>
        <br />
        <img className="imgChoice" id="option1" src={img1} alt="" />
        <img className="imgChoice" id="option2" src={img2} alt="" />
        <img className="imgChoice" id="option3" src={img3} alt="" />
      </div>
      <div id="share-overlay" className="share-overlay closed">
        {/* <!-- <a href="#" id="download-image">Download Image</a> --> */}
        <a id="close">x</a>
        <p>
          Congratulations you finished that in <span id="end-time"></span>!
          Enjoyed that puzzle? Share the experience
        </p>
        <div className="icons">
          <a
            href="https://www.facebook.com/sharer.php?u=URL"
            target="_blank"
            className="fa fa-facebook"
          ></a>
          <a
            href="https://twitter.com/intent/tweet?text=I+finished+the+Nissan+streetview+puzzle+!+Give+it+a+try+for+yourself.&url=URL"
            target="_blank"
            className="fa fa-twitter"
          ></a>
          <a
            href="https://www.linkedin.com/shareArticle?mini=true&title=Nissan-Streetview-Puzzle&summary=I+finished+the+Nissan+streetview+puzzle+!+Give+it+a+try+for+yourself.&source=Nissan&url=URL"
            target="_blank"
            className="fa fa-linkedin"
          ></a>
        </div>
      </div>
      <div className="canvaswrapper" id="canvasparent">
        <canvas id="canvas" className="canvas"></canvas>
      </div>
      {/* <i id="expand" className="fas fa-expand expand"></i> */}
      {/* 
  <!--[if lt IE 9]>
      <script>
        (function () {
          $("body").addClassnameclassName("iex");
        })();
      </script>
    <![endif]--> */}
    </div>
  );
}

export default App;
