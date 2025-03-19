import { KeywordSearch } from "@/components/keyword-search";
import { ResultsTable } from "@/components/results-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { KeywordResponse } from "@shared/schema";

export default function Home() {
  const [results, setResults] = useState<KeywordResponse[]>([]);
  
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from a primary to-primary/60 bg-clip-text text-transparent">
            Keyword Research Tool
          </h1>
          <p className="text-muted-foreground">
            Discover high-performing keywords for your content
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordSearch onResults={setResults} />
          </CardContent>
        </Card>

        <ResultsTable results={results} />
      </div>
    </div>
  );
}
