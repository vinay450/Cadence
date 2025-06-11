-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    dataset_overview JSONB,
    statistical_summary JSONB,
    pattern_recognition JSONB,
    data_quality JSONB,
    key_insights JSONB,
    recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view messages from their projects"
    ON chat_messages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = chat_messages.project_id
        AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can create messages in their projects"
    ON chat_messages FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = chat_messages.project_id
        AND projects.user_id = auth.uid()
    ));

-- Analysis results policies
CREATE POLICY "Users can view their analysis results"
    ON analysis_results FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = analysis_results.project_id
        AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can create analysis results"
    ON analysis_results FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = analysis_results.project_id
        AND projects.user_id = auth.uid()
    ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_project_id ON analysis_results(project_id); 