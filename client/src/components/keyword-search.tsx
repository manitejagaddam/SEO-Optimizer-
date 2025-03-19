import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { KeywordResponse } from "@shared/schema";

interface KeywordSearchProps {
  onResults: (results: KeywordResponse[]) => void;
  value: string;
  onChange: (value: string) => void;
}

export function KeywordSearch({ onResults, value, onChange }: KeywordSearchProps) {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (searchQuery: string) => {
      const res = await apiRequest("POST", "/api/keywords/search", { query: searchQuery });
      return res.json();
    },
    onSuccess: (data: KeywordResponse[]) => {
      onResults(data);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search keywords"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    mutate(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a keyword..."
        className="flex-1"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span className="ml-2">Search</span>
      </Button>
    </form>
  );
}