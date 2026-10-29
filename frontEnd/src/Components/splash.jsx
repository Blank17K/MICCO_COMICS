import React from "react";
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/textStyle.css';
import '../styling/splash.css';

export default class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginActive: false,
            close: "closeMenu",
            errorMessage: "",
            closeReg: "",
            validatedLog: false,
            loading: false
        };
        this.userName = React.createRef();
        this.password = React.createRef();
        this.email = React.createRef();
    }

    clearFields = () => {
        if (this.userName.current) this.userName.current.value = "";
        if (this.password.current) this.password.current.value = "";
        if (this.email.current) this.email.current.value = "";
    };

    /* ============================
       LOGIN — POST /api/users/login
    ============================ */
    handleLogin = async () => {
        const username = this.userName.current.value.trim();
        const password = this.password.current.value.trim();

        // basic validation
        if (!username || !password) {
            this.setState({ errorMessage: "Please fill in all required fields." });
            return;
        }

        this.setState({ errorMessage: "", loading: true });

        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                this.setState({ errorMessage: data.message || "Login failed", loading: false });
                return;
            }

            // save the logged-in user so other pages can use it
            localStorage.setItem('user', JSON.stringify(data.user));

            this.setState({ validatedLog: true, loading: false });
        } catch (err) {
            this.setState({ errorMessage: "Could not reach server", loading: false });
        }
    };

    /* ============================
       REGISTER — POST /api/users/register
    ============================ */
    handleRegister = async () => {
        const username = this.userName.current.value.trim();
        const password = this.password.current.value.trim();
        const email = this.email.current.value.trim();

        // basic validation
        if (!username || !password || !email) {
            this.setState({ errorMessage: "Please fill in all required fields." });
            return;
        }

        this.setState({ errorMessage: "", loading: true });

        try {
            const res = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });

            const data = await res.json();

            if (!res.ok) {
                this.setState({ errorMessage: data.message || "Registration failed", loading: false });
                return;
            }

            // auto-login after register (or switch to login screen)
            localStorage.setItem('user', JSON.stringify(data.user));
            this.setState({ validatedLog: true, loading: false });
        } catch (err) {
            this.setState({ errorMessage: "Could not reach server", loading: false });
        }
    };

    login() {
        return (
            <div className="formBox">
                {this.state.validatedLog === true ? <Navigate to={"/home"} replace={true} /> : ""}
                <h1 className="title">LOGIN</h1>
                <div className="row justify-content-center align-items-center">
                    {this.state.errorMessage === "" ? "" : <p className="text-danger">{this.state.errorMessage}</p>}
                    <input type="text" placeholder="Username" className="mb-3" ref={this.userName} />
                    <input type="password" placeholder="Password" className="mb-3" ref={this.password} />
                    <button
                        className="btn_act mb-3 userAct"
                        onClick={this.handleLogin}
                        disabled={this.state.loading}
                    >
                        {this.state.loading ? "..." : "LOGIN"}
                    </button>
                    <p
                        className="pharagraph link_chk"
                        onClick={() => {
                            this.setState({ loginActive: false, errorMessage: "" });
                            this.clearFields();
                        }}
                    >
                        Create Account
                    </p>
                </div>
            </div>
        );
    }

   register() {
    return (
        <div className="formBox">
            <h1 className="title">REGISTER</h1>
            <div className="row justify-content-center align-items-center">
                {this.state.errorMessage !== "" && (
                    <p className="text-danger">{this.state.errorMessage}</p>
                )}
                <input type="text" placeholder="Username" className="mb-3" ref={this.userName} />
                <input type="password" placeholder="Password:" className="mb-3" ref={this.password} />
                <input type="email" placeholder="Email:" className="mb-3" ref={this.email} />
                <button
                    className="btn_act mb-3 userAct"
                    onClick={this.handleRegister}
                    disabled={this.state.loading}
                >
                    {this.state.loading ? "..." : "REGISTER"}
                </button>
                <p
                    className="pharagraph link_chk"
                    onClick={() => {
                        this.setState({ loginActive: true, errorMessage: "" });
                        this.clearFields();
                    }}
                >
                    Already have an account? LOGIN
                </p>
            </div>
        </div>
    );
}

    backDrop() {
        return (
            <div className={`backDrop row justify-content-center align-items-center ${this.state.close}`}>
                <div className="closeInteraction" onClick={() => this.setState({ close: "closeMenu" })}>X</div>
                {this.state.loginActive ? this.login() : this.register()}
            </div>
        );
    }

    render() {
        return (
            <div className="spots row justify-content-center align-items-center">
                {this.backDrop()}
                <div className="signUp_In">
                    <button className="btn_act" onClick={() => this.setState({ loginActive: true, close: "" })}>LOGIN</button>
                    <button className="btn_act ms-3" onClick={() => this.setState({ loginActive: false, close: "" })}>REGISTER</button>
                </div>
                <div className="splash align-self-center">
                    <h1 className="title mainH">MICCO</h1>
                    <div className="actBox">Where all your favourites are</div>
                </div>
            </div>
        );
    }
}