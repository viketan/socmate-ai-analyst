import { X, Filter, Calendar, AlertTriangle, Shield, Activity, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold">Filters</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-cyber p-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="cyber-card p-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium">Critical</span>
              </div>
              <p className="text-2xl font-bold mt-1">12</p>
            </div>
            <div className="cyber-card p-3">
              <div className="flex items-center gap-2 text-warning">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">Open</span>
              </div>
              <p className="text-2xl font-bold mt-1">8</p>
            </div>
          </div>

          {/* Filters Section */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-2 text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">Filters</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              {/* Severity Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Severity
                </Label>
                <div className="space-y-2">
                  {["Critical", "High", "Medium", "Low"].map((severity) => (
                    <div key={severity} className="flex items-center gap-2">
                      <Checkbox id={`severity-${severity}`} defaultChecked />
                      <Label
                        htmlFor={`severity-${severity}`}
                        className={`text-sm cursor-pointer ${
                          severity === "Critical"
                            ? "text-destructive"
                            : severity === "High"
                            ? "text-warning"
                            : severity === "Medium"
                            ? "text-info"
                            : "text-success"
                        }`}
                      >
                        {severity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Status
                </Label>
                <div className="space-y-2">
                  {["Open", "Triaged", "Resolved"].map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <Checkbox id={`status-${status}`} defaultChecked />
                      <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Time Range
                </Label>
                <Select defaultValue="24h">
                  <SelectTrigger>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last 1 hour</SelectItem>
                    <SelectItem value="6h">Last 6 hours</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Alert Type */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Alert Type
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <Activity className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="identity">Identity</SelectItem>
                    <SelectItem value="endpoint">Endpoint</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* MITRE ATT&CK Quick Reference */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Active MITRE Techniques
            </Label>
            <div className="flex flex-wrap gap-1">
              {["T1110", "T1059", "T1566", "T1048", "T1078"].map((technique) => (
                <span
                  key={technique}
                  className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 cursor-pointer transition-colors"
                >
                  {technique}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="outline" className="w-full" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </aside>
    </>
  );
}
