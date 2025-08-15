import { createFileRoute, Link } from "@tanstack/react-router";
import { Database } from "lucide-react";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a
        href="https://github.com/msyavuz/dbdesigner"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
      >
        <Database size={32} />
      </a>
      <h1 className="text-5xl font-black text-gray-900">DB Designer</h1>
      <h2 className="text-2xl font-bold text-gray-700">
        Visual Database Design Tool
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        Design and visualize database schemas with an intuitive drag-and-drop
        interface. Create tables, define relationships, and export your designs.
      </p>
      <div className="flex items-center gap-4">
        <Button variant="secondary" asChild>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/msyavuz/dbdesigner"
          >
            View Source
          </a>
        </Button>
      </div>
      <Link to="/auth/login" preload="intent">
        Login
      </Link>

      <Link to="/projects" preload="intent">
        Projects
      </Link>
    </div>
  );
}

export default App;
