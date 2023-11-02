/* eslint-disable react/prop-types */

const Content = ({ part, exercises }) => (
  <p>
    {part} {exercises}
  </p>
);

const Total = ({ parts }) => {
  return (
    <b>
      total of {parts.reduce((acc, { exercises }) => acc + exercises, 0)}{" "}
      exercises
    </b>
  );
};

const Header = ({ name }) => {
  return <h2>{name}</h2>;
};

export default function Course({ course }) {
  return (
    <section>
      <Header name={course.name} />
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {course.parts.map((part, i) => (
          <li key={part + i}>
            <Content part={part.name} exercises={part.exercises} />
          </li>
        ))}
      </ul>
      <Total parts={course.parts} />
    </section>
  );
}
