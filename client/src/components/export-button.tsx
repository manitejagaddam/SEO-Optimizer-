import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { KeywordResponse } from "@shared/schema";

interface ExportButtonProps {
  data: KeywordResponse[];
}

export function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    const headers = ["Keyword", "Search Volume", "CPC", "Competition", "Trend"];
    const rows = data.map(item => [
      item.keyword,
      item.searchVolume,
      item.cpc.toFixed(2),
      (item.competition * 100).toFixed(0) + "%",
      item.trend
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keyword-results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
