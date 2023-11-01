/* eslint-disable react/prop-types */

const Header = ({ course }) => <h1>{course}</h1>;

const Content = ({ part, exercises }) => (
  <p>
    {part} {exercises}
  </p>
);

const Total = ({ parts }) => {
  return (
    <p>
      Number of exercises:{" "}
      {parts.reduce((acc, curr) => acc + curr.exercises, 0)}
    </p>
  );
};

const App = () => {
  const courseData = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={courseData.name} />

      {courseData.parts.map((course, i) => {
        return (
          <Content
            key={course + i}
            part={course.name}
            exercises={course.exercises}
          />
        );
      })}

      <Total parts={courseData.parts} />
    </div>
  );
};

export default App;
