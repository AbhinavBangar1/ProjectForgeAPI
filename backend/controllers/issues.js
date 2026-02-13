import supabase from "../db/db.js";

export const createIssue = async (req, res) => {
  const { title, description, status, project_id } = req.body;

  if (!title || !project_id) {
    return res.status(400).json({ error: "Title and project_id are required" });
  }

  const { data, error } = await supabase
    .from("Issues")
    .insert([
      {
        title,
        description,
        status: status || "open",
        project_id,
        assigned_to: req.user.id
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Failed to create issue" });

  res.status(201).json(data);
};

export const getIssues = async (req, res) => {
  const { project_id } = req.query;

  if (!project_id) {
    return res.status(400).json({ error: "project_id query parameter is required" });
  }

  const { data, error } = await supabase
    .from("Issues")
    .select("*")
    .eq("project_id", project_id);

  if (error) return res.status(500).json({ error: "Failed to fetch issues" });

  res.json(data);
};

export const updateIssue = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const { data: issue } = await supabase
    .from("Issues")
    .select("*")
    .eq("id", id)
    .single();

  if (!issue) return res.status(404).json({ error: "Issue not found" });

  // Check authorization (owner or admin)
  if (req.user.role !== "admin" && issue.assigned_to !== req.user.id) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("Issues")
    .update({ title, description, status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Update failed" });

  res.json(data);
};

export const deleteIssue = async (req, res) => {
  const { id } = req.params;

  const { data: issue } = await supabase
    .from("Issues")
    .select("*")
    .eq("id", id)
    .single();

  if (!issue) return res.status(404).json({ error: "Issue not found" });

  // Check authorization (owner or admin)
  if (req.user.role !== "admin" && issue.assigned_to !== req.user.id) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  await supabase.from("Issues").delete().eq("id", id);

  res.json({ message: "Deleted successfully" });
};
