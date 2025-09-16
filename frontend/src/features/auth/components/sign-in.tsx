import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CustomInput from "@/components/ui/customInput";
import { memo, useState } from "react";

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your email below to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6">
          <CustomInput
            id="email"
            label="Email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange("email")}
          />

          <CustomInput
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
          >
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </CustomInput>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(SignInForm);
