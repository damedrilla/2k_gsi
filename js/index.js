const express = require("express");
const PORT = 322;
const app = express();
app.use(express.json(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.listen(5200, () => console.log(`open at http://localhost:${PORT}`));
var cors = require("cors");

var gamestate = {
  homeTeam: "Home",
  awayTeam: "away",
  time: "12:00",
  quarter: "",
  shotclock: "24",
  awayScore: "0",
  homeScore: "0",
  mcpts: "0",
  ast: "0",
  reb: "0",
  homePerQuarter: {
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    ot: 0,
  },
  awayPerQuarter: {
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    ot: 0,
  },
};
// setInterval(() => {
//   calculatePerTeam();
// }, 5);
//{"game_clock": "5.5", "quarter": "4th", "shot_clock": "", "awayScore": 48, "homeScore": 52}
app.post("/setTeam", (req, res) => {
  console.log(req.body);
  gamestate.homeTeam = req.body.home_team;
  gamestate.awayTeam = req.body.away_team;
  res.status(200).send({ msg: "Success!" });
});
app.post("/score", (req, res) => {
  gamestate.time = req.body.game_clock;
  gamestate.quarter = req.body.quarter;
  gamestate.shotclock = req.body.shot_clock;
  gamestate.awayScore = req.body.awayScore;
  gamestate.homeScore = req.body.homeScore;
  gamestate.mcpts = req.body.mcp;
  gamestate.ast = req.body.ast;
  gamestate.reb = req.body.rb;
  res.status(200).send({ msg: "Success!" });
});

app.get("/score", cors(), (req, res) => {
  res.status(200).send({
    homeTeam: gamestate.homeTeam,
    awayTeam: gamestate.awayTeam,
    gameTime: gamestate.time,
    quarter: gamestate.quarter,
    shot: gamestate.shotclock,
    awayScore: gamestate.awayScore,
    homeScore: gamestate.homeScore,
    gameStatus: gamestate.ongoing,
    score: gamestate.mcpts,
    ast: gamestate.ast,
    rebs: gamestate.reb,
    h1: gamestate.homePerQuarter.first,
    h2: gamestate.homePerQuarter.second,
    h3: gamestate.homePerQuarter.third,
    h4: gamestate.homePerQuarter.fourth,
    h5: gamestate.homePerQuarter.ot,
    a1: gamestate.awayPerQuarter.first,
    a2: gamestate.awayPerQuarter.second,
    a3: gamestate.awayPerQuarter.third,
    a4: gamestate.awayPerQuarter.fourth,
    a5: gamestate.awayPerQuarter.ot,
  });
});

const calculatePerTeam = () => {
  if (
    gamestate.quarter === "1st" &&
    gamestate.awayScore === "0" &&
    gamestate.homeScore === "0"
  ) {
    gamestate = {
      homePerQuarter: {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        ot: 0,
      },
      awayPerQuarter: {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        ot: 0,
      },
    };
  }
  if (gamestate.quarter === "1st") {
    gamestate.homePerQuarter.first = parseInt(gamestate.homeScore);
    gamestate.awayPerQuarter.first = parseInt(gamestate.awayScore);
  } else if (gamestate.quarter === "2nd") {
    gamestate.homePerQuarter.second =
      gamestate.homeScore - gamestate.homePerQuarter.first;
    gamestate.awayPerQuarter.second =
      gamestate.awayScore - gamestate.awayPerQuarter.first;
  } else if (gamestate.quarter === "3rd") {
    gamestate.homePerQuarter.third =
      gamestate.homeScore -
      (gamestate.homePerQuarter.first + gamestate.homePerQuarter.second);
    gamestate.awayPerQuarter.third =
      gamestate.awayScore -
      (gamestate.awayPerQuarter.first + gamestate.awayPerQuarter.second);
  } else if ((gamestate.quarter = "4th")) {
    gamestate.homePerQuarter.fourth =
      gamestate.homeScore -
      (gamestate.homePerQuarter.first +
        gamestate.homePerQuarter.second +
        gamestate.homePerQuarter.third);
    gamestate.awayPerQuarter.fourth =
      gamestate.awayScore -
      (gamestate.awayPerQuarter.first +
        gamestate.awayPerQuarter.second +
        gamestate.awayPerQuarter.third);
  } else if ((gamestate.quarter = "OT")) {
    gamestate.homePerQuarter.fourth =
      gamestate.homeScore -
      (gamestate.homePerQuarter.first +
        gamestate.homePerQuarter.second +
        gamestate.homePerQuarter.third +
        gamestate.homePerQuarter.fourth);
    gamestate.awayPerQuarter.fourth =
      gamestate.awayScore -
      (gamestate.awayPerQuarter.first +
        gamestate.awayPerQuarter.second +
        gamestate.awayPerQuarter.third +
        gamestate.awayPerQuarter.fourth);
  } else {
  }
};
