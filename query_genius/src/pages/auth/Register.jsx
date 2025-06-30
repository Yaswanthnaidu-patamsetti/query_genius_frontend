import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import "./Auth.css";
import { UserRegistration } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.toString().trim(),
        password: data.password.trim(),
      };
      const response = await UserRegistration(userData);

      if (response.data) {
        toast.success("Registered Successfully");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      const message = error.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h3>Register</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          {errors.name && <p className="error">{errors.name.message}</p>}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors.email && <p className="error">{errors.email.message}</p>}

          <div className="input-group">
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phone", { required: "Phone number is required" })}
            />
          </div>
          {errors.phone && <p className="error">{errors.phone.message}</p>}

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

          <button type="submit">Register</button>
        </form>

        <div className="redirect">
          Already registered? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
