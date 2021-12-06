import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "./login-form";
import { checkAuth, ACTION_LOGOUT } from "../store/actions";
import $api from "../http";

export default function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(({ isAuth }) => isAuth);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(checkAuth());
    }
  }, []);

  return (
    <>
      <LoginForm />
      {isAuth && <UsersComponent />}
    </>
  );

}

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const isAuth = useSelector(({ isAuth }) => isAuth);

  const getUsers = async () => {
    const res = await $api.get("/users");
    setUsers(res.data);
  }

  if (isAuth) {
    return (
      <>
        <button onClick={() => getUsers()}>Get Users</button>
        <ul>
          {users.map(item => {
            return <li>{item.email}</li>
          })}
        </ul>
      </>
    )
  }
}
