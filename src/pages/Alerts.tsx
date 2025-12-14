import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  Clock,
  Plus,
  FileJson,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { mockAlerts } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAlerts = mockAlerts.filter(
    (alert) =>
      alert.Input.AlertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.AlertID.toString().includes(searchQuery)
  );

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "severity-critical";
      case "High":
        return "severity-high";
      case "Medium":
        return "severity-medium";
      case "Low":
        return "severity-low";
      default:
        return "";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Open":
        return "status-open";
      case "Triaged":
        return "status-triaged";
      case "Resolved":
        return "status-resolved";
      default:
        return "";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmitAlert = () => {
    try {
      JSON.parse(jsonInput);
      // In a real app, this would POST to the backend
      alert("Alert submitted successfully! (Demo mode)");
      setJsonInput("");
      setIsDialogOpen(false);
    } catch {
      alert("Invalid JSON format. Please check your input.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-warning" />
            Alerts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor and manage security alerts
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-glow">
              <Plus className="h-4 w-4 mr-2" />
              Submit Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-primary" />
                Submit New Alert
              </DialogTitle>
              <DialogDescription>
                Paste your JSON alert data below. The system will automatically
                process and enrich the alert.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder='{"AlertName": "...", "AlertSeverity": "...", ...}'
                className="min-h-[200px] font-mono text-sm"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitAlert}>
                  Submit Alert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Bar */}
      <div className="cyber-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts by ID or name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            All ({mockAlerts.length})
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-destructive/10 text-destructive border-destructive/30">
            Critical ({mockAlerts.filter((a) => a.Input.AlertSeverity === "Critical").length})
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-warning/10 text-warning border-warning/30">
            High ({mockAlerts.filter((a) => a.Input.AlertSeverity === "High").length})
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-destructive/10 status-open">
            Open ({mockAlerts.filter((a) => a.Status === "Open").length})
          </Badge>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-24">Alert ID</TableHead>
                <TableHead>Alert Name</TableHead>
                <TableHead className="w-24">Severity</TableHead>
                <TableHead>MITRE</TableHead>
                <TableHead className="w-32">Source</TableHead>
                <TableHead className="w-32">Time</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow
                  key={alert.AlertID}
                  className={cn(
                    "cursor-pointer transition-colors border-border hover:bg-primary/5",
                    alert.Input.AlertSeverity === "Critical" && "bg-destructive/5"
                  )}
                  onClick={() => navigate(`/alerts/${alert.AlertID}`)}
                >
                  <TableCell className="font-mono text-sm text-primary">
                    #{alert.AlertID.toString().padStart(4, "0")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{alert.Input.AlertName}</span>
                      <span className="text-xs text-muted-foreground">
                        {alert.Input.Entities.slice(0, 2)
                          .map((e) => e.Value)
                          .join(", ")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getSeverityClass(alert.Input.AlertSeverity))}
                    >
                      {alert.Input.AlertSeverity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {alert.Input.MITREAttackTechniques.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 text-[10px] font-mono bg-primary/10 text-primary rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alert.Input.ProviderName.replace("Microsoft ", "").replace("Azure ", "")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(alert.Input.Timestamp)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getStatusClass(alert.Status))}
                    >
                      {alert.Status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
