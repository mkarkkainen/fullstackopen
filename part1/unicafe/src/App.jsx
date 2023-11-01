/* eslint-disable react/prop-types */
import { useState } from "react";

const Button = ({ handleClick, label }) => {
  return <button onClick={handleClick}>{label}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  let all = good + neutral + bad;
  let avg = ((good * 1 + (bad * -1) / all) * 0.1).toFixed(2);
  let positive = `${((good / all) * 100).toFixed(2)}%`;

  if (!all) {
    return <p>No feedback given</p>;
  }
  return (
    <table>
      <tbody>
        <StatisticsLine label="good" amount={good} />
        <StatisticsLine label="neutral" amount={neutral} />
        <StatisticsLine label="bad" amount={bad} />
        <StatisticsLine label="all" amount={all} />
        <StatisticsLine label="avg" amount={avg} />
        <StatisticsLine label="positive" amount={positive} />
      </tbody>
    </table>
  );
};

const StatisticsLine = ({ label, amount }) => {
  return (
    <tr>
      <td>{label}</td>
      <td>{amount}</td>
    </tr>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} label="good" />
      <Button handleClick={handleNeutralClick} label="neutral" />
      <Button handleClick={handleBadClick} label="bad" />
      <br />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
