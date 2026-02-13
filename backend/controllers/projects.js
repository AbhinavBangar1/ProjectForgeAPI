import supabase from "../db/db.js";

export const createProject = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title required" });
  }

  const { data, error } = await supabase
    .from("Projects")
    .insert([
      {
        title,
        description,
        owner_id: req.user.id
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Failed to create project" });

  res.status(201).json(data);
};

export const getProjects = async (req, res) => {
  let query = supabase.from("Projects").select("*");

  if (req.user.role !== "admin") {
    query = query.eq("owner_id", req.user.id);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: "Failed to fetch projects" });

  res.json(data);
};

export const updateProject = async (req, res) => {
  const { id } = req.params;

  const { data: project } = await supabase
    .from("Projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) return res.status(404).json({ error: "Not found" });

  if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { title, description } = req.body;

  const { data, error } = await supabase
    .from("Projects")
    .update({ title, description })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Update failed" });

  res.json(data);
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  const { data: project } = await supabase
    .from("Projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) return res.status(404).json({ error: "Not found" });

  if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  await supabase.from("Projects").delete().eq("id", id);

  res.json({ message: "Deleted successfully" });
};
