import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxBracket } from "@/types/dot";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/formatters";

interface TaxBracketsTableProps {
  brackets: TaxBracket[];
  isEditable: boolean;
}

export function TaxBracketsTable({ brackets, isEditable }: TaxBracketsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Barème d'imposition (par tranches de CA)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="font-semibold">CA Brut Min</TableHead>
                <TableHead className="font-semibold">CA Brut Max</TableHead>
                <TableHead className="font-semibold">Taux d'imposition</TableHead>
                <TableHead className="font-semibold">Salaire max employé</TableHead>
                <TableHead className="font-semibold">Salaire max patron</TableHead>
                <TableHead className="font-semibold">Prime max employé</TableHead>
                <TableHead className="font-semibold">Prime max patron</TableHead>
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
                  <TableCell className="font-mono font-semibold text-primary">
                    {formatPercent(bracket.taux_imposition_percent)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(bracket.salaire_max_employe)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(bracket.salaire_max_patron)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(bracket.prime_max_employe)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(bracket.prime_max_patron)}
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