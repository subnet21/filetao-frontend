import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/auth/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Error } from "@/components/common/Error";
import Navbar from "@/components/common/navbar";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  //get base API URL from environment variables
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

  const registerUser = async (username, password) => {
    try {
      const url = `${BASE_URL}/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(`Registration failed: ${data.detail || "Please try again."}`);
      }
    } catch (error) {
      setError(
        `Registration failed: ${error.message || "Unexpected error occurred."}`
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    await registerUser(username, password);
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen px-5">
        <Card className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl">Register</CardTitle>
              <CardDescription>
                Enter a username and password to register.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="user1"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="off"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <Error message={error} />}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
