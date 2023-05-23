import React from "react";
import { useState } from "react";
import { postNewUser } from "../api/api";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");
  //const [bornDate, setBornDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  //const [gender, setGender] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      name &&
      secondName &&
      //bornDate &&
      email &&
      password === password2
      // && gender
    ) {
      alert(
        `Hi ${name}! welcome to this platform, I hope you enjoy using this app`
      );
      postNewUser({
        name,
        second_name: secondName,
        // born_date: bornDate,
        email,
        password,
        // gender,
      });
      navigate("/");
    } else {
      alert("Something is missing, please check that all boxes are filled");
    }
  };
  return (
    <div className="registerMain">
      <div className="registerBox">
        <h1>Register New User</h1>
        <form className="registerForm" onSubmit={handleSubmit}>
          <label>name</label>
          <input
            type="text"
            onChange={(event) => {
              setName(event.target.value);
            }}
            id="name"
            name="name"
          ></input>
          <label>second name</label>
          <input
            type="text"
            onChange={(event) => {
              setSecondName(event.target.value);
            }}
            id="secondName"
            name="secondName"
          ></input>

          {/*       <label>born date</label>
           <input
            type="date"
            onChange={(event) => {
              setBornDate(event.target.value);
            }}
            id="bornDate"
            name="bornDate"
          ></input> */}
          <label>email</label>
          <input
            type="email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            id="email"
            name="email"
          ></input>
          <label>password</label>
          <input
            type="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            id="password"
            name="password"
          ></input>
          <label style={password === password2 ? {} : { color: "red" }}>
            repeat password
          </label>
          <input
            type="password"
            onChange={(event) => {
              setPassword2(event.target.value);
            }}
            id="password"
            name="password"
          ></input>
          {/*   <div>
            <input
              type="radio"
              id="Male"
              name="drone"
              value="Male"
              onChange={(event) => {
                setGender(event.target.value);
              }}
            />
            <label for="huey">Male</label>
            <input
              type="radio"
              id="Female"
              name="drone"
              value="Female"
              onChange={(event) => {
                setGender(event.target.value);
              }}
            />
            <label for="dewey">Female</label>
            <input
              type="radio"
              id="Other"
              name="drone"
              value="Other"
              onChange={(event) => {
                setGender(event.target.value);
              }}
            />
            <label for="louie">Other</label>
          </div> */}
          <input type="submit" value="submit" />
        </form>
      </div>
    </div>
  );
};
