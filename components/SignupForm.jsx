"use client";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BriefcaseBusiness,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleRole = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  

  setLoading(true);



  setErrors({});

  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  }

  

  

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      setLoading(false);
      return;
    }

    alert("Account created successfully!");

    if (data.user.role === "EMPLOYER") {
      router.push("/employer/dashboard");
    } else {
      router.push("/jobs");
    }
  } catch (error) {
    alert("Something went wrong.");
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-purple-100 px-4 py-10">

      {/* Card */}

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-5">

        {/* Heading */}

        <h1 className="text-3xl font-bold text-center text-gray-900">
          Create Your Account
        </h1>

      <p className="text-center text-gray-500mt-2 text-sm">
  Join our community and unlock{" "}
  <span className="text-violet-600 font-semibold">
    amazing opportunities.
  </span>
</p>

        {/* Form Starts */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-6"
        >
                  {/* Full Name */}

          <div>
            <label  className="block text-xs font-semibold mb-1">
              Full Name
            </label>

            <div className="relative">

    <User
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        className="w-full h-10 rounded-2xl border border-gray-300 bg-white pl-12 pr-4 text-[15px] placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
    />

</div>

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}

        
<div>
  <label  className="block text-xs font-semibold mb-1">
    Email Address *
  </label>

  <div className="relative">
    <Mail
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="email"
      name="email"
      placeholder="Enter your email address"
      value={formData.email}
      onChange={handleChange}
      className="w-full h-10 rounded-2xl border border-gray-300 bg-white pl-12 pr-4 text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
    />
  </div>

  {errors.email && (
    <p className="text-red-500 text-sm mt-1">
      {errors.email}
    </p>
  )}
</div>

          {/* Password */}
{/* Password */}

<div>
  <label  className="block text-xs font-semibold mb-1">
    Password *
  </label>

  <div className="relative">
    <Lock
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Create a strong password"
      value={formData.password}
      onChange={handleChange}
      className="w-full h-10 rounded-2xl border border-gray-300 bg-white pl-12 pr-12 text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition"
    >
      {showPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>
  </div>

  {errors.password && (
    <p className="text-red-500 text-sm mt-1">
      {errors.password}
    </p>
  )}
</div>

       

        



          {/* Role */}

          <div>

<label  className="block text-xs font-semibold mb-1">
    I am a 
</label>

<div className="grid grid-cols-2 gap-4">

<button
  type="button"
  onClick={() => handleRole("JOB_SEEKER")}
  className={`rounded-2xl border px-3 py-1.5 transition ${
    formData.role === "JOB_SEEKER"
      ? "border-violet-500 bg-violet-50"
      : "border-gray-300 hover:border-violet-300"
  }`}
>
  <User
    size={13}
    className="mx-auto mb-1 text-violet-600"
  />

  <h3 className="font-semibold text-base">
    Job Seeker
  </h3>

  <p className="text-gray-500 text-sm mt-0.5">
    Looking for opportunities
  </p>
</button>

<button
type="button"
onClick={() => handleRole("EMPLOYER")}
className={`rounded-2xl border p-3 transition ${
formData.role==="EMPLOYER"
? "border-violet-500 bg-violet-50"
: "border-gray-300 hover:border-violet-300"
}`}
>

<BriefcaseBusiness
size={13}
className="mx-auto mb-3 text-gray-800"
/>

<h3 className="font-semibold text-base">
Employer
</h3>

<p className="text-gray-500 text-sm mt-1">
Hiring talent
</p>

</button>

</div>

</div>
                    {/* Create Account Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-lg font-semibold hover:opacity-95 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Login */}

                   

          

          {/* Terms & Privacy */}

          <p className="text-center text-sm text-gray-500 mt-3">
  Already have an account?
  <span
    onClick={() => router.push("/login")}
    className="ml-1 text-violet-600 font-medium cursor-pointer hover:underline"
  >
    Sign In
  </span>
</p>

<p className="text-center text-xs text-gray-400 mt-2">
  By continuing, you agree to our Terms & Privacy Policy.
</p>

        </form>

      </div>

    </div>
  );
}