import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./static/scss/main.scss"
import img1 from "./static/img/puzzle-1.jpg"
import img2 from "./static/img/puzzle-2.jpg"
import img3 from "./static/img/puzzle-3.jpg"
import nissanlogo from "./static/img/Nissan col.png"

function App() {
  return (
    <div className="App">
      <div className="header">
        <a id="hamburger" className="hamburger hidden" href="#">
          <span></span>
        </a>
        <img className="logo" src={nissanlogo} alt="" />
        <h2>Streetview Puzzle</h2>
        <br />
        <button
          type="submit"
          id="resetPuzzle"
          className="btn btn-secondary hidden"
        >
          Reset
        </button>
      </div>
      <div className="intro" id="intro">
        <p>Choose a puzzle</p>
        <br />
        <img
          className="imgChoice"
          id="option1"
          src={img1}
          alt=""
        />
        <img
          className="imgChoice"
          id="option2"
          src={img2}
          alt=""
        />
        <img
          className="imgChoice"
          id="option3"
        src={img3}
          alt=""
        />
      </div>
      <div id="share-overlay" className="share-overlay closed">
        {/* <!-- <a href="#" id="download-image">Download Image</a> --> */}
        <a id="close">x</a>
        <p>Enjoyed that puzzle? Share the experience</p>
        <br />
        <div className="icons">
          <a href="#" className="fa fa-facebook"></a>
          <a href="#" className="fa fa-twitter"></a>
          <a href="#" className="fa fa-linkedin"></a>
        </div>
      </div>
      <div className="canvaswrapper" id="canvasparent">
        <canvas id="canvas" className="canvas"></canvas>
      </div>
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
