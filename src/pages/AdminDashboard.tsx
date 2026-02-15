import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AccessLog {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  device_type: string | null;
  referrer: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [total, setTotal] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [mobileCount, setMobileCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      navigate("/admin/login");
      return;
    }

    await loadLogs();
  };

  const loadLogs = async () => {
    const { data, count } = await supabase
      .from("access_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(100);

    if (data) {
      setLogs(data);
      setTotal(count || 0);

      const today = new Date().toISOString().split("T")[0];
      setTodayCount(data.filter((l) => l.created_at.startsWith(today)).length);
      setMobileCount(data.filter((l) => l.device_type === "mobile").length);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-4 border-secondary border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 overflow-auto">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-primary">Painel Admin</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total de Acessos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold text-primary">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold text-foreground">{todayCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Mobile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold text-foreground">{mobileCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Logs table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Últimos 100 acessos</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead className="hidden md:table-cell">User Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.device_type === "mobile" ? "default" : "secondary"}>
                        {log.device_type || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">
                      {log.referrer || "direto"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs max-w-[200px] truncate">
                      {log.user_agent || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
