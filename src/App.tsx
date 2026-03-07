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
}import React, { useMemo, useState } from 'react';

type LeadStatus = 'New Lead' | 'Contacted' | 'Site Visit' | 'Bid Sent' | 'Follow Up' | 'Won' | 'Lost';
type JobStatus = 'Scheduled' | 'In Progress' | 'Waiting' | 'Completed';
type PaymentStatus = 'Deposit Needed' | 'Deposit Paid' | 'Progress Payment' | 'Final Due' | 'Paid in Full';

type Lead = {
  id: number;
  client: string;
  project: string;
  city: string;
  phone: string;
  value: number;
  status: LeadStatus;
  followUp: string;
  notes: string;
};

type Job = {
  id: number;
  client: string;
  project: string;
  startDate: string;
  progress: number;
  deposit: number;
  balance: number;
  status: JobStatus;
  paymentStatus: PaymentStatus;
};

const leadStages: LeadStatus[] = ['New Lead', 'Contacted', 'Site Visit', 'Bid Sent', 'Follow Up', 'Won', 'Lost'];
const jobStatuses: JobStatus[] = ['Scheduled', 'In Progress', 'Waiting', 'Completed'];
const paymentStatuses: PaymentStatus[] = ['Deposit Needed', 'Deposit Paid', 'Progress Payment', 'Final Due', 'Paid in Full'];
const tabs = ['Dashboard', 'Leads', 'Pipeline', 'Jobs', 'Payments', 'Reminders'];

const sampleLeads: Lead[] = [
  {
    id: 1,
    client: 'Donna Enders',
    project: 'Deck + Awning',
    city: 'Philip, SD',
    phone: '(605) 555-0123',
    value: 18400,
    status: 'Bid Sent',
    followUp: '2026-03-08',
    notes: 'Needs final color choice for decking and awning trim.',
  },
  {
    id: 2,
    client: 'Kelly Kinsley',
    project: 'Pole Barn Raise',
    city: 'Kadoka, SD',
    phone: '(605) 555-0149',
    value: 26800,
    status: 'Site Visit',
    followUp: '2026-03-07',
    notes: 'Review updated dimensions before final bid.',
  },
  {
    id: 3,
    client: 'Clara Jobgen',
    project: 'Onyx Shower',
    city: 'Murdo, SD',
    phone: '(605) 555-0174',
    value: 9600,
    status: 'Won',
    followUp: '2026-03-09',
    notes: 'Ready to schedule once deposit is collected.',
  },
  {
    id: 4,
    client: 'Gabe Gropper',
    project: 'Composite Deck + Gutters',
    city: 'Rapid City, SD',
    phone: '(605) 555-0198',
    value: 21700,
    status: 'Follow Up',
    followUp: '2026-03-06',
    notes: 'Call back after he reviews the updated gutter line item.',
  },
];

const sampleJobs: Job[] = [
  {
    id: 1,
    client: 'Donna Enders',
    project: 'Deck Build',
    startDate: '2026-03-12',
    progress: 65,
    deposit: 9200,
    balance: 9200,
    status: 'In Progress',
    paymentStatus: 'Deposit Paid',
  },
  {
    id: 2,
    client: 'Dylin & Sierra',
    project: 'Crawlspace Insulation',
    startDate: '2026-03-10',
    progress: 40,
    deposit: 2400,
    balance: 3100,
    status: 'In Progress',
    paymentStatus: 'Progress Payment',
  },
  {
    id: 3,
    client: 'Local Remodel',
    project: 'Painting',
    startDate: '2026-03-09',
    progress: 92,
    deposit: 800,
    balance: 800,
    status: 'Waiting',
    paymentStatus: 'Final Due',
  },
];

