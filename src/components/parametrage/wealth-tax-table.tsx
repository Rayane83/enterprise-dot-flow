import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WealthTaxBracket } from "@/types/dot";
import { formatCurrency, formatPercent } from "@/lib/formatters";

interface WealthTaxTableProps {
  brackets: WealthTaxBracket[];
  isEditable: boolean;
}

export function WealthTaxTable({ brackets, isEditable }: WealthTaxTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          IMPOT SUR LA RICHESSE / Taux Richesse
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="font-semibold">Richesse Min</TableHead>
                <TableHead className="font-semibold">Richesse Max</TableHead>
                <TableHead className="font-semibold">Taux</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brackets.map((bracket, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-mono">
                    {formatCurrency(bracket.min_inclusive)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(bracket.max_inclusive)}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-accent">
                    {formatPercent(bracket.taux_percent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}