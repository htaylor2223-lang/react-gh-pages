import { useState } from "react";

export default function AIAssistant() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<null | {
    client: string;
    project: string;
    city: string;
    budget: string;
    nextStep: string;
    followUpText: string;
    scopeDraft: string;
  }>(null);

  function analyzeNotes() {
    const lower = notes.toLowerCase();

    let project = "General Project";
    if (lower.includes("deck")) project = "Deck Project";
    if (lower.includes("roof")) project = "Roof Project";
    if (lower.includes("shower")) project = "Bathroom / Shower Project";
    if (lower.includes("pole barn")) project = "Pole Barn Project";
    if (lower.includes("siding")) project = "Siding Project";

    let city = "Unknown";
    if (lower.includes("philip")) city = "Philip, SD";
    if (lower.includes("kadoka")) city = "Kadoka, SD";
    if (lower.includes("murdo")) city = "Murdo, SD";
    if (lower.includes("rapid city")) city = "Rapid City, SD";

    let budget = "Not mentioned";
    const moneyMatch = notes.match(/\$?\d[\d,]*/);
    if (moneyMatch) budget = moneyMatch[0];

    const firstLine = notes.split("\n")[0] || "";
    const client = firstLine.trim() || "Unknown Client";

    setResult({
      client,
      project,
      city,
      budget,
      nextStep: "Call client and confirm site visit or quote details.",
      followUpText:
        "Hey, just checking in on your project and seeing if you had any questions. I’d be happy to help you get the next step scheduled.",
      scopeDraft:
        "Project includes labor, setup, and completion of the requested work based on final field measurements, selected materials, and approved scope.",
    });
  }

  return (
    <div style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <h1>AI Assistant</h1>
      <p style={{ color: "#666" }}>
        Paste rough client notes and get organized lead info back.
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste client notes here..."
        style={{
          width: "100%",
          minHeight: 180,
          padding: 12,
          fontSize: 16,
          borderRadius: 10,
          border: "1px solid #d1d5db",
          marginTop: 16,
        }}
      />

      <div style={{ marginTop: 16 }}>
        <button
          onClick={analyzeNotes}
          style={{
            padding: "12px 18px",
            borderRadius: 10,
            border: "none",
            background: "black",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Analyze Notes
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <strong>Client:</strong> {result.client}
          </div>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <strong>Project:</strong> {result.project}
          </div>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <strong>City:</strong> {result.city}
          </div>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <strong>Budget:</strong> {result.budget}
          </div>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <strong>Next Step:</strong> {result.nextStep}
          </div>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <strong>Follow-Up Text:</strong>
            <div style={{ marginTop: 8 }}>{result.followUpText}</div>
          </div>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <strong>Scope Draft:</strong>
            <div style={{ marginTop: 8 }}>{result.scopeDraft}</div>
          </div>
        </div>
      )}
    </div>
  );
}