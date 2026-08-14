-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    slack_handle VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    priority VARCHAR(20) DEFAULT 'Medium',
    owner_id UUID REFERENCES users(id),
    start_date DATE,
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requirements table
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    priority VARCHAR(20) DEFAULT 'Medium',
    type VARCHAR(50) NOT NULL,
    source VARCHAR(50) NOT NULL,
    requestor_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    assigned_ba_id UUID REFERENCES users(id),
    business_justification TEXT,
    expected_outcomes TEXT,
    stakeholder_ids JSONB DEFAULT '[]',
    sentiment_score DECIMAL(3,2),
    sentiment VARCHAR(20),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create backlog_items table
CREATE TABLE backlog_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'To Do',
    priority VARCHAR(20) DEFAULT 'Medium',
    type VARCHAR(50) NOT NULL,
    effort_points INTEGER,
    business_value INTEGER,
    cluster VARCHAR(100),
    project_id UUID REFERENCES projects(id),
    assigned_to UUID REFERENCES users(id),
    due_date DATE,
    dependency_ids JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meetings table
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'Scheduled',
    organizer_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    agenda TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_attendees table
CREATE TABLE meeting_attendees (
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'Invited',
    responded_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (meeting_id, user_id)
);

-- Create decisions table
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    meeting_id UUID REFERENCES meetings(id),
    made_by UUID REFERENCES users(id),
    decided_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create action_items table
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',
    meeting_id UUID REFERENCES meetings(id),
    assignee_id UUID REFERENCES users(id),
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT,
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(50) DEFAULT 'Draft',
    author_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create solution_designs table
CREATE TABLE solution_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    project_id UUID REFERENCES projects(id),
    author_id UUID REFERENCES users(id),
    components JSONB DEFAULT '[]',
    diagram_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    author_id UUID REFERENCES users(id),
    parent_id UUID REFERENCES comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lead_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    role VARCHAR(100),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

-- Create stakeholders table
CREATE TABLE stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(100),
    department VARCHAR(100),
    influence_level VARCHAR(20) DEFAULT 'Medium',
    project_id UUID REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_requirements_status ON requirements(status);
CREATE INDEX idx_requirements_priority ON requirements(priority);
CREATE INDEX idx_requirements_submitted_at ON requirements(submitted_at);
CREATE INDEX idx_backlog_items_status ON backlog_items(status);
CREATE INDEX idx_backlog_items_priority ON backlog_items(priority);
CREATE INDEX idx_backlog_items_cluster ON backlog_items(cluster);
CREATE INDEX idx_meetings_scheduled_at ON meetings(scheduled_at);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_backlog_items_updated_at BEFORE UPDATE ON backlog_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_decisions_updated_at BEFORE UPDATE ON decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON action_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solution_designs_updated_at BEFORE UPDATE ON solution_designs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stakeholders_updated_at BEFORE UPDATE ON stakeholders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RPC function for backlog clusters
CREATE OR REPLACE FUNCTION get_backlog_clusters()
RETURNS TABLE (
    cluster TEXT,
    items BIGINT,
    total_effort BIGINT,
    avg_business_value NUMERIC,
    completion NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bi.cluster::TEXT,
        COUNT(*)::BIGINT as items,
        COALESCE(SUM(bi.effort_points), 0)::BIGINT as total_effort,
        COALESCE(AVG(bi.business_value), 0)::NUMERIC as avg_business_value,
        COALESCE(
            COUNT(CASE WHEN bi.status = 'Done' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 
            0
        )::NUMERIC as completion
    FROM backlog_items bi
    WHERE bi.cluster IS NOT NULL
    GROUP BY bi.cluster;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (adjust for production)
CREATE POLICY "Enable all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON requirements FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON backlog_items FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON meetings FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON meeting_attendees FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON decisions FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON action_items FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON documents FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON solution_designs FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON comments FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON teams FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON team_members FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON stakeholders FOR ALL USING (true);
