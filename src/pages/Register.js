import React from "react";
import { useState } from "react";
import { postNewUser } from "../api/api";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  // add context

  //
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pointOfContact, setPointOfContact] = useState("");
  //const [bornDate, setBornDate] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumer, setPhoneNumber] = useState("");
  const [dateOfEntry, setDateOfEntry] = useState(Date.now());
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  //const [gender, setGender] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      name &&
      pointOfContact &&
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
        pointOfContact,
        // born_date: bornDate,
        email,
        password,
        // gender,
      });

      navigate("/login");
    } else {
      alert("Something is missing, please check that all boxes are filled");
    }
  };
  return (
    <div className="registerMain">
      <div className="registerBox">
        <h1>Register New User</h1>
        <form className="registerForm" onSubmit={handleSubmit}>
          <div>
            <label>name</label>
            <input
              type="text"
              onChange={(event) => {
                setName(event.target.value);
              }}
              id="name"
              name="name"
            ></input>
          </div>
          <div>
            <label>email</label>
            <input
              type="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              id="email"
              name="email"
            ></input>
          </div>
          <div>
            <label>password</label>
            <input
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              id="password"
              name="password"
            ></input>
          </div>
          <div>
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
          </div>
          <div>
            <label>Point Of Contact</label>
            <input
              type="text"
              onChange={(event) => {
                setPointOfContact(event.target.value);
              }}
              id="pointOfContact"
              name="pointOfContact"
            ></input>
          </div>
          <div>
            <label>Phone Numer</label>
            <input
              type="text"
              onChange={(event) => {
                setPhoneNumber(event.target.value);
              }}
              id="phoneNumer"
              name="phoneNumer"
            ></input>
          </div>
          <div className="submitBtnSection">
            <input type="submit" value="Sign In" />
          </div>
        </form>
      </div>
    </div>
  );
};
