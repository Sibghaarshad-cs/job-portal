"use client";
import { Eye, EyeOff } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "../schemas/loginSchema";
export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});


    // Zod Validation

    const result = loginSchema.safeParse(formData);


    if (!result.success) {

      const fieldErrors = {};

      result.error.issues.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });

      setErrors(fieldErrors);
      setLoading(false);
      return;
    }



    try {

      const response = await fetch("/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });


      const data = await response.json();



      if (!response.ok) {

        setErrors({
          general: data.message,
        });

        setLoading(false);
        return;
      }



      alert("Login successful!");

      router.push("/dashboard");



    } catch (error) {

      setErrors({
        general: "Something went wrong",
      });

    }


    setLoading(false);

  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-purple-100 px-4 py-10">


      <div className="w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-gray-100 px-12 py-10">


       <h1 className="text-5xl font-bold text-center text-gray-900">
  Welcome Back
</h1>

<p className="text-center text-purple-500 mt-3 text-lg">
  Login to continue your journey.
</p>


        <form
          onSubmit={handleSubmit}
         className="space-y-5 mt-10"
        >



          {/* General Error */}

          {errors.general && (
            <p className="text-red-500 text-center">
              {errors.general}
            </p>
          )}



          {/* Email */}

          <div>

            <label className="block mb-2 text-[15px] font-semibold text-gray-900">
              Email Address
            </label>


            <input

              type="email"

              name="email"

              placeholder="Enter your email"

              value={formData.email}

              onChange={handleChange}

              className="w-full h-14 rounded-2xl border border-gray-300 px-5 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"

            />


            {errors.email && (

              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>

            )}

          </div>




          {/* Password */}

          <div>


            <label className="block mb-2 text-[15px] font-semibold text-gray-900">
              Password
            </label>



            <div className="relative">


              <input

                type={showPassword ? "text" : "password"}

                name="password"

                placeholder="Enter password"

                value={formData.password}

                onChange={handleChange}


               className="w-full h-14 rounded-2xl border border-gray-300 px-5 pr-20 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
              />


<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition"
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





          {/* Login Button */}


          <button

            type="submit"

            disabled={loading}

           className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-lg hover:opacity-95 transition disabled:opacity-60"
          >

            {loading ? "Signing In..." : "Sign In"}

          </button>





          {/* Signup Link */}


         <p className="text-center text-gray-500 mt-2">


            Don't have an account?


            <span

              onClick={() => router.push("/signup")}

              className="text-purple-600 cursor-pointer ml-2"

            >

              Create one here

            </span>


          </p>



        </form>


      </div>


    </div>

  );
}