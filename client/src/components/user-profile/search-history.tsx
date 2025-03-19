import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { SearchHistory } from "@shared/schema";

export function SearchHistory() {
  const { data: history, isLoading } = useQuery<SearchHistory[]>({
    queryKey: ["/api/user/history"],
  });

  if (isLoading) {
    return <div>Loading history...</div>;
  }

  if (!history?.length) {
    return <div>No search history found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Query</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.query}</TableCell>
                <TableCell>
                  {format(new Date(item.searchedAt), "MMM d, yyyy HH:mm")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
