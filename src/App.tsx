import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import AIAssistant from "./pages/AIAssistant";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>

      <div style={{ padding: 20 }}>
        <button onClick={() => setPage("dashboard")} style={{ marginRight: 10 }}>
          Dashboard
        </button>

        <button onClick={() => setPage("leads")} style={{ marginRight: 10 }}>
          Leads
        </button>

        <button onClick={() => setPage("ai")}>
          AI Assistant
        </button>
      </div>

      {page === "dashboard" && <Dashboard />}
      {page === "leads" && <Leads />}
      {page === "ai" && <AIAssistant />}

    </div>
  );
}