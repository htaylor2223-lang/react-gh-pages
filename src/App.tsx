import { useEffect, useState } from "react";

type Lead = {
  name: string;
  project: string;
  city: string;
  phone: string;
  value: number;
};

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem("leads");
    return saved
      ? JSON.parse(saved)
      : [
          {
            name: "Donna Enders",
            project: "Deck + Awning",
            city: "Philip",
            phone: "",
            value: 18400,
          },
          {
            name: "Kelly Kinsley",
            project: "Pole Barn Raise",
            city: "Kadoka",
            phone: "",
            value: 26800,
          },
          {
            name: "Clara Jobgen",
            project: "Onyx Shower",
            city: "Murdo",
            phone: "",
            value: 9600,
          },
        ];
  });

  const [form, setForm] = useState({
    name: "",
    project: "",
    city: "",
    phone: "",
    value: "",
  });

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  function addLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name || !form.project) return;

    const newLead: Lead = {
      name: form.name,
      project: form.project,
      city: form.city,
      phone: form.phone,
      value: Number(form.value || 0),
    };

    setLeads([newLead, ...leads]);

    setForm({
      name: "",
      project: "",
      city: "",
      phone: "",
      value: "",
    });
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial", maxWidth: 900 }}>
      <h1>Tailored Contracting CRM</h1>

      <h2>Add Lead</h2>

      <form onSubmit={addLead} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Client name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Project"
          value={form.project}
          onChange={(e) => setForm({ ...form, project: e.target.value })}
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Bid Value"
          type="number"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />

        <button type="submit">Save Lead</button>
      </form>

      <h2 style={{ marginTop: 40 }}>Leads</h2>

      {leads.map((lead, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          {lead.name} — {lead.project} — ${lead.value}
        </div>
      ))}
    </div>
  );
}