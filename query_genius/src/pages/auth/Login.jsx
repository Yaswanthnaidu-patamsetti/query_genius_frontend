import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Auth.css";
import { useContext, useState } from "react";
import { UserLogin } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const loginPayload = {
        input: data.input.trim(),
        password: data.password.trim(),
      };
      const response = await UserLogin(loginPayload);
      if (response.status === 200) {
        const access_token = response.data.access_token;
        login(access_token);
        toast.success("Login Success");
        setTimeout(() => navigate("/home"), 3000);
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Email or Phone"
              {...register("input", { required: "Email or phone is required" })}
            />
          </div>
          {errors.input && <p className="error">{errors.input.message}</p>}

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}

          <button type="submit">Login</button>
        </form>

        <div className="redirect">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
