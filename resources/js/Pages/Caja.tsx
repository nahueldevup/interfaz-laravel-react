import { useState } from "react";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import MainLayout from "@/Layouts/MainLayout";

export default function Caja() {
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  return (
    <MainLayout>
    <div className="flex-1 flex flex-col">
      <Header title="proyecto" subtitle="Caja" />
      
      <main className="flex-1 p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setIsIncomeDialogOpen(true)}
              className="bg-success hover:bg-success/90"
            >
              REGISTRAR INGRESO
            </Button>
            <Button
              onClick={() => setIsExpenseDialogOpen(true)}
              className="bg-warning hover:bg-warning/90"
            >
              REGISTRAR EGRESO
            </Button>
          </div>

          <Button variant="link" className="mb-4 text-primary">
            <Filter className="w-4 h-4 mr-2" />
            FILTRAR
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">$ 0.00 Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                    <span>Monto</span>
                    <span>Descripción</span>
                    <span>Fecha</span>
                    <span>Usuario</span>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    No data available
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">$ 0.00 Egresos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                    <span>Monto</span>
                    <span>Descripción</span>
                    <span>Fecha</span>
                    <span>Usuario</span>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    No data available
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Income Dialog */}
      <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar ingreso</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="income-amount">Monto</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-destructive">$</span>
                <Input
                  id="income-amount"
                  type="number"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  className="pl-8"
                  placeholder="Introduce la cantidad"
                />
              </div>
              {!incomeAmount && (
                <p className="text-sm text-destructive">Introduce la cantidad</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-description">Descripción</Label>
              <Textarea
                id="income-description"
                value={incomeDescription}
                onChange={(e) => setIncomeDescription(e.target.value)}
                placeholder="Descripción"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsIncomeDialogOpen(false)}>
              CERRAR
            </Button>
            <Button className="bg-success hover:bg-success/90">
              GUARDAR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar egreso</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Monto</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-destructive">$</span>
                <Input
                  id="expense-amount"
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="pl-8"
                  placeholder="Introduce la cantidad"
                />
              </div>
              {!expenseAmount && (
                <p className="text-sm text-destructive">Introduce la cantidad</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-description">Descripción</Label>
              <Textarea
                id="expense-description"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                placeholder="Descripción"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsExpenseDialogOpen(false)}>
              CERRAR
            </Button>
            <Button className="bg-success hover:bg-success/90">
              GUARDAR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </MainLayout>
  );
}
