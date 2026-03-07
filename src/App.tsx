import { useState } from "react";

type Lead = {
  name: string;
  project: string;
  city: string;
  phone: string;
  value: number;
  followUp: string;
};

export default function App() {

  const [leads, setLeads] = useState<Lead[]>([
    {
      name: "Donna Enders",
      project: "Deck + Awning",
      city: "Philip, SD",
      phone: "605-000-0000",
      value: 18400,
      followUp: "2026-03-08"
    },
    {
      name: "Kelly Kinsley",
      project: "Pole Barn Raise",
      city: "Kadoka, SD",
      phone: "605-000-0000",
      value: 26800,
      followUp: "2026-03-07"
    },
    {
      name: "Clara Jobgen",
      project: "Onyx Shower",
      city: "Murdo, SD",
      phone: "605-000-0000",
      value: 9600,
      followUp: "2026-03-09"
    }
  ]);

  const [form, setForm] = useState({
    name: "",
    project: "",
    city: "",
    phone: "",
    value: "",
    followUp: ""
  });

  function addLead(e:any) {
    e.preventDefault();

    const newLead = {
      name: form.name,
      project: form.project,
      city: form.city,
      phone: form.phone,
      value: Number(form.value),
      followUp: form.followUp
    };

    setLeads([newLead, ...leads]);

    setForm({
      name: "",
      project: "",
      city: "",
      phone: "",
      value: "",
      followUp: ""
    });
  }

  return (
    <div style={{ padding:40, fontFamily:"Arial", maxWidth:900 }}>

      <h1>Tailored Contracting CRM</h1>

      <h2>Add Lead</h2>

      <form onSubmit={addLead} style={{ display:"grid", gap:10 }}>

        <input
          placeholder="Client name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Project"
          value={form.project}
          onChange={(e)=>setForm({...form,project:e.target.value})}
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e)=>setForm({...form,city:e.target.value})}
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e)=>setForm({...form,phone:e.target.value})}
        />

        <input
          placeholder="Bid Value"
          type="number"
          value={form.value}
          onChange={(e)=>setForm({...form,value:e.target.value})}
        />

        <input
          type="date"
          value={form.followUp}
          onChange={(e)=>setForm({...form,followUp:e.target.value})}
        />

        <button type="submit">
          Save Lead
        </button>

      </form>

      <h2 style={{marginTop:40}}>Leads</h2>

      {leads.map((lead,i)=>(
        <div key={i} style={{marginBottom:12}}>
          {lead.name} — {lead.project} — ${lead.value}
        </div>
      ))}

    </div>
  );
}