import { useState, useEffect } from "react";

type LeadStatus =
  | "New Lead"
  | "Contacted"
  | "Site Visit"
  | "Bid Sent"
  | "Won"
  | "Lost";

type Lead = {
  id: number;
  name: string;
  project: string;
  city: string;
  phone: string;
  value: number;
  status: LeadStatus;
};

type Job = {
  id: number;
  client: string;
  project: string;
  deposit: number;
  balance: number;
};

type Reminder = {
  id: number;
  text: string;
  date: string;
};

const statuses: LeadStatus[] = [
  "New Lead",
  "Contacted",
  "Site Visit",
  "Bid Sent",
  "Won",
  "Lost",
];

export default function App() {
  const [page, setPage] = useState("Dashboard");

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem("leads");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Donna Enders",
            project: "Deck + Awning",
            city: "Philip",
            phone: "",
            value: 18400,
            status: "Bid Sent",
          },
          {
            id: 2,
            name: "Kelly Kinsley",
            project: "Pole Barn Raise",
            city: "Kadoka",
            phone: "",
            value: 26800,
            status: "Site Visit",
          },
        ];
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [form, setForm] = useState({
    name: "",
    project: "",
    city: "",
    phone: "",
    value: "",
  });

  const [reminderForm, setReminderForm] = useState({
    text: "",
    date: "",
  });

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  function addLead(e: any) {
    e.preventDefault();

    const newLead: Lead = {
      id: Date.now(),
      name: form.name,
      project: form.project,
      city: form.city,
      phone: form.phone,
      value: Number(form.value),
      status: "New Lead",
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

  function convertToJob(lead: Lead) {
    const job: Job = {
      id: Date.now(),
      client: lead.name,
      project: lead.project,
      deposit: lead.value / 2,
      balance: lead.value / 2,
    };

    setJobs([job, ...jobs]);

    setLeads(
      leads.map((l) =>
        l.id === lead.id ? { ...l, status: "Won" } : l
      )
    );
  }

  function addReminder(e: any) {
    e.preventDefault();

    const newReminder: Reminder = {
      id: Date.now(),
      text: reminderForm.text,
      date: reminderForm.date,
    };

    setReminders([newReminder, ...reminders]);

    setReminderForm({
      text: "",
      date: "",
    });
  }

  const bidsValue = leads
    .filter((l) => l.status === "Bid Sent" || l.status === "Won")
    .reduce((a, b) => a + b.value, 0);

  const openBalance = jobs.reduce((a, b) => a + b.balance, 0);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Tailored Contracting CRM</h1>

      <div style={{ marginBottom: 30 }}>
        {["Dashboard", "Leads", "Pipeline", "Jobs", "Payments", "Reminders"].map(
          (p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{ marginRight: 10 }}
            >
              {p}
            </button>
          )
        )}
      </div>

      {page === "Dashboard" && (
        <div>
          <h2>Business Overview</h2>

          <p>Total Leads: {leads.length}</p>
          <p>Bids Out: ${bidsValue}</p>
          <p>Active Jobs: {jobs.length}</p>
          <p>Open Balance: ${openBalance}</p>
        </div>
      )}

      {page === "Leads" && (
        <div>
          <h2>Add Lead</h2>

          <form onSubmit={addLead}>
            <input
              placeholder="Client"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Project"
              value={form.project}
              onChange={(e) =>
                setForm({ ...form, project: e.target.value })
              }
            />

            <input
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              placeholder="Bid Value"
              type="number"
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: e.target.value })
              }
            />

            <button type="submit">Save Lead</button>
          </form>

          <h2>Leads</h2>

          {leads.map((lead) => (
            <div key={lead.id}>
              {lead.name} — {lead.project} — ${lead.value} — {lead.status}

              <button onClick={() => convertToJob(lead)}>
                Convert to Job
              </button>
            </div>
          ))}
        </div>
      )}

      {page === "Pipeline" && (
        <div>
          <h2>Pipeline</h2>

          {statuses.map((status) => (
            <div key={status}>
              <h3>{status}</h3>

              {leads
                .filter((l) => l.status === status)
                .map((lead) => (
                  <div key={lead.id}>
                    {lead.name} — ${lead.value}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {page === "Jobs" && (
        <div>
          <h2>Jobs</h2>

          {jobs.map((job) => (
            <div key={job.id}>
              {job.client} — {job.project}

              <p>Deposit: ${job.deposit}</p>
              <p>Balance: ${job.balance}</p>
            </div>
          ))}
        </div>
      )}

      {page === "Payments" && (
        <div>
          <h2>Payments</h2>

          {jobs.map((job) => (
            <div key={job.id}>
              {job.client} — Balance Due: ${job.balance}
            </div>
          ))}
        </div>
      )}

      {page === "Reminders" && (
        <div>
          <h2>Add Reminder</h2>

          <form onSubmit={addReminder}>
            <input
              placeholder="Reminder"
              value={reminderForm.text}
              onChange={(e) =>
                setReminderForm({
                  ...reminderForm,
                  text: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={reminderForm.date}
              onChange={(e) =>
                setReminderForm({
                  ...reminderForm,
                  date: e.target.value,
                })
              }
            />

            <button type="submit">Save Reminder</button>
          </form>

          <h2>Reminders</h2>

          {reminders.map((r) => (
            <div key={r.id}>
              {r.text} — {r.date}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}