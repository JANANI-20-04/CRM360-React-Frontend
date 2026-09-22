import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard, Users, UserRoundSearch, KanbanSquare, ListChecks,
  Bell, Settings, LogOut, Search, Plus, MoreHorizontal, ArrowUpRight,
  ArrowDownRight, CheckCircle2, Clock3, AlertCircle, X, Menu, Moon,
  Sun, ShieldCheck, BriefcaseBusiness, UserRound, Trash2, Pencil, Eye,
  ChevronDown, Filter, Activity, Target, TrendingUp, CalendarDays
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, BarChart, Bar
} from "recharts";
import "./styles.css";

const initialCustomers = [
  { id: "CUS-1001", name: "Ravi Kumar", company: "ABC Technologies", email: "ravi@abc.com", phone: "+91 98765 43210", status: "Active", owner: "Arun" },
  { id: "CUS-1002", name: "Priya Sharma", company: "Bright Solutions", email: "priya@bright.com", phone: "+91 99887 66554", status: "Active", owner: "Meena" },
  { id: "CUS-1003", name: "Karthik Raj", company: "Nova Systems", email: "karthik@nova.com", phone: "+91 91234 56789", status: "Inactive", owner: "Arun" },
  { id: "CUS-1004", name: "Divya Mohan", company: "CloudNest", email: "divya@cloudnest.com", phone: "+91 90909 80808", status: "Active", owner: "Meena" }
];

const initialLeads = [
  { id: "LEAD-101", name: "Ananya Iyer", company: "Orbit Labs", value: 85000, stage: "New", owner: "Arun", source: "Website" },
  { id: "LEAD-102", name: "Vikram Singh", company: "FinEdge", value: 125000, stage: "Contacted", owner: "Meena", source: "Referral" },
  { id: "LEAD-103", name: "Sneha Das", company: "PixelWorks", value: 175000, stage: "Qualified", owner: "Arun", source: "LinkedIn" },
  { id: "LEAD-104", name: "Rahul Nair", company: "GreenGrid", value: 210000, stage: "Proposal Sent", owner: "Meena", source: "Website" },
  { id: "LEAD-105", name: "Asha Menon", company: "Medix Care", value: 95000, stage: "Won", owner: "Arun", source: "Event" },
  { id: "LEAD-106", name: "Sanjay Rao", company: "DataBridge", value: 70000, stage: "Lost", owner: "Meena", source: "Referral" }
];

const initialTasks = [
  { id: "TASK-01", title: "Call Ravi Kumar", related: "ABC Technologies", assignee: "Arun", due: "2026-09-15", priority: "High", status: "Pending" },
  { id: "TASK-02", title: "Send quotation", related: "FinEdge", assignee: "Meena", due: "2026-09-16", priority: "Medium", status: "In Progress" },
  { id: "TASK-03", title: "Schedule product demo", related: "PixelWorks", assignee: "Arun", due: "2026-09-17", priority: "High", status: "Completed" },
  { id: "TASK-04", title: "Update proposal document", related: "GreenGrid", assignee: "Meena", due: "2026-09-18", priority: "Low", status: "Pending" }
];

const salesData = [
  { month: "Apr", sales: 180000, leads: 24 },
  { month: "May", sales: 230000, leads: 31 },
  { month: "Jun", sales: 210000, leads: 28 },
  { month: "Jul", sales: 310000, leads: 42 },
  { month: "Aug", sales: 360000, leads: 48 },
  { month: "Sep", sales: 425000, leads: 56 }
];

const stages = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function App() {
 const [loggedIn, setLoggedIn] = useState(
  !!localStorage.getItem("crm360Token")
);

const [currentUser, setCurrentUser] = useState(() => {
  const savedUser = localStorage.getItem("crm360User");
  return savedUser ? JSON.parse(savedUser) : null;
});
  const [role, setRole] = useState("Admin");
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
 const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState(initialTasks);
  // 👇 PUT THE useEffect HERE
useEffect(() => {
  const token = localStorage.getItem("crm360Token");

  if (!token) return;

  fetch("http://localhost:5000/api/tasks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch tasks"
        );
      }

      return data;
    })
    .then(data => {
      const formattedTasks = data.tasks.map(task => ({
        id: task._id,
        title: task.title,
        related: task.related || "",
        assignee: task.assignee?.name || "Unassigned",
        due: task.due
          ? task.due.substring(0, 10)
          : "",
        priority: task.priority || "Medium",
        status: task.status || "Pending"
      }));

      setTasks(formattedTasks);
    })
    .catch(error => {
      console.error(
        "Failed to load tasks:",
        error
      );
    });
}, [loggedIn]);
useEffect(() => {
  if (!loggedIn) return;

  const token = localStorage.getItem("crm360Token");

  if (!token) return;

  fetch("http://localhost:5000/api/customers", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch customers"
        );
      }

      return data;
    })
    .then(data => {
      const formattedCustomers = data.customers.map(customer => ({
        id: customer._id,
        name: customer.name,
        company: customer.company || "",
        email: customer.email || "",
        phone: customer.phone || "",
        status: customer.status || "Active",
        owner: customer.assignedTo?.name || "Unassigned"
      }));

      setCustomers(formattedCustomers);
    })
    .catch(error => {
      console.error(
        "Failed to load customers:",
        error
      );
    });
}, [loggedIn]);
useEffect(() => {
  if (!loggedIn) return;

  const token = localStorage.getItem("crm360Token");

  if (!token) return;

  fetch("http://localhost:5000/api/leads", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch leads"
        );
      }

      return data;
    })
    .then(data => {
      const formattedLeads = data.leads.map(lead => ({
        id: lead._id,
        name: lead.name,
        company: lead.company || "",
        value: Number(lead.value || 0),
        stage: lead.status || "New",
        owner: lead.assignedTo?.name || "Unassigned",
        source: lead.source || "",
        email: lead.email || "",
        phone: lead.phone || "",
        notes: lead.notes || "",
        followUpDate: lead.followUpDate
          ? lead.followUpDate.substring(0, 10)
          : ""
      }));

      setLeads(formattedLeads);
    })
    .catch(error => {
      console.error(
        "Failed to load leads:",
        error
      );
    });
}, [loggedIn]);
  // rest of your App code continues here...
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New lead assigned to you", time: "5 min ago", read: false },
    { id: 2, text: "Task deadline is tomorrow", time: "20 min ago", read: false },
    { id: 3, text: "Lead LEAD-103 became qualified", time: "1 hour ago", read: true }
  ]);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null); 
  const stats = useMemo(() => ({
    customers: customers.length,
    leads: leads.filter(l => !["Won", "Lost"].includes(l.stage)).length,
    tasks: tasks.filter(t => t.status !== "Completed").length,
    won: leads.filter(l => l.stage === "Won").length,
    value: leads.filter(l => l.stage === "Won").reduce((sum, l) => sum + l.value, 0)
  }), [customers, leads, tasks]);

  function navigate(target) {
    setPage(target);
    setSidebarOpen(false);
    setSearch("");
  }
