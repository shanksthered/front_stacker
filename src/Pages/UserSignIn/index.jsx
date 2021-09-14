import React, { useState, useEffect } from "react";
import SignInForm from "../../Components/Forms/SignInForm";
import UsersAPIManager from "../../Services/RailsApi/UsersFetch";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RegisterUserLoginStatus, RegisterUserLogoutStatus } from "../../Store";
import { Link } from "react-router-dom";

const UserSignIn = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();

  const login = async (e) => {
    e.preventDefault();
    const response = await UsersAPIManager.login(email, password);
    history.push("/");
    response.status === 200
      ? dispatch(RegisterUserLoginStatus(response.data.user_id, "user"))
      : dispatch(RegisterUserLogoutStatus());
    user.setIsLogged(true);
  };

  return (
    <>
      <div>
        <SignInForm user={{ email, setEmail, password, setPassword, login }} />
      </div>
      <Link to="/users/sign-up">
        <p>Pas de compte ? S'inscrire</p>
      </Link>
    </>
  );
};

export default UserSignIn;
