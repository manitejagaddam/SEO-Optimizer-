import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButton } from "./export-button";
import type { KeywordResponse } from "@shared/schema";

interface ResultsTableProps {
  results: KeywordResponse[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Keyword Results</CardTitle>
        <ExportButton data={results} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead className="text-right">Search Volume</TableHead>
              <TableHead className="text-right">CPC</TableHead>
              <TableHead className="text-right">Competition</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{result.keyword}</TableCell>
                <TableCell className="text-right">
                  {result.searchVolume.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${result.cpc.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {(result.competition * 100).toFixed(0)}%
                </TableCell>
                <TableCell className="text-right">
                  {result.trend}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