async function addCustomer(data) {
  try {
    const token = localStorage.getItem("crm360Token");
    const savedUser = localStorage.getItem("crm360User");
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    const response = await fetch("http://localhost:5000/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        status: data.status,
        assignedTo: currentUser?.id
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create customer");
    }

    const customer = result.customer;

    const formattedCustomer = {
      id: customer._id,
      name: customer.name,
      company: customer.company || "",
      email: customer.email || "",
      phone: customer.phone || "",
      status: customer.status || "Active",
      owner: customer.assignedTo?.name || currentUser?.name || "Unassigned"
    };

    setCustomers(prev => [formattedCustomer, ...prev]);
    setModal(null);

  } catch (error) {
    console.error("Add customer error:", error);
    alert(error.message);
  }
}
async function addLead(data) {
  try {
    const token = localStorage.getItem("crm360Token");

    const savedUser = localStorage.getItem("crm360User");
    const currentUser = savedUser
      ? JSON.parse(savedUser)
      : null;

    const response = await fetch(
      "http://localhost:5000/api/leads",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          company: data.company,
          value: Number(data.value),
          status: data.stage,
          source: data.source,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
          followUpDate: data.followUpDate,
          assignedTo: currentUser?.id
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to create lead"
      );
    }

    const lead = result.lead;

    setLeads(prev => [
      {
        id: lead._id,
        name: lead.name,
        company: lead.company || "",
        value: Number(lead.value || 0),
        stage: lead.status || "New",
        owner:
          lead.assignedTo?.name ||
          currentUser?.name ||
          "Unassigned",
        source: lead.source || "",
        email: lead.email || "",
        phone: lead.phone || "",
        notes: lead.notes || "",
        followUpDate: lead.followUpDate || ""
      },
      ...prev
    ]);

    setModal(null);

  } catch (error) {
    console.error("Add lead error:", error);
    alert(error.message);
  }
}
async function updateLead(id, data) {
  try {
    const token = localStorage.getItem("crm360Token");

    const response = await fetch(
      `http://localhost:5000/api/leads/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          company: data.company,
          value: Number(data.value),
          status: data.stage,
          source: data.source,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
          followUpDate: data.followUpDate
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to update lead"
      );
    }

    const lead = result.lead;

    setLeads(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: lead.name,
              company: lead.company || "",
              value: Number(lead.value || 0),
              stage: lead.status || "New",
              source: lead.source || "",
              email: lead.email || "",
              phone: lead.phone || "",
              notes: lead.notes || "",
              followUpDate: lead.followUpDate || ""
            }
          : item
      )
    );

    setEditingLead(null);
    setModal(null);

  } catch (error) {
    console.error("Update lead error:", error);
    alert(error.message);
  }
}
async function addTask(data) {
  try {
    const token = localStorage.getItem("crm360Token");

    const savedUser = localStorage.getItem("crm360User");
    const currentUser = savedUser
      ? JSON.parse(savedUser)
      : null;

    const response = await fetch(
      "http://localhost:5000/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: data.title,
          related: data.related,
          assignee: currentUser?.id,
          due: data.due,
          priority: data.priority,
          status: data.status
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to create task"
      );
    }

    const task = result.task;

    const formattedTask = {
      id: task._id,
      title: task.title,
      related: task.related || "",
      assignee:
        task.assignee?.name ||
        currentUser?.name ||
        "Unassigned",
      due: task.due
        ? task.due.substring(0, 10)
        : "",
      priority: task.priority || "Medium",
      status: task.status || "Pending"
    };

    setTasks(prev => [
      formattedTask,
      ...prev
    ]);

    setModal(null);

  } catch (error) {
    console.error("Add task error:", error);
    alert(error.message);
  }
}  
async function deleteCustomer(id) {
  try {
    const token = localStorage.getItem("crm360Token");

    const response = await fetch(
      `http://localhost:5000/api/customers/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete customer");
    }

    setCustomers(prev => prev.filter(customer => customer.id !== id));

  } catch (error) {
    console.error("Delete customer error:", error);
    alert(error.message);
  }
}
async function updateCustomer(id, data) {
  try {
    const token = localStorage.getItem("crm360Token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/customers/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          status: data.status
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
  throw new Error(
    result.error || result.message || "Failed to update customer"
  );
}

    const customer = result.customer;

    setCustomers(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: customer.name,
              email: customer.email || "",
              phone: customer.phone || "",
              company: customer.company || "",
              status: customer.status || "Active",
              owner:
                customer.assignedTo?.name ||
                item.owner ||
                ""
            }
          : item
      )
    );

    setEditingCustomer(null);
    setModal(null);

    alert("Customer updated successfully!");
  } catch (error) {
    console.error("Update customer error:", error);
    alert(error.message);
  }
}
async function deleteLead(id) {
  try {
    const token = localStorage.getItem("crm360Token");

    const response = await fetch(
      `http://localhost:5000/api/leads/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to delete lead"
      );
    }

    setLeads(prev =>
      prev.filter(lead => lead.id !== id)
    );

  } catch (error) {
    console.error("Delete lead error:", error);
    alert(error.message);
  }
} 
async function convertLead(id) {
  try {
    const token = localStorage.getItem("crm360Token");

    const response = await fetch(
      `http://localhost:5000/api/leads/${id}/convert`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to convert lead"
      );
    }

    // Update lead as Won
    setLeads(prev =>
      prev.map(lead =>
        lead.id === id
          ? {
              ...lead,
              stage: "Won"
            }
          : lead
      )
    );

    // Add converted customer to customer list
    if (result.customer) {
      const customer = result.customer;

      setCustomers(prev => [
        {
          id: customer._id,
          name: customer.name,
          email: customer.email || "",
          phone: customer.phone || "",
          company: customer.company || "",
          owner: currentUser?.name || "",
          status: customer.status || "Active"
        },
        ...prev
      ]);
    }

    setViewingLead(null);

    alert("Lead converted to customer successfully!");

  } catch (error) {
    console.error("Convert lead error:", error);
    alert(error.message);
  }
} 
async function updateLeadStage(id, stage) {
  try {
    const token = localStorage.getItem("crm360Token");

    const response = await fetch(
      `http://localhost:5000/api/leads/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: stage
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to update lead"
      );
    }

    setLeads(prev =>
      prev.map(lead =>
        lead.id === id
          ? {
              ...lead,
              stage: result.lead.status || stage,
              owner:
                result.lead.assignedTo?.name ||
                lead.owner
            }
          : lead
      )
    );

  } catch (error) {
    console.error(
      "Update lead stage error:",
      error
    );

    alert(error.message);
  }
}
async function deleteTask(id) {
  try {
    const token = localStorage.getItem("crm360Token");

    const response = await fetch(
      `http://localhost:5000/api/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to delete task"
      );
    }

    setTasks(prev =>
      prev.filter(task => task.id !== id)
    );

  } catch (error) {
    console.error("Delete task error:", error);
    alert(error.message);
  }
}
 async function toggleTask(id) {
  try {
    const token = localStorage.getItem("crm360Token");

    const currentTask = tasks.find(task => task.id === id);

    if (!currentTask) return;

    const newStatus =
      currentTask.status === "Completed"
        ? "Pending"
        : "Completed";

    const response = await fetch(
      `http://localhost:5000/api/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to update task"
      );
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              status:
                result.task.status || newStatus
            }
          : task
      )
    );

  } catch (error) {
    console.error("Toggle task error:", error);
    alert(error.message);
  }
}
 if (!loggedIn) {
  return (
    <LoginScreen
      role={role}
      setRole={setRole}
      onLogin={(user, token) => {
        localStorage.setItem("crm360Token", token);
        localStorage.setItem("crm360User", JSON.stringify(user));

        setCurrentUser(user);
        setRole(user.role || "Admin");
        setLoggedIn(true);
      }}
    />
  );
}
  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark">C</div>
          <div><strong>CRM<span>360</span></strong><small>Business workspace</small></div>
        </div>
        <div className="workspace">
          <span className="workspace-label">WORKSPACE</span>
          <div className="role-chip"><ShieldCheck size={15} /> {role}<ChevronDown size={14} /></div>
        </div>
        <nav>
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={page === "dashboard"} onClick={() => navigate("dashboard")} />
          <NavItem icon={<Users />} label="Customers" active={page === "customers"} onClick={() => navigate("customers")} />
          <NavItem icon={<UserRoundSearch />} label="Leads" active={page === "leads"} onClick={() => navigate("leads")} />
          <NavItem icon={<KanbanSquare />} label="Sales Pipeline" active={page === "pipeline"} onClick={() => navigate("pipeline")} />
          <NavItem icon={<ListChecks />} label="Tasks" active={page === "tasks"} onClick={() => navigate("tasks")} />
          <NavItem icon={<Activity />} label="Activity Timeline" active={page === "activity"} onClick={() => navigate("activity")} />
          <NavItem icon={<TrendingUp />} label="Reports" active={page === "reports"} onClick={() => navigate("reports")} />
        </nav>
        <div className="sidebar-bottom">
          <NavItem icon={<Settings />} label="Settings" active={page === "settings"} onClick={() => navigate("settings")} />
          <button className="nav-item" onClick={() => setLoggedIn(false)}><LogOut /> Sign out</button>
          <div className="user-mini"><div className="avatar">JR</div><div><strong>Janani R</strong><small>{role}</small></div><MoreHorizontal size={17} /></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(v => !v)}><Menu /></button>
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{pageTitle(page)}</strong></div>
          <div className="top-actions">
            <div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search anything..." /></div>
            <button className="icon-btn" onClick={() => setDark(v => !v)} title="Toggle theme">{dark ? <Sun /> : <Moon />}</button>
            <button className="notification-btn" onClick={() => setPage("notifications")}><Bell size={19} />{notifications.some(n => !n.read) && <i />}</button>
            <div className="top-avatar">JR</div>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" && (
  <Dashboard
    stats={stats}
    leads={leads}
    tasks={tasks}
    salesData={salesData}
    navigate={navigate}
    currentUser={currentUser}
  />
)}
          {page === "customers" && <Customers
  customers={customers}
  search={search}
  onAdd={() => setModal("customer")}
  onDelete={deleteCustomer}
  onEdit={customer => {
    setEditingCustomer(customer);
    setModal("editCustomer");
  }}
  onView={customer => setViewingCustomer(customer)}
/>}
          {page === "leads" && (
<Leads
  leads={leads}
  search={search}
  onAdd={() => setModal("lead")}
  onStage={updateLeadStage}
  onDelete={deleteLead}
  onEdit={lead => {
    setEditingLead(lead);
    setModal("editLead");
  }}
  onView={lead => setViewingLead(lead)}
/>
)}
          {page === "pipeline" && <Pipeline
  leads={leads}
  onStage={updateLeadStage}
  onView={setViewingLead}
  onEdit={setEditingLead}
/>}
          {page === "tasks" && (
  <Tasks
    tasks={tasks}
    search={search}
    onAdd={() => setModal("task")}
    onToggle={toggleTask}
    onDelete={deleteTask}
  />
)}
          {page === "activity" && <ActivityPage customers={customers} leads={leads} />}
          {page === "reports" && <Reports leads={leads} salesData={salesData} />}
          {page === "notifications" && <Notifications notifications={notifications} setNotifications={setNotifications} />}
          {page === "settings" && <SettingsPage role={role} setRole={setRole} />}
        </div>
      </main>

      {modal === "customer" && (
  <CustomerModal
    onClose={() => setModal(null)}
    onSave={addCustomer}
  />
)}

{modal === "editCustomer" && editingCustomer && (
  <CustomerModal
    title="Edit customer"
    initialData={editingCustomer}
    onClose={() => {
      setModal(null);
      setEditingCustomer(null);
    }}
    onSave={(data) => {
      updateCustomer(editingCustomer.id, data);
    }}
  />
)}

{modal === "lead" && (
  <LeadModal
    onClose={() => setModal(null)}
    onSave={addLead}
  />
)}

{modal === "editLead" && editingLead && (
  <LeadModal
    title="Edit lead"
    initialData={editingLead}
    onClose={() => {
      setModal(null);
      setEditingLead(null);
    }}
    onSave={(data) => {
      updateLead(editingLead.id, data);
    }}
  />
)}

{modal === "task" && (
  <TaskModal
    onClose={() => setModal(null)}
    onSave={addTask}
  />
)}

{viewingLead && (
  <LeadViewModal
    lead={viewingLead}
    onClose={() => setViewingLead(null)}
    onConvert={convertLead}
  />
)}
{viewingCustomer && (
  <CustomerViewModal
    customer={viewingCustomer}
    onClose={() => setViewingCustomer(null)}
  />
)}
    </div>
  );
}
function LoginScreen({ role, setRole, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      onLogin(data.user, data.token);

    } catch (error) {
      setError(error.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="login-logo">
          <div className="brand-mark">C</div>
          <strong>CRM<span>360</span></strong>
        </div>

        <div className="visual-copy">
          <p className="eyebrow">
            SMARTER RELATIONSHIPS. BETTER BUSINESS.
          </p>

          <h1>
            Turn every customer interaction into growth.
          </h1>

          <p>
            One powerful workspace for customers, leads, tasks,
            and sales performance.
          </p>
        </div>

        <div className="login-mini-card">
          <div className="mini-icon">
            <TrendingUp />
          </div>

          <div>
            <strong>+24.8%</strong>
            <small>Sales performance this month</small>
          </div>

          <ArrowUpRight />
        </div>
      </div>

      <div className="login-panel">
        <div className="login-heading">
          <span>WELCOME BACK</span>

          <h2>Sign in to CRM360</h2>

          <p>
            Access your business workspace and continue where you left off.
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <label>
            Email address

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Password

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              <span
                onClick={() => setShowPassword(v => !v)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </label>

          {error && (
            <div
              style={{
                color: "#dc2626",
                background: "#fef2f2",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "14px",
                fontSize: "14px"
              }}
            >
              {error}
            </div>
          )}

          <div className="form-row">
            <label className="check">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#forgot">Forgot password?</a>
          </div>

          <button
            className="primary-btn full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}

            {!loading && <ArrowUpRight size={17} />}
          </button>

        </form>

        <div className="demo-role">
          <small>DEMO ROLE</small>

          <div className="role-options">
            {["Admin", "Sales Manager", "Sales Executive"].map(r => (
              <button
                type="button"
                className={role === r ? "selected" : ""}
                onClick={() => setRole(r)}
                key={r}
              >
                {r}
              </button>
            ))}
          </div>

          <p>
            Role is now controlled by the authenticated backend user.
          </p>
        </div>

        <p className="login-footer">
          © 2026 CRM360. Frontend demonstration.
        </p>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return <button className={active ? "nav-item active" : "nav-item"} onClick={onClick}>{icon}<span>{label}</span>{label === "Notifications" && <i />}</button>;
}

function pageTitle(page) {
  return ({
    dashboard: "Dashboard",
    customers: "Customers",
    leads: "Leads",
    pipeline: "Sales Pipeline",
    tasks: "Tasks",
    activity: "Activity Timeline",
    reports: "Reports",
    notifications: "Notifications",
    settings: "Settings"
  })[page] || "Dashboard";
}


function Dashboard({
  stats,
  leads,
  tasks,
  salesData,
  navigate,
  currentUser
}) {
  const today = new Date();

  const formattedDate = today
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    })
    .toUpperCase();

  const hour = today.getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";

  const totalLeads = leads.length;

  const conversionRate =
    totalLeads > 0
      ? Math.round((stats.won / totalLeads) * 100)
      : 0;

  const wonValue = leads
    .filter(l => l.stage === "Won")
    .reduce(
      (sum, l) => sum + Number(l.value || 0),
      0
    );

  const pendingTasks = tasks.filter(
    t => t.status !== "Completed"
  );

  const completedTasks = tasks.filter(
    t => t.status === "Completed"
  );

  const highPriorityTasks = pendingTasks.filter(
    t => t.priority === "High"
  );

  return (
    <div>

      <PageHeader
        eyebrow={formattedDate}
        title={`${greeting}, ${currentUser?.name || "there"}`}
        subtitle="Here’s what’s happening across your business today."
        action="Add new"
        onAction={() => navigate("customers")}
      />

      <div className="stat-grid">

        <StatCard
          label="Total customers"
          value={stats.customers}
          change="+12.5%"
          positive
          icon={<Users />}
        />

        <StatCard
          label="Active leads"
          value={stats.leads}
          change="+8.2%"
          positive
          icon={<Target />}
        />

        <StatCard
          label="Pending tasks"
          value={stats.tasks}
          change="-4.6%"
          positive
          icon={<ListChecks />}
        />

        <StatCard
          label="Closed deals"
          value={stats.won}
          change="+18.4%"
          positive
          icon={<CheckCircle2 />}
        />

      </div>

      <div
        className="stat-grid"
        style={{ marginTop: "16px" }}
      >

        <StatCard
          label="Conversion rate"
          value={`${conversionRate}%`}
          change="Lead → Won"
          positive
          icon={<TrendingUp />}
        />

        <StatCard
          label="Won value"
          value={money(wonValue)}
          change="Closed revenue"
          positive
          icon={<ArrowUpRight />}
        />

        <StatCard
          label="Completed tasks"
          value={completedTasks.length}
          change="Completed"
          positive
          icon={<CheckCircle2 />}
        />

        <StatCard
          label="High priority"
          value={highPriorityTasks.length}
          change="Needs attention"
          positive={false}
          icon={<AlertCircle />}
        />

      </div>

      <div className="dashboard-grid">

        <section className="panel chart-panel">

          <div className="panel-heading">

            <div>
              <h3>Sales overview</h3>
              <p>
                Revenue performance over the last 6 months
              </p>
            </div>

            <button className="select-btn">
              Last 6 months
              <ChevronDown size={15} />
            </button>

          </div>

          <div className="chart-wrap">

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <AreaChart data={salesData}>

                <defs>

                  <linearGradient
                    id="salesFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#6d5dfc"
                      stopOpacity=".3"
                    />

                    <stop
                      offset="100%"
                      stopColor="#6d5dfc"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v / 1000}k`}
                />

                <Tooltip
                  formatter={v => money(v)}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6d5dfc"
                  strokeWidth={3}
                  fill="url(#salesFill)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </section>

        <section className="panel">

          <div className="panel-heading">

            <div>
              <h3>Lead conversion</h3>
              <p>Current sales funnel</p>
            </div>

            <button className="icon-btn">
              <MoreHorizontal />
            </button>

          </div>

          <div className="funnel">

            <FunnelRow
              label="New"
              count={leads.filter(l => l.stage === "New").length}
              width="100%"
            />

            <FunnelRow
              label="Contacted"
              count={leads.filter(l => l.stage === "Contacted").length}
              width="80%"
            />

            <FunnelRow
              label="Qualified"
              count={leads.filter(l => l.stage === "Qualified").length}
              width="62%"
            />

            <FunnelRow
              label="Proposal sent"
              count={leads.filter(l => l.stage === "Proposal Sent").length}
              width="45%"
            />

            <FunnelRow
              label="Won"
              count={stats.won}
              width="28%"
            />

          </div>

          <button
            className="text-btn"
            onClick={() => navigate("pipeline")}
          >
            View full pipeline
            <ArrowUpRight size={15} />
          </button>

        </section>

      </div>

      <div className="dashboard-grid lower">

        <section className="panel">

          <div className="panel-heading">

            <div>
              <h3>Recent leads</h3>
              <p>Latest opportunities added</p>
            </div>

            <button
              className="text-btn"
              onClick={() => navigate("leads")}
            >
              View all
            </button>

          </div>

          <div className="table-wrap">

            <table>

              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Company</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {leads.slice(0, 4).map(l => (
                  <tr key={l.id}>

                    <td>
                      <div className="person-cell">

                        <div className="avatar">
                          {initials(l.name)}
                        </div>

                        <div>
                          <strong>{l.name}</strong>
                          <small>{l.id}</small>
                        </div>

                      </div>
                    </td>

                    <td>{l.company || "—"}</td>

                    <td>
                      <strong>
                        {money(l.value)}
                      </strong>
                    </td>

                    <td>
                      <StatusBadge value={l.stage} />
                    </td>

                  </tr>
                ))}

                {leads.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "30px"
                      }}
                    >
                      No leads available yet.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>

        <section className="panel">

          <div className="panel-heading">

            <div>
              <h3>My tasks</h3>
              <p>Work that needs attention</p>
            </div>

            <button
              className="text-btn"
              onClick={() => navigate("tasks")}
            >
              View all
            </button>

          </div>

          <div className="task-list">

            {tasks.slice(0, 4).map(t => (

              <div
                className="task-row"
                key={t.id}
              >

                <div
                  className={
                    t.status === "Completed"
                      ? "task-check done"
                      : "task-check"
                  }
                >
                  {t.status === "Completed" ? (
                    <CheckCircle2 />
                  ) : (
                    <Clock3 />
                  )}
                </div>

                <div>

                  <strong>{t.title}</strong>

                  <small>
                    {t.related || "No relation"} · Due{" "}
                    {t.due || "No date"}
                  </small>

                </div>

                <StatusBadge value={t.priority} />

              </div>

            ))}

            {tasks.length === 0 && (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center"
                }}
              >
                <p>No tasks available.</p>
              </div>
            )}

          </div>

        </section>

      </div>

      <section
        className="panel"
        style={{ marginTop: "20px" }}
      >

        <div className="panel-heading">

          <div>
            <h3>Quick actions</h3>
            <p>Manage your CRM workflow</p>
          </div>

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px"
          }}
        >

          <button
            className="outline-btn"
            onClick={() => navigate("customers")}
          >
            <Users size={17} />
            Manage customers
          </button>

          <button
            className="outline-btn"
            onClick={() => navigate("leads")}
          >
            <Target size={17} />
            Manage leads
          </button>

          <button
            className="outline-btn"
            onClick={() => navigate("tasks")}
          >
            <ListChecks size={17} />
            Manage tasks
          </button>

          <button
            className="outline-btn"
            onClick={() => navigate("reports")}
          >
            <TrendingUp size={17} />
            View reports
          </button>

        </div>

      </section>

    </div>
  );
}



