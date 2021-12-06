import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { ACTION_LOGIN, registration, ACTION_LOGOUT } from "../store/actions";

export default function LoginForm() {
  const isAuth = useSelector(({ isAuth }) => isAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  return (
    <>
      <h1>{isAuth ? "Authorized" : "Not Authorized"}</h1>
      {isAuth && <button onClick={() => { dispatch(ACTION_LOGOUT()) }}>Logout</button>}
      {!isAuth &&
        <div>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button onClick={() => dispatch(ACTION_LOGIN(email, password))} type="submit">Login</button>
          <button type="submit">Registration</button>
        </div>
      }
    </>
  )
}