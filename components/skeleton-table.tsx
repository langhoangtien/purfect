import { Skeleton } from "./ui/skeleton";
import { TableBody, TableCell, TableRow } from "./ui/table";

export default function SkeletonTable({
  rows = 10,
  cols,
}: {
  rows: number;
  cols: number;
}) {
  return (
    <TableBody>
      {Array.from({ length: rows }, (_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }, (_, i) => (
            <TableCell key={i}>
              <Skeleton className="h-6 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