function StatCard({ label, value, change, positive, icon }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon">{icon}</div></div><h2>{value}</h2><div className="stat-bottom"><span className={positive ? "change positive" : "change"}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}</span><small>vs last month</small></div></div>;
}

function PageHeader({ eyebrow, title, subtitle, action, onAction }) {
  return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>{action && <button className="primary-btn" onClick={onAction}><Plus size={17} /> {action}</button>}</div>;
}

function Customers({
  customers,
  search,
  onAdd,
  onDelete,
  onEdit,
  onView
}) {
  const filtered = customers.filter(c =>
    `${c.name} ${c.email} ${c.company} ${c.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        eyebrow="CUSTOMER MANAGEMENT"
        title="Customers"
        subtitle="Manage customer relationships, contact details, and account ownership."
        action="Add customer"
        onAction={onAdd}
      />

      <div className="toolbar">
        <div className="filter-label">
          <Users size={16} />
          {filtered.length} customers
        </div>
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table>

            <thead>
              <tr>
                <th>Customer</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map(c => (
                <tr key={c.id}>

                  <td>
                    <div className="person-cell">
                      <div className="avatar">
                        {initials(c.name)}
                      </div>

                      <div>
                        <strong>{c.name}</strong>
                        <small>{c.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    {c.company || "—"}
                  </td>

                  <td>
                    {c.email || "—"}
                  </td>

                  <td>
                    {c.phone || "—"}
                  </td>

                  <td>
                    {c.owner || "Not assigned"}
                  </td>

                  <td>
                    <StatusBadge
                      value={c.status || "Active"}
                    />
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px"
                      }}
                    >
                      <button
                        className="table-action"
                        onClick={() => onView(c)}
                        title="View customer"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="table-action"
                        onClick={() => onEdit(c)}
                        title="Edit customer"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="table-action"
                        onClick={() => onDelete(c.id)}
                        title="Delete customer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px"
                    }}
                  >
                    No customers found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>
      </section>
    </div>
  );
}
function Leads({
  leads,
  search,
  onAdd,
  onStage,
  onDelete,
  onEdit,
  onView
}) {
  const filtered = leads.filter(l =>
    `${l.name} ${l.company} ${l.stage}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      <PageHeader
        eyebrow="OPPORTUNITY MANAGEMENT"
        title="Leads"
        subtitle="Track prospects, assign ownership, and move opportunities toward conversion."
        action="Add lead"
        onAction={onAdd}
      />

      <div className="toolbar">
        <div className="filter-label">
          <Filter size={16} />
          {filtered.length} leads
        </div>

        <button className="outline-btn">
          Filter
          <ChevronDown size={15} />
        </button>
      </div>

      <section className="panel">
        <div className="table-wrap">

          <table>

            <thead>
              <tr>
                <th>Lead</th>
                <th>Company</th>
                <th>Value</th>
                <th>Owner</th>
                <th>Stage</th>
                <th>Change stage</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map(l => (

                <tr key={l.id}>

                  <td>
                    <div className="person-cell">

                      <div className="avatar">
                        {initials(l.name)}
                      </div>

                      <div>
                        <strong>{l.name}</strong>

                        <small>
                          {l.id} · {l.source}
                        </small>
                      </div>

                    </div>
                  </td>

                  <td>
                    {l.company}
                  </td>

                  <td>
                    <strong>
                      {money(l.value)}
                    </strong>
                  </td>

                  <td>
                    {l.owner}
                  </td>

                  <td>
                    <StatusBadge value={l.stage} />
                  </td>

                  <td>

                    <select
                      className="compact-select"
                      value={l.stage}
                      onChange={e =>
                        onStage(l.id, e.target.value)
                      }
                    >
                      {stages.map(s => (
                        <option key={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                  </td>
{/* ACTIONS */}

<td>

  <div
    style={{
      display: "flex",
      gap: "8px"
    }}
  >
               
                     {/* VIEW */}
<button
  className="table-action"
  onClick={() => onView(l)}
  title="View lead"
>
  <Eye size={16} />
</button>
                      {/* EDIT */}

                      <button
                        className="table-action"
                        onClick={() => onEdit(l)}
                        title="Edit lead"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* DELETE */}

                      <button
                        className="table-action"
                        onClick={() => onDelete(l.id)}
                        title="Delete lead"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </section>

    </div>
  );
}
function Pipeline({ leads, onStage, onView, onEdit }) {
  const stageValue = stage =>
    leads
      .filter(l => l.stage === stage)
      .reduce((sum, l) => sum + Number(l.value || 0), 0);

  return (
    <div>
      <PageHeader
        eyebrow="SALES WORKFLOW"
        title="Sales pipeline"
        subtitle="Visualize every opportunity and keep your sales process moving."
        action="Pipeline view"
        onAction={() => {}}
      />

      {/* Pipeline Summary */}
      <div className="pipeline-summary">
        <div>
          <span className="summary-icon">
            <Target size={18} />
          </span>
          <strong>{leads.length}</strong>
          <span>Total opportunities</span>
        </div>

        <div>
          <span className="summary-icon">
            <TrendingUp size={18} />
          </span>
          <strong>
            {money(
              leads.reduce(
                (sum, l) => sum + Number(l.value || 0),
                0
              )
            )}
          </strong>
          <span>Total pipeline value</span>
        </div>

        <div>
          <span className="summary-icon">
            <CheckCircle2 size={18} />
          </span>
          <strong>
            {leads.filter(l => l.stage === "Won").length}
          </strong>
          <span>Closed won</span>
        </div>

        <div>
          <span className="summary-icon">
            <Clock3 size={18} />
          </span>
          <strong>
            {leads.filter(
              l => !["Won", "Lost"].includes(l.stage)
            ).length}
          </strong>
          <span>Active opportunities</span>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="pipeline-board">
        {stages.map(stage => {
          const stageLeads = leads.filter(
            l => l.stage === stage
          );

          return (
            <div className="pipeline-column" key={stage}>

              {/* Column Header */}
              <div className="column-heading">
                <div className="column-title">
                  <span
                    className={`stage-dot ${stage
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  />

                  <strong>{stage}</strong>
                </div>

                <span className="count">
                  {stageLeads.length}
                </span>
              </div>

              {/* Stage Value */}
              <div className="column-value">
                {money(stageValue(stage))}
              </div>

              {/* Lead Cards */}
              <div className="pipeline-cards">

                {stageLeads.map(l => (
                  <div
                    className="lead-card"
                    key={l.id}
                  >

                    <div className="lead-card-top">
                      <span>{l.id}</span>

                      <div className="lead-card-actions">
                        <button
                          className="mini-action"
                          title="View lead"
                          onClick={() =>
                            onView && onView(l)
                          }
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          className="mini-action"
                          title="Edit lead"
                          onClick={() =>
                            onEdit && onEdit(l)
                          }
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </div>

                    <h4>{l.name}</h4>

                    <p>
                      {l.company || "No company"}
                    </p>

                    <div className="lead-value">
                      {money(l.value)}
                    </div>

                    <div className="lead-card-bottom">

                      <div className="lead-owner">
                        <div className="avatar small">
                          {initials(l.name)}
                        </div>

                        <span>
                          {l.owner || "Unassigned"}
                        </span>
                      </div>

                      <select
                        value={l.stage}
                        onChange={e =>
                          onStage(
                            l.id,
                            e.target.value
                          )
                        }
                      >
                        {stages.map(s => (
                          <option key={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                    </div>

                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="pipeline-empty">
                    <span>
                      <Target size={18} />
                    </span>

                    <p>No opportunities</p>
                    <small>
                      Leads moved to this stage will
                      appear here.
                    </small>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tasks({
  tasks,
  search,
  onAdd,
  onToggle,
  onDelete
}) {
  const filtered = tasks.filter(t => `${t.title} ${t.related} ${t.assignee}`.toLowerCase().includes(search.toLowerCase()));
  return <div><PageHeader eyebrow="WORK MANAGEMENT" title="Tasks" subtitle="Plan follow-ups, assign responsibilities, and stay ahead of deadlines." action="Create task" onAction={onAdd} /><div className="stat-grid task-stats"><StatCard label="All tasks" value={tasks.length} change="+3" positive icon={<ListChecks />} /><StatCard label="Pending" value={tasks.filter(t => t.status === "Pending").length} change="Today" positive icon={<Clock3 />} /><StatCard label="In progress" value={tasks.filter(t => t.status === "In Progress").length} change="Active" positive icon={<Activity />} /><StatCard label="Completed" value={tasks.filter(t => t.status === "Completed").length} change="+2" positive icon={<CheckCircle2 />} /></div><section className="panel"><div className="table-wrap"><table><thead><tr><th>Task</th><th>Assignee</th><th>Due date</th><th>Priority</th><th>Status</th><th>Complete</th><th>Actions</th></tr></thead><tbody>{filtered.map(t => <tr key={t.id}><td><strong>{t.title}</strong><small>{t.id} · {t.related}</small></td><td>{t.assignee}</td><td>{t.due}</td><td><StatusBadge value={t.priority} /></td><td><StatusBadge value={t.status} /></td><td><button className={t.status === "Completed" ? "complete-btn checked" : "complete-btn"} onClick={() => onToggle(t.id)}>{t.status === "Completed" ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}</button></td>

  <td>
  <button
    className="table-action"
    onClick={() => onDelete(t.id)}
    title="Delete task"
  >
    <Trash2 size={16} />
  </button>
</td></tr>)}</tbody></table></div></section></div>;
}

function ActivityPage({ customers, leads }) {
  const items = [
    { icon: <Users />, title: "Customer database updated", desc: `${customers.length} customer records are currently available.`, time: "Today, 10:45 AM" },
    { icon: <Target />, title: "New opportunity added", desc: `${leads[0]?.name || "A new lead"} was added to the sales pipeline.`, time: "Today, 10:15 AM" },
    { icon: <CheckCircle2 />, title: "Deal successfully closed", desc: "A sales opportunity was marked as Won.", time: "Yesterday, 4:20 PM" },
    { icon: <CalendarDays />, title: "Follow-up scheduled", desc: "A new task was created for the sales team.", time: "Yesterday, 2:05 PM" }
  ];
  return <div><PageHeader eyebrow="WORKSPACE HISTORY" title="Activity timeline" subtitle="Review recent actions and customer-related events." /><section className="panel timeline">{items.map((item, i) => <div className="timeline-item" key={i}><div className="timeline-icon">{item.icon}</div><div><h3>{item.title}</h3><p>{item.desc}</p><small>{item.time}</small></div></div>)}</section></div>;
}

function Reports({ leads, salesData }) {
  return <div><PageHeader eyebrow="BUSINESS INTELLIGENCE" title="Reports & analytics" subtitle="Understand your sales performance and opportunity health." /><div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h3>Monthly revenue</h3><p>Revenue trend in INR</p></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height={300}><BarChart data={salesData}><CartesianGrid strokeDasharray="4 4" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip formatter={v => money(v)} /><Bar dataKey="sales" fill="#6d5dfc" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section><section className="panel"><div className="panel-heading"><div><h3>Pipeline health</h3><p>Opportunity distribution</p></div></div>{stages.map(s => <div className="report-row" key={s}><span>{s}</span><strong>{leads.filter(l => l.stage === s).length}</strong></div>)}</section></div></div>;
}

function Notifications({ notifications, setNotifications }) {
  return <div><PageHeader eyebrow="ALERT CENTER" title="Notifications" subtitle="Stay updated with assignments, lead changes, and upcoming deadlines." /><section className="panel notification-panel"><div className="panel-heading"><h3>All notifications</h3><button className="text-btn" onClick={() => setNotifications(n => n.map(x => ({ ...x, read: true })))}>Mark all as read</button></div>{notifications.map(n => <div className={n.read ? "notification-row read" : "notification-row"} key={n.id}><div className="notification-icon"><Bell size={18} /></div><div><strong>{n.text}</strong><small>{n.time}</small></div>{!n.read && <button className="text-btn" onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>Mark read</button>}</div>)}</section></div>;
}

function SettingsPage({ role, setRole }) {
  return <div><PageHeader eyebrow="WORKSPACE PREFERENCES" title="Settings" subtitle="Manage your demo workspace preferences." /><section className="panel settings-panel"><h3>Role preview</h3><p>Change the role used in this frontend demonstration.</p><div className="role-options wide">{["Admin", "Sales Manager", "Sales Executive"].map(r => <button className={role === r ? "selected" : ""} onClick={() => setRole(r)} key={r}>{r}</button>)}</div><hr /><h3>Security</h3><p>Backend authentication and permission enforcement should be connected in the next development phase.</p><div className="security-note"><ShieldCheck /> JWT authentication and server-side role validation are planned for backend integration.</div></section></div>;
}

function StatusBadge({ value }) {
  const cls = value.toLowerCase().replaceAll(" ", "-");
  return <span className={`badge ${cls}`}>{value}</span>;
}

function FunnelRow({ label, count, width }) {
  return <div className="funnel-row"><div className="funnel-label"><span>{label}</span><strong>{count}</strong></div><div className="funnel-track"><div style={{ width }} /></div></div>;
}

function initials(name) {
  return name.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
}

function ModalShell({ title, children, onClose }) {
  return <div className="modal-backdrop"><div className="modal"><div className="modal-heading"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X /></button></div>{children}</div></div>;
}
function CustomerModal({
  onClose,
  onSave,
  initialData = null,
  title = "Add customer"
}) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    company: initialData?.company || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    owner: initialData?.owner || "Arun",
    status: initialData?.status || "Active"
  });

  const update = e =>
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  return (
    <ModalShell title={title} onClose={onClose}>
      <form
        className="modal-form"
        onSubmit={e => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <Field
          label="Customer name"
          name="name"
          value={form.name}
          onChange={update}
          required
        />

        <Field
          label="Company"
          name="company"
          value={form.company}
          onChange={update}
          required
        />

        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          required
        />

        <Field
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={update}
          required
        />

        <div className="form-grid">
          <Field
            label="Owner"
            name="owner"
            value={form.owner}
            onChange={update}
          />

          <Field
            label="Status"
            name="status"
            value={form.status}
            onChange={update}
            options={["Active", "Inactive"]}
          />
        </div>

        <ModalActions onClose={onClose} />
      </form>
    </ModalShell>
  );
}
function CustomerViewModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <ModalShell
      title="Customer details"
      onClose={onClose}
    >
      <div className="lead-details">

        <div
          className="person-cell"
          style={{ marginBottom: "20px" }}
        >
          <div className="avatar">
            {initials(customer.name)}
          </div>

          <div>
            <strong>{customer.name}</strong>
            <small>{customer.company || "No company"}</small>
          </div>
        </div>

        <div className="form-grid">

          <div className="detail-item">
            <span>Customer ID</span>
            <strong>{customer.id}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <StatusBadge
              value={customer.status || "Active"}
            />
          </div>

          <div className="detail-item">
            <span>Company</span>
            <strong>
              {customer.company || "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Owner</span>
            <strong>
              {customer.owner || "Not assigned"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>
              {customer.email || "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Phone</span>
            <strong>
              {customer.phone || "Not provided"}
            </strong>
          </div>

        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px"
          }}
        >
          <button
            type="button"
            className="outline-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </ModalShell>
  );
}
function LeadModal({
  onClose,
  onSave,
  initialData = null,
  title = "Add lead"
}) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    company: initialData?.company || "",
    value: initialData?.value ?? "",
    stage: initialData?.stage || "New",
    owner: initialData?.owner || "Arun",
    source: initialData?.source || "Website",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    followUpDate: initialData?.followUpDate
      ? String(initialData.followUpDate).substring(0, 10)
      : "",
    notes: initialData?.notes || ""
  });

  const update = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <form
        className="modal-form"
        onSubmit={e => {
          e.preventDefault();
          onSave(form);
        }}
      >

        <Field
          label="Lead name"
          name="name"
          value={form.name}
          onChange={update}
          required
        />

        <Field
          label="Company"
          name="company"
          value={form.company}
          onChange={update}
          required
        />

        <div className="form-grid">

          <Field
            label="Estimated value (INR)"
            name="value"
            type="number"
            value={form.value}
            onChange={update}
            required
          />

          <Field
            label="Stage"
            name="stage"
            value={form.stage}
            onChange={update}
            options={stages}
          />

        </div>

        <div className="form-grid">

          <Field
            label="Owner"
            name="owner"
            value={form.owner}
            onChange={update}
            options={["Arun", "Meena"]}
          />

          <Field
            label="Source"
            name="source"
            value={form.source}
            onChange={update}
            options={[
              "Website",
              "Referral",
              "LinkedIn",
              "Event"
            ]}
          />

        </div>

        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
        />

        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={update}
        />

        <Field
          label="Follow-up date"
          name="followUpDate"
          type="date"
          value={form.followUpDate}
          onChange={update}
        />

        <Field
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={update}
          textarea
        />

        <ModalActions onClose={onClose} />

      </form>
    </ModalShell>
  );
}
function LeadViewModal({ lead, onClose, onConvert }) {
  if (!lead) return null;

  return (
    <ModalShell
      title="Lead details"
      onClose={onClose}
    >
      <div className="lead-details">

        <div
          className="person-cell"
          style={{ marginBottom: "20px" }}
        >
          <div className="avatar">
            {initials(lead.name)}
          </div>

          <div>
            <strong>{lead.name}</strong>
            <small>{lead.company}</small>
          </div>
        </div>

        <div className="form-grid">

          <div className="detail-item">
            <span>Lead ID</span>
            <strong>{lead.id}</strong>
          </div>

          <div className="detail-item">
            <span>Stage</span>
            <StatusBadge value={lead.stage} />
          </div>

          <div className="detail-item">
            <span>Estimated value</span>
            <strong>{money(lead.value)}</strong>
          </div>

          <div className="detail-item">
            <span>Owner</span>
            <strong>
              {lead.owner || "Not assigned"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Source</span>
            <strong>
              {lead.source || "Not specified"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>
              {lead.email || "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Phone</span>
            <strong>
              {lead.phone || "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Follow-up</span>
            <strong>
              {lead.followUpDate
                ? String(lead.followUpDate).substring(0, 10)
                : "Not scheduled"}
            </strong>
          </div>

        </div>

        <div
          className="detail-item"
          style={{ marginTop: "18px" }}
        >
          <span>Notes</span>

          <p>
            {lead.notes || "No notes added for this lead."}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px"
          }}
        >

          {lead.stage !== "Won" &&
            lead.stage !== "Lost" && (
              <button
                type="button"
                className="primary-btn"
                onClick={() => onConvert(lead.id)}
              >
                Convert to Customer
              </button>
            )}

          <button
            type="button"
            className="outline-btn"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </ModalShell>
  );
}

function TaskModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: "", related: "", assignee: "Arun", due: "", priority: "Medium", status: "Pending" });
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  return <ModalShell title="Create task" onClose={onClose}><form className="modal-form" onSubmit={e => { e.preventDefault(); onSave(form); }}><Field label="Task title" name="title" value={form.title} onChange={update} required /><Field label="Related customer / company" name="related" value={form.related} onChange={update} required /><div className="form-grid"><Field label="Assignee" name="assignee" value={form.assignee} onChange={update} options={["Arun", "Meena"]} /><Field label="Priority" name="priority" value={form.priority} onChange={update} options={["Low", "Medium", "High"]} /></div><Field label="Due date" name="due" type="date" value={form.due} onChange={update} required /><ModalActions onClose={onClose} /></form></ModalShell>;
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  options,
  textarea = false
}) {
  return (
    <label className="field">
      <span>{label}</span>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={4}
        />
      ) : options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </label>
  );
}

function ModalActions({ onClose }) {
  return <div className="modal-actions"><button type="button" className="outline-btn" onClick={onClose}>Cancel</button><button className="primary-btn" type="submit">Save changes <ArrowUpRight size={16} /></button></div>;
}

createRoot(document.getElementById("root")).render(<App />);
