import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AISuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
}

export function AISuggestions({ query, onSuggestionClick }: AISuggestionsProps) {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["/api/keywords/suggest", query],
    queryFn: async () => {
      if (!query) return [];
      const res = await fetch("/api/keywords/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      return res.json();
    },
    enabled: !!query,
  });

  if (!query || isLoading || !suggestions?.length) return null;

  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion: string, index: number) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
