-- Activar RLS en las tablas
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Políticas para 'builders'
CREATE POLICY "builders_select_policy" ON builders
  FOR SELECT
  USING (true);

CREATE POLICY "builders_all_policy" ON builders
  FOR ALL
  USING (auth.uid() = id);

-- Políticas para 'projects'
CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT
  USING (true);

CREATE POLICY "projects_all_policy" ON projects
  FOR ALL
  USING (auth.uid() = builder_id);
