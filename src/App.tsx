import { useState } from "react";

export default function App() {

const [leads, setLeads] = useState<{name:string, project:string, value:number}[]>([
    { name: "Donna Enders", project: "Deck + Awning", value: 18400 },
    { name: "Kelly Kinsley", project: "Pole Barn Raise", value: 26800 },
    { name: "Clara Jobgen", project: "Onyx Shower", value: 9600 }
  ]);

  return (
    <div style={{padding:40,fontFamily:"Arial"}}>
      
      <h1>Tailored Contracting CRM</h1>

      <h2>Leads</h2>

      {leads.map((lead,index)=>(
        <div key={index} style={{marginBottom:10}}>
          <b>{lead.name}</b> – {lead.project} – ${lead.value}
        </div>
      ))}

    </div>
  );
}