import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDesign } from "@/hooks/use-design";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { dialectOptions, generateSQL, type Dialect } from "shared";
import { DownloadIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_protected/projects/$projectId/export/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { design } = useDesign();
  const project = useLoaderData({ from: "/_protected/projects/$projectId" });
  const selectedDialect = (project.dialect as Dialect) || "general";
  const [generatedSQL, setGeneratedSQL] = useState("");

  const handleGenerateSQL = () => {
    try {
      const sql = generateSQL({ design, dialect: selectedDialect });
      setGeneratedSQL(sql);
      toast.success("SQL generated successfully!");
    } catch (error) {
      console.error("Failed to generate SQL:", error);
      toast.error("Failed to generate SQL. Please check your design.");
    }
  };

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(generatedSQL);
      toast.success("SQL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy SQL:", error);
      toast.error("Failed to copy SQL to clipboard.");
    }
  };

  const handleDownloadSQL = () => {
    try {
      const blob = new Blob([generatedSQL], { type: "text/sql" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export_${selectedDialect}_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("SQL file downloaded!");
    } catch (error) {
      console.error("Failed to download SQL:", error);
      toast.error("Failed to download SQL file.");
    }
  };

  const hasDesignData = design.tables.length > 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export to SQL</h1>
        <p className="text-muted-foreground">
          Generate SQL scripts from your database design for different SQL dialects.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SQL Export</CardTitle>
          <CardDescription>
            Generate SQL DDL statements for your database design.
            {selectedDialect !== "general" && (
              <> Target dialect: {dialectOptions.find(d => d.value === selectedDialect)?.label}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGenerateSQL} 
            disabled={!hasDesignData}
            className="w-full"
          >
            Generate SQL
          </Button>

          {!hasDesignData && (
            <p className="text-sm text-muted-foreground">
              No tables found in your design. Please add tables in the Workbench or Tables section first.
            </p>
          )}
        </CardContent>
      </Card>

      {generatedSQL && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated SQL
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopySQL}>
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadSQL}>
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
            {selectedDialect !== "general" && (
              <CardDescription>
                SQL DDL statements for {dialectOptions.find(d => d.value === selectedDialect)?.label}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedSQL}
              readOnly
              className="min-h-[400px] font-mono text-sm"
              placeholder="Generated SQL will appear here..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}