-- ProjectForge Database Schema
-- Database: PostgreSQL (Supabase)
-- This schema defines the tables for a project and issue management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS "Projects" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Issues Table
CREATE TABLE IF NOT EXISTS "Issues" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
    project_id UUID NOT NULL REFERENCES "Projects"(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES "Users"(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON "Users"(email);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON "Projects"(owner_id);
CREATE INDEX IF NOT EXISTS idx_issues_project_id ON "Issues"(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_assigned_to ON "Issues"(assigned_to);
CREATE INDEX IF NOT EXISTS idx_issues_status ON "Issues"(status);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at update
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "Users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON "Projects"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON "Issues"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data (Optional - for testing)
-- Uncomment the following to insert sample data

-- INSERT INTO "Users" (username, email, password, role) VALUES
-- ('admin', 'admin@projectforge.com', '$2b$12$hashedpassword', 'admin'),
-- ('john_doe', 'john@example.com', '$2b$12$hashedpassword', 'user');


COMMENT ON TABLE "Users" IS 'Stores user authentication and profile information';
COMMENT ON TABLE "Projects" IS 'Stores project information with owner references';
COMMENT ON TABLE "Issues" IS 'Stores issues/tasks associated with projects';

COMMENT ON COLUMN "Users".role IS 'User role: user or admin';
COMMENT ON COLUMN "Issues".status IS 'Issue status: open, in_progress, or closed';
