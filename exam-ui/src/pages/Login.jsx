import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Navigate } from "react-router-dom";



/* ===============================
   Motion Variants
================================ */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatingFormula = {
  animate: {
    y: [-10, 10, -10],
    opacity: [0.15, 0.25, 0.15],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const result = await response.json();
      localStorage.setItem('token', result.access_token);
      setSuccess(true);
      console.log("Login successful");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center overflow-hidden px-4">

      {/* Floating Academic Formulas */}
      <motion.div
        variants={floatingFormula}
        animate="animate"
        className="absolute top-20 left-16 text-white text-2xl font-mono"
      >
        ∫ eˣ dx
      </motion.div>

      <motion.div
        variants={floatingFormula}
        animate="animate"
        className="absolute bottom-24 right-20 text-white text-xl font-mono"
      >
        E = mc²
      </motion.div>

      <motion.div
        variants={floatingFormula}
        animate="animate"
        className="absolute top-1/6 right-1/3 text-white text-lg font-mono "
      >
        a² + b² = c²
      </motion.div>

      {/* Glass Card */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Exam Hub
          </h1>
          <p className="text-sm text-white/70 mt-1">
            Precision learning. Serious results.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={item}>
            <Label className="text-white/80">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <Input
                type="email"
                required
                placeholder="student@examhub.com"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                {...register("email")}
              />
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Label className="text-white/80">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={item} whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-slate-900 hover:bg-white/90 h-11 font-semibold"
            >
              {loading ? "Authenticating…" : "Enter Exam Hub"}
              {success && <Navigate to="/dashboard" />}
            </Button>
            {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
          </motion.div>
        </form>

        <motion.p
          variants={item}
          className="text-center text-xs text-white/50 mt-6"
        >
          Built for focus, mastery, and exam success
        </motion.p>
      </motion.div>
    </div>
  );
}
