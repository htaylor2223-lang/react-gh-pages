import { useMemo, useState } from "react";

type LeadStatus =
  | "New Lead"
  | "Contacted"
  | "Site Visit"
  | "Bid Sent"
  | "Follow Up"
  | "Won"
  | "Lost";

type PaymentStatus =
  | "Deposit Needed"
  | "Deposit Paid"
  | "Progress Payment"
  | "Final Due"
  | "Paid in Full";

type JobStatus = "Scheduled" | "In Progress" | "Waiting" | "Completed";

type Lead = {
  id: number;
  name: string;
  project: string;
  city: string;
  phone: string;
  value: number;
  followUp: string;
  status: LeadStatus;
  notes: string;
};

type Job = {
  id: number;
  client: string;
  project: string;
  location: string;
  startDate: string;
  targetFinish: string;
  progress: number;
  deposit: number;
  balance: number;
  status: JobStatus;
  paymentStatus: PaymentStatus;
  crew: string;
};

type Reminder = {
  id: number;
  text: string;
  date: string;
  priority: "High" | "Medium" | "Low";
};

const startingLeads: Lead[] = [
  {
    id: 1,
    name: "Donna Enders",
    project: "Deck + Awning",
    city: "Philip, SD",
    phone: "(605) 555-0123",
    value: 18400,
    followUp: "2026-03-08",
    status: "Bid Sent",
    notes: "Needs final color choice for decking and awning trim.",
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
    notes: "Review updated dimensions before final bid.",
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
    notes: "Ready to schedule once deposit is collected.",
  },
  {
    id: 4,
    name: "Gabe Gropper",
    project: "Composite Deck + Gutters",
    city: "Rapid City, SD",
    phone: "(605) 555-0198",
    value: 21700,
    followUp: "2026-03-06",
    status: "Follow Up",
    notes: "Call back after he reviews the updated gutter line item.",
  },
];

const startingJobs: Job[] = [
  {
    id: 1,
    client: "Donna Enders",
    project: "Deck Build",
    location: "Philip, SD",
    startDate: "2026-03-12",
    targetFinish: "2026-03-18",
    progress: 65,
    deposit: 9200,
    balance: 9200,
    status: "In Progress",
    paymentStatus: "Deposit Paid",
    crew: "Crew A",
  },
  {
    id: 2,
    client: "Dylin & Sierra",
    project: "Crawlspace Insulation",
    location: "Kadoka, SD",
    startDate: "2026-03-10",
    targetFinish: "2026-03-13",
    progress: 40,
    deposit: 2400,
    balance: 3100,
    status: "In Progress",
    paymentStatus: "Progress Payment",
    crew: "Crew B",
  },
  {
    id: 3,
    client: "Local Remodel",
    project: "Painting",
    location: "Murdo, SD",
    startDate: "2026-03-09",
    targetFinish: "2026-03-11",
    progress: 92,
    deposit: 800,
    balance: 800,
    status: "Waiting",
    paymentStatus: "Final Due",
    crew: "Sub Crew",
  },
];

const startingReminders: Reminder[] = [
  {
    id: 1,
    text: "Call Gabe Gropper about gutters",
    date: "2026-03-06",
    priority: "High",
  },
  {
    id: 2,
    text: "Send updated bid to Kelly Kinsley",
    date: "2026-03-07",
    priority: "High",
  },
  {
    id: 3,
    text: "Collect Clara Jobgen deposit",
    date: "2026-03-09",
    priority: "Medium",
  },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function cardStyle(): React.CSSProperties {
  return {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  };
}

function badgeStyle(value: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    "New Lead": { background: "#f3f4f6", color: "#374151" },
    Contacted: { background: "#dbeafe", color: "#1d4ed8" },
    "Site Visit": { background: "#cffafe", color: "#0f766e" },
    "Bid Sent": { background: "#e0e7ff", color: "#4338ca" },
    "Follow Up": { background: "#ffedd5", color: "#c2410c" },
    Won: { background: "#dcfce7", color: "#15803d" },
    Lost: { background: "#fee2e2", color: "#b91c1c" },
    Scheduled: { background: "#ede9fe", color: "#6d28d9" },
    "In Progress": { background: "#dbeafe", color: "#1d4ed8" },
    Waiting: { background: "#f3f4f6", color: "#374151" },
    Completed: { background: "#dcfce7", color: "#15803d" },
    "Deposit Needed": { background: "#fee2e2", color: "#b91c1c" },
    "Deposit Paid": { background: "#dcfce7", color: "#15803d" },
    "Progress Payment": { background: "#fef3c7", color: "#b45309" },
    "Final Due": { background: "#ffedd5", color: "#c2410c" },
    "Paid in Full": { background: "#dcfce7", color: "#15803d" },
    High: { background: "#fee2e2", color: "#b91c1c" },
    Medium: { background: "#fef3c7", color: "#b45309" },
    Low: { background: "#e0f2fe", color: "#0369a1" },
  };

  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    ...(map[value] || { background: "#f3f4f6", color: "#374151" }),
  };
}

