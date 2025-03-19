import { KeywordSearch } from "@/components/keyword-search";
import { ResultsTable } from "@/components/results-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { KeywordResponse } from "@shared/schema";
import { AuthForm } from "@/components/auth/auth-form";
import { SearchHistory } from "@/components/user-profile/search-history";
import { AISuggestions } from "@/components/ai-suggestions";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KeywordResponse[]>([]);

  const { data: session, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false
  });

  const isAuthenticated = !!session?.userId;

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const handleSearch = (searchResults: KeywordResponse[]) => {
    setResults(searchResults);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Keyword Research Tool
          </h1>
          <p className="text-muted-foreground">
            Discover high-performing keywords for your content
          </p>
        </div>

        {!isAuthenticated ? (
          <AuthForm onSuccess={() => window.location.reload()} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordSearch 
                    onResults={handleSearch}
                    value={query}
                    onChange={setQuery}
                  />
                </CardContent>
              </Card>

              <AISuggestions 
                query={query}
                onSuggestionClick={handleSuggestionClick}
              />

              <ResultsTable results={results} />
            </div>

            <div className="space-y-6">
              <SearchHistory />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}