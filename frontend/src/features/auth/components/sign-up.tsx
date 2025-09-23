import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomInput from "@/components/ui/customInput";
import { memo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "@/constants";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signUp(formData);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Account</CardTitle>
        <CardDescription>
          Enter your email below to create your new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <CustomInput
            id="name"
            label="Name"
            type="text"
            placeholder="Jasir Basheeer"
            value={formData.name}
            onChange={handleChange("name")}
            required
          />

          <CustomInput
            id="email"
            label="Email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange("email")}
            required
          />

          <CustomInput
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
            required
          />

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              to={`/auth${ROUTES.AUTH.SIGN_IN}`}
              className="underline underline-offset-4"
            >
              Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(SignUpForm);