function money(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function cardClass() {
  return 'rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200';
}

function badgeClass(value: string) {
  const map: Record<string, string> = {
    Won: 'bg-green-100 text-green-700',
    Completed: 'bg-green-100 text-green-700',
    'Paid in Full': 'bg-green-100 text-green-700',
    'Deposit Paid': 'bg-green-100 text-green-700',
    'Bid Sent': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Site Visit': 'bg-cyan-100 text-cyan-700',
    Contacted: 'bg-cyan-100 text-cyan-700',
    'Follow Up': 'bg-orange-100 text-orange-700',
    Waiting: 'bg-zinc-200 text-zinc-700',
    Lost: 'bg-red-100 text-red-700',
    'Deposit Needed': 'bg-red-100 text-red-700',
    'Progress Payment': 'bg-amber-100 text-amber-700',
    'Final Due': 'bg-orange-100 text-orange-700',
    Scheduled: 'bg-purple-100 text-purple-700',
  };
  return map[value] || 'bg-zinc-100 text-zinc-700';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [reminders, setReminders] = useState<string[]>([
    'Call Gabe Gropper about gutters',
    'Send updated bid to Kelly Kinsley',
    'Collect Clara Jobgen deposit',
  ]);

  const [leadForm, setLeadForm] = useState({
    client: '',
    project: '',
    city: '',
    phone: '',
    value: '',
    followUp: '',
  });

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter((lead) =>
      [lead.client, lead.project, lead.city, lead.phone, lead.status]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [leads, search]);

  const stats = useMemo(() => {
    const bidsOut = leads
      .filter((lead) => ['Bid Sent', 'Follow Up', 'Won'].includes(lead.status))
      .reduce((sum, lead) => sum + lead.value, 0);

    const openBalance = jobs.reduce((sum, job) => sum + job.balance, 0);
    const activeJobs = jobs.filter((job) => job.status !== 'Completed').length;

    return {
      totalLeads: leads.length,
      bidsOut,
      activeJobs,
      openBalance,
    };
  }, [leads, jobs]);

  function addLead(e: React.FormEvent) {
    e.preventDefault();
    if (!leadForm.client || !leadForm.project) return;

    const newLead: Lead = {
      id: Date.now(),
      client: leadForm.client,
      project: leadForm.project,
      city: leadForm.city,
      phone: leadForm.phone,
      value: Number(leadForm.value || 0),
      status: 'New Lead',
      followUp: leadForm.followUp,
      notes: '',
    };

    setLeads((current) => [newLead, ...current]);
    setLeadForm({ client: '', project: '', city: '', phone: '', value: '', followUp: '' });
    setActiveTab('Leads');
  }

  function convertToJob(lead: Lead) {
    const exists = jobs.some((job) => job.client === lead.client && job.project.includes(lead.project));
    if (exists) return;

    const newJob: Job = {
      id: Date.now(),
      client: lead.client,
      project: lead.project,
      startDate: lead.followUp || '',
      progress: 0,
      deposit: Math.round(lead.value / 2),
      balance: Math.round(lead.value / 2),
      status: 'Scheduled',
      paymentStatus: 'Deposit Needed',
    };

    setJobs((current) => [newJob, ...current]);
    setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status: 'Won' } : item)));
    setActiveTab('Jobs');
  }

  const dashboard = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass()}>
          <div className="text-sm text-zinc-500">Total Leads</div>
          <div className="mt-3 text-3xl font-bold">{stats.totalLeads}</div>
        </div>
        <div className={cardClass()}>
          <div className="text-sm text-zinc-500">Bids Out</div>
          <div className="mt-3 text-3xl font-bold">{money(stats.bidsOut)}</div>
        </div>
        <div className={cardClass()}>
          <div className="text-sm text-zinc-500">Active Jobs</div>
          <div className="mt-3 text-3xl font-bold">{stats.activeJobs}</div>
        </div>
        <div className={cardClass()}>
          <div className="text-sm text-zinc-500">Open Balance</div>
          <div className="mt-3 text-3xl font-bold">{money(stats.openBalance)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className={cardClass()}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Hot Leads</h3>
              <p className="text-sm text-zinc-500">The people most likely to close soon.</p>
            </div>
          </div>
          <div className="space-y-3">
            {filteredLeads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{lead.client}</div>
                    <div className="text-sm text-zinc-500">{lead.project}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(lead.status)}`}>{lead.status}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-zinc-500">
                  <span>{lead.city}</span>
                  <span>{money(lead.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cardClass()}>
          <h3 className="text-lg font-semibold">Today’s Reminders</h3>
          <p className="mb-4 text-sm text-zinc-500">Keep calls and follow-ups in front of you.</p>
          <div className="space-y-3">
            {reminders.map((item, index) => (
              <div key={index} className="rounded-2xl bg-zinc-50 p-4 text-sm font-medium text-zinc-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const leadsView = (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className={cardClass()}>
        <h3 className="mb-4 text-lg font-semibold">Add Lead</h3>
        <form onSubmit={addLead} className="grid gap-3">
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="Client name" value={leadForm.client} onChange={(e) => setLeadForm({ ...leadForm, client: e.target.value })} />
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="Project" value={leadForm.project} onChange={(e) => setLeadForm({ ...leadForm, project: e.target.value })} />
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="City" value={leadForm.city} onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })} />
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="Phone" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" type="number" placeholder="Bid amount" value={leadForm.value} onChange={(e) => setLeadForm({ ...leadForm, value: e.target.value })} />
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" type="date" value={leadForm.followUp} onChange={(e) => setLeadForm({ ...leadForm, followUp: e.target.value })} />
          <button className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white">Save Lead</button>
        </form>
      </div>

      <div className={cardClass()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Lead List</h3>
            <p className="text-sm text-zinc-500">Every call, bid, and follow-up in one place.</p>
          </div>
        </div>
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-zinc-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{lead.client}</div>
                  <div className="text-sm text-zinc-500">{lead.project}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(lead.status)}`}>{lead.status}</span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-3">
                <div>{lead.city}</div>
                <div>{lead.phone}</div>
                <div>{money(lead.value)}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => convertToJob(lead)} className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white">
                  Convert to Job
                </button>
                <select
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-xs"
                  value={lead.status}
                  onChange={(e) => {
                    const value = e.target.value as LeadStatus;
                    setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status: value } : item)));
                  }}
                >
                  {leadStages.map((stage) => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const pipelineView = (
    <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-7">
      {leadStages.map((stage) => {
        const stageLeads = filteredLeads.filter((lead) => lead.status === stage);
        return (
          <div key={stage} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-semibold">{stage}</div>
              <div className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500">{stageLeads.length}</div>
            </div>
            <div className="space-y-3">
              {stageLeads.map((lead) => (
                <div key={lead.id} className="rounded-2xl bg-zinc-50 p-3">
                  <div className="font-semibold">{lead.client}</div>
                  <div className="text-sm text-zinc-500">{lead.project}</div>
                  <div className="mt-2 text-xs text-zinc-400">{money(lead.value)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const jobsView = (
    <div className={cardClass()}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Active Jobs</h3>
        <p className="text-sm text-zinc-500">Track schedule, progress, and money owed.</p>
      </div>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{job.client}</div>
                <div className="text-sm text-zinc-500">{job.project}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(job.status)}`}>{job.status}</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-400">Start</div>
                <div className="mt-1 text-sm font-medium">{job.startDate || 'TBD'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-400">Deposit</div>
                <div className="mt-1 text-sm font-medium">{money(job.deposit)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-400">Balance</div>
                <div className="mt-1 text-sm font-medium">{money(job.balance)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-400">Payment</div>
                <div className="mt-1">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(job.paymentStatus)}`}>{job.paymentStatus}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                <span>Job Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-zinc-100">
                <div className="h-3 rounded-full bg-zinc-900" style={{ width: `${job.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const paymentsView = (
    <div className={cardClass()}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Payments</h3>
        <p className="text-sm text-zinc-500">See who owes money and what stage each payment is in.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-500">
              <th className="pb-3 pr-4 font-medium">Client</th>
              <th className="pb-3 pr-4 font-medium">Project</th>
              <th className="pb-3 pr-4 font-medium">Deposit</th>
              <th className="pb-3 pr-4 font-medium">Balance</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-zinc-100">
                <td className="py-4 pr-4 font-medium">{job.client}</td>
                <td className="py-4 pr-4 text-zinc-600">{job.project}</td>
                <td className="py-4 pr-4 text-zinc-600">{money(job.deposit)}</td>
                <td className="py-4 pr-4 text-zinc-600">{money(job.balance)}</td>
                <td className="py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(job.paymentStatus)}`}>{job.paymentStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const remindersView = (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className={cardClass()}>
        <h3 className="mb-4 text-lg font-semibold">Add Reminder</h3>
        <button
          onClick={() => setReminders((current) => [`Follow up on new lead at ${new Date().toLocaleTimeString()}`, ...current])}
          className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Add Quick Reminder
        </button>
      </div>
      <div className={cardClass()}>
        <h3 className="mb-4 text-lg font-semibold">Reminder List</h3>
        <div className="space-y-3">
          {reminders.map((item, index) => (
            <div key={index} className="rounded-2xl border border-zinc-200 p-4 text-sm font-medium">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[250px_1fr]">
        <aside className="border-r border-zinc-200 bg-white p-6">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">Tailored Contracting</div>
            <h1 className="mt-2 text-2xl font-bold">CRM</h1>
            <p className="mt-2 text-sm text-zinc-500">Leads, bids, jobs, payments, and follow-ups in one place.</p>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeTab === tab ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl bg-red-50 p-4">
            <div className="text-sm font-semibold text-red-700">Daily Focus</div>
            <p className="mt-2 text-sm text-red-600">Check follow-ups first, then bids out, then jobs in progress.</p>
          </div>
        </aside>

        <main className="p-4 md:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Business Overview</h2>
              <p className="mt-1 text-sm text-zinc-500">Run Tailored Contracting from one clean dashboard.</p>
            </div>

            <input
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-zinc-400 sm:w-80"
              placeholder="Search lead, project, city, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </header>

          {activeTab === 'Dashboard' && dashboard}
          {activeTab === 'Leads' && leadsView}
          {activeTab === 'Pipeline' && pipelineView}
          {activeTab === 'Jobs' && jobsView}
          {activeTab === 'Payments' && paymentsView}
          {activeTab === 'Reminders' && remindersView}
        </main>
      </div>
    </div>
  );
}
