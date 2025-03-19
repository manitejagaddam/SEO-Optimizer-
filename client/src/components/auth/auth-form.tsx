import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UserLogin, UserRegister } from "@shared/schema";

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: async (credentials: UserLogin) => {
      await apiRequest("POST", "/api/auth/login", credentials);
    },
    onSuccess,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed"
      });
    }
  });

  const { mutate: register, isPending: isRegisterPending } = useMutation({
    mutationFn: async (credentials: UserRegister) => {
      await apiRequest("POST", "/api/auth/register", credentials);
    },
    onSuccess,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = { email, password };
    if (isLogin) {
      login(credentials);
    } else {
      register(credentials);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoginPending || isRegisterPending}
            >
              {isLoginPending || isRegisterPending ? (
                <span className="animate-spin">⏳</span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Register"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Register" : "Have an account? Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