const inputStyle: React.CSSProperties = {
  padding: 8,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  width: "100%",
  boxSizing: "border-box",
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState<Lead[]>(startingLeads);
  const [jobs, setJobs] = useState<Job[]>(startingJobs);
  const [reminders] = useState<Reminder[]>(startingReminders);

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return leads;

    return leads.filter((lead) =>
      [
        lead.name,
        lead.project,
        lead.city,
        lead.phone,
        lead.status,
        lead.notes,
        String(lead.value),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [leads, search]);

  const stats = useMemo(() => {
    const totalLeadValue = leads.reduce((sum, lead) => sum + lead.value, 0);

    const bidsOut = leads
      .filter((lead) => ["Bid Sent", "Follow Up", "Won"].includes(lead.status))
      .reduce((sum, lead) => sum + lead.value, 0);

    const wonValue = leads
      .filter((lead) => lead.status === "Won")
      .reduce((sum, lead) => sum + lead.value, 0);

    const activeJobs = jobs.filter((job) => job.status !== "Completed").length;
    const openBalance = jobs.reduce((sum, job) => sum + job.balance, 0);
    const depositCollected = jobs.reduce((sum, job) => sum + job.deposit, 0);

    return {
      totalLeads: leads.length,
      totalLeadValue,
      bidsOut,
      wonValue,
      activeJobs,
      openBalance,
      depositCollected,
    };
  }, [leads, jobs]);

  function updateLeadValue(id: number, value: string) {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id ? { ...lead, value: Number(value || 0) } : lead
      )
    );
  }

  function updateJobAmount(
    id: number,
    field: "deposit" | "balance" | "progress",
    value: string
  ) {
    setJobs((current) =>
      current.map((job) =>
        job.id === id ? { ...job, [field]: Number(value || 0) } : job
      )
    );
  }

  return (
    <div
      style={{
        padding: 32,
        fontFamily: "Arial, sans-serif",
        background: "#f4f4f5",
        minHeight: "100vh",
        color: "#111827",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Dashboard</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Live business overview for Tailored Contracting.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <input
          placeholder="Search leads, jobs, city, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 12,
            fontSize: 16,
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "white",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle()}>
          <div style={{ fontSize: 14, color: "#666" }}>Total Leads</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
            {stats.totalLeads}
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontSize: 14, color: "#666" }}>Lead Value</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
            {money(stats.totalLeadValue)}
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontSize: 14, color: "#666" }}>Bids Out</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
            {money(stats.bidsOut)}
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontSize: 14, color: "#666" }}>Won Value</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
            {money(stats.wonValue)}
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontSize: 14, color: "#666" }}>Active Jobs</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
            {stats.activeJobs}
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontSize: 14, color: "#666" }}>Open Balance</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
            {money(stats.openBalance)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle()}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Hot Leads</h2>
          <p style={{ marginTop: 0, color: "#666", marginBottom: 16 }}>
            Edit lead values directly here.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            {filteredLeads.map((lead) => (
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
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {lead.name}
                    </div>
                    <div style={{ marginTop: 4, color: "#666" }}>
                      {lead.project}
                    </div>
                  </div>

                  <span style={badgeStyle(lead.status)}>{lead.status}</span>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                    color: "#333",
                  }}
                >
                  <div>City: {lead.city || "—"}</div>
                  <div>Phone: {lead.phone || "—"}</div>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                      Lead Value
                    </div>
                    <input
                      type="number"
                      value={lead.value}
                      onChange={(e) => updateLeadValue(lead.id, e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>Follow Up: {lead.followUp || "—"}</div>
                </div>

                <div style={{ marginTop: 12, color: "#666", fontSize: 14 }}>
                  {lead.notes}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle()}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Today’s Reminders</h2>
          <p style={{ marginTop: 0, color: "#666", marginBottom: 16 }}>
            Callbacks, deposits, and material tasks.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                style={{
                  borderRadius: 12,
                  background: "#f4f4f5",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{reminder.text}</div>
                  <span style={badgeStyle(reminder.priority)}>
                    {reminder.priority}
                  </span>
                </div>

                <div style={{ marginTop: 6, color: "#666" }}>
                  {reminder.date || "No date"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={cardStyle()}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Jobs In Progress</h2>
        <p style={{ marginTop: 0, color: "#666", marginBottom: 16 }}>
          Edit deposit, balance, and progress directly here.
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          {jobs.map((job) => (
            <div
              key={job.id}
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
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {job.client}
                  </div>
                  <div style={{ marginTop: 4, color: "#666" }}>
                    {job.project}
                  </div>
                </div>

                <span style={badgeStyle(job.status)}>{job.status}</span>
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Deposit
                  </div>
                  <input
                    type="number"
                    value={job.deposit}
                    onChange={(e) =>
                      updateJobAmount(job.id, "deposit", e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Balance
                  </div>
                  <input
                    type="number"
                    value={job.balance}
                    onChange={(e) =>
                      updateJobAmount(job.id, "balance", e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Progress %
                  </div>
                  <input
                    type="number"
                    value={job.progress}
                    onChange={(e) =>
                      updateJobAmount(job.id, "progress", e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <span style={badgeStyle(job.paymentStatus)}>
                  {job.paymentStatus}
                </span>
              </div>

              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "#666",
                    marginBottom: 6,
                  }}
                >
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: 10,
                    background: "#e5e7eb",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${job.progress}%`,
                      height: "100%",
                      background: "#111827",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}