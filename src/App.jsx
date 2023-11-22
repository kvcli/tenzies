import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rolls, setRolls] = React.useState(0);
  const [startTime, setStartTime] = React.useState(null); // New state for start time
  const [elapsedTime, setElapsedTime] = React.useState(null); // New state for elapsed time
  
  const allHeld = dice.every((die) => die.isHeld);
  const firstValue = dice[0].value;
  const allSameValue = dice.every((die) => die.value === firstValue);
  React.useEffect(() => {
    
    if (allHeld && allSameValue) {
      setTenzies(true);
      setElapsedTime(performance.now() - startTime); // Calculate elapsed time
    }
  }, [dice, startTime]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      if (startTime === null) {
        setStartTime(performance.now()); // Record start time on the first roll
      }
  
      const selectedDice = dice.filter((die) => die.isHeld);
  
      if (selectedDice.length > 1) {
        const firstSelectedValue = selectedDice[0].value;
        const allSelectedMatch = selectedDice.every(
          (die) => die.value === firstSelectedValue
        );
  
        if (!allSelectedMatch) {
          alert("Selected dice must have the same value to roll.");
          return;
        }
      }
  
      setDice((oldDice) =>
        oldDice.map((die) => (die.isHeld ? die : generateNewDie()))
      );
      setRolls((prevRolls) => prevRolls + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRolls(0);
      setStartTime(null); // Reset start time on a new game
      setElapsedTime(null); // Reset elapsed time on a new game
    }
  }
  

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions p">
       { tenzies? "You won!": "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."}
      </p>
    
      {tenzies && <p className="roll-count p">Rolls: {rolls}</p>}

     {elapsedTime !== null && (
  <p className="time-taken p">{`Time taken: ${(elapsedTime / 1000).toFixed(2)} seconds`}</p>
)}

      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
