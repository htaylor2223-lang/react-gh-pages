import { useState } from "react";

export default function App() {

  const [leads] = useState([
    { name: "Donna Enders", project: "Deck + Awning", value: 18400 },
    { name: "Kelly Kinsley", project: "Pole Barn Raise", value: 26800 },
    { name: "Clara Jobgen", project: "Onyx Shower", value: 9600 }
  ]);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Tailored Contracting CRM</h1>

      <h2>Leads</h2>

      {leads.map((lead, index) => (
        <div key={index}>
          {lead.name} – {lead.project} – ${lead.value}
        </div>
      ))}

    </div>
  );
}