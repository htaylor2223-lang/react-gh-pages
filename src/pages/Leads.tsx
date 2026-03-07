import { useState } from "react";

type LeadStatus =
  | "New Lead"
  | "Contacted"
  | "Site Visit"
  | "Bid Sent"
  | "Follow Up"
  | "Won"
  | "Lost";

type Lead = {
  id: number;
  name: string;
  project: string;
  city: string;
  phone: string;
  value: number;
  followUp: string;
  status: LeadStatus;
};

const leadStatuses: LeadStatus[] = [
  "New Lead",
  "Contacted",
  "Site Visit",
  "Bid Sent",
  "Follow Up",
  "Won",
  "Lost",
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "Donna Enders",
      project: "Deck + Awning",
      city: "Philip, SD",
      phone: "(605) 555-0123",
      value: 18400,
      followUp: "2026-03-08",
      status: "Bid Sent",
    },
    {
      id: 2,
      name: "Kelly Kinsley",
      project: "Pole Barn Raise",
      city: "Kadoka, SD",
      phone: "(605) 555-0149",
      value: 26800,
      followUp: "2026-03-07",
      status: "Site Visit",
    },
    {
      id: 3,
      name: "Clara Jobgen",
      project: "Onyx Shower",
      city: "Murdo, SD",
      phone: "(605) 555-0174",
      value: 9600,
      followUp: "2026-03-09",
      status: "Won",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    project: "",
    city: "",
    phone: "",
    value: "",
    followUp: "",
    status: "New Lead" as LeadStatus,
  });

  function addLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name || !form.project) return;

    const newLead: Lead = {
      id: Date.now(),
      name: form.name,
      project: form.project,
      city: form.city,
      phone: form.phone,
      value: Number(form.value || 0),
      followUp: form.followUp,
      status: form.status,
    };

    setLeads([newLead, ...leads]);

    setForm({
      name: "",
      project: "",
      city: "",
      phone: "",
      value: "",
      followUp: "",
      status: "New Lead",
    });
  }

  function updateLeadStatus(id: number, status: LeadStatus) {
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  }

  function convertToJob(lead: Lead) {
    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id ? { ...item, status: "Won" } : item
      )
    );

    alert(
      `${lead.name} marked as Won. Later this button will create a real job record automatically.`
    );
  }

  return (
    <div style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Leads</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Track every customer from first call to closed job.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            background: "#fff",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Add Lead</h2>

          <form onSubmit={addLead} style={{ display: "grid", gap: 12 }}>
            <input
              placeholder="Client name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ padding: 12, fontSize: 16 }}
            />

            <input
              placeholder="Project"
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              style={{ padding: 12, fontSize: 16 }}
            />

            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={{ padding: 12, fontSize: 16 }}
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{ padding: 12, fontSize: 16 }}
            />

            <input
              placeholder="Estimated value"
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              style={{ padding: 12, fontSize: 16 }}
            />

            <input
              type="date"
              value={form.followUp}
              onChange={(e) => setForm({ ...form, followUp: e.target.value })}
              style={{ padding: 12, fontSize: 16 }}
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as LeadStatus })
              }
              style={{ padding: 12, fontSize: 16 }}
            >
              {leadStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                padding: 12,
                fontSize: 16,
                fontWeight: 700,
                background: "black",
                color: "white",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Save Lead
            </button>
          </form>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            background: "#fff",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Lead List</h2>

          <div style={{ display: "grid", gap: 14 }}>
            {leads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "start",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                      {lead.name}
                    </div>
                    <div style={{ marginTop: 4, color: "#666" }}>
                      {lead.project}
                    </div>
                  </div>

                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateLeadStatus(lead.id, e.target.value as LeadStatus)
                    }
                    style={{ padding: 8 }}
                  >
                    {leadStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 8,
                    marginTop: 14,
                    color: "#333",
                  }}
                >
                  <div>City: {lead.city || "—"}</div>
                  <div>Phone: {lead.phone || "—"}</div>
                  <div>Value: ${lead.value}</div>
                  <div>Follow Up: {lead.followUp || "—"}</div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <button
                    onClick={() => convertToJob(lead)}
                    style={{
                      padding: "10px 14px",
                      fontWeight: 700,
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                  >
                    Convert to Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}