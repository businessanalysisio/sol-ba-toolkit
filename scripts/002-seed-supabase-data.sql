-- Insert BA team members
INSERT INTO users (id, email, name, role, department, slack_handle, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sarah@company.com', 'Sarah', 'Lead Business Analyst', 'Product', '@sarah', true),
('550e8400-e29b-41d4-a716-446655440002', 'emma@company.com', 'Emma', 'Senior Business Analyst', 'Product', '@emma', true),
('550e8400-e29b-41d4-a716-446655440003', 'jack@company.com', 'Jack', 'Business Analyst', 'Product', '@jack', true),
('550e8400-e29b-41d4-a716-446655440004', 'paul@company.com', 'Paul', 'Business Analyst', 'Product', '@paul', true),
('550e8400-e29b-41d4-a716-446655440005', 'david@company.com', 'David', 'Junior Business Analyst', 'Product', '@david', true);

-- Insert additional team members
INSERT INTO users (id, email, name, role, department, slack_handle, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'alice@company.com', 'Alice Johnson', 'Product Manager', 'Product', '@alice', true),
('550e8400-e29b-41d4-a716-446655440007', 'bob@company.com', 'Bob Williams', 'Frontend Developer', 'Engineering', '@bob', true),
('550e8400-e29b-41d4-a716-446655440008', 'charlie@company.com', 'Charlie Brown', 'Backend Developer', 'Engineering', '@charlie', true),
('550e8400-e29b-41d4-a716-446655440009', 'diana@company.com', 'Diana Prince', 'UX Designer', 'Design', '@diana', true),
('550e8400-e29b-41d4-a716-446655440010', 'eve@company.com', 'Eve Davis', 'QA Engineer', 'Engineering', '@eve', true);

-- Insert projects
INSERT INTO projects (id, name, description, status, priority, owner_id, start_date, target_date) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'E-commerce Platform Redesign', 'Complete redesign of the e-commerce platform with B2C and B2B capabilities', 'Active', 'High', '550e8400-e29b-41d4-a716-446655440001', '2024-06-01', '2024-12-31'),
('660e8400-e29b-41d4-a716-446655440002', 'B2B Partner Portal', 'Dedicated portal for B2B partners with tiered pricing and procurement features', 'Active', 'High', '550e8400-e29b-41d4-a716-446655440002', '2024-07-01', '2024-10-31'),
('660e8400-e29b-41d4-a716-446655440003', 'Mobile App Enhancement', 'Performance improvements and new features for mobile application', 'Active', 'Medium', '550e8400-e29b-41d4-a716-446655440003', '2024-08-01', '2024-11-30');

-- Insert requirements
INSERT INTO requirements (id, title, description, status, priority, type, source, requestor_id, project_id, assigned_ba_id, business_justification, expected_outcomes, stakeholder_ids, sentiment, sentiment_score, submitted_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Mobile app performance issues', 'Users are experiencing slow loading times and crashes on the mobile app', 'Analyzed', 'High', 'Bug Fix', 'Email', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Poor performance is affecting user retention and app store ratings', 'Improve app performance by 50% and reduce crash rate to under 1%', '["Mobile Team", "QA Team"]', 'Negative', 0.2, NOW() - INTERVAL '2 hours'),
('770e8400-e29b-41d4-a716-446655440002', 'New reporting dashboard request', 'Need a comprehensive dashboard for B2B partners to track their orders and analytics', 'Processing', 'Medium', 'Feature', 'Form', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Partners need better visibility into their business metrics', 'Increase partner satisfaction and reduce support tickets by 30%', '["B2B Team", "Analytics Team"]', 'Neutral', 0.5, NOW() - INTERVAL '4 hours'),
('770e8400-e29b-41d4-a716-446655440003', 'Integration with third-party API', 'Integrate with new payment gateway to support more payment methods', 'Pending Review', 'Low', 'Enhancement', 'Ticket', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Expand payment options to increase conversion rates', 'Increase successful transactions by 15%', '["Payment Team", "Security Team"]', 'Positive', 0.7, NOW() - INTERVAL '1 day');

-- Insert backlog items
INSERT INTO backlog_items (id, title, description, status, priority, type, effort_points, business_value, cluster, project_id, assigned_to, due_date, dependency_ids) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'User Authentication System', 'Implement secure login with 2FA', 'Ready', 'High', 'Feature', 13, 8, 'Authentication', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '2024-07-15', '["880e8400-e29b-41d4-a716-446655440002"]'),
('880e8400-e29b-41d4-a716-446655440002', 'Password Reset Flow', 'Allow users to reset forgotten passwords', 'In Progress', 'High', 'Feature', 5, 6, 'Authentication', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', '2024-07-10', '[]'),
('880e8400-e29b-41d4-a716-446655440003', 'Mobile App Performance', 'Optimize app loading times', 'Backlog', 'Medium', 'Improvement', 8, 7, 'Performance', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', '2024-08-15', '["880e8400-e29b-41d4-a716-446655440004"]'),
('880e8400-e29b-41d4-a716-446655440004', 'API Response Optimization', 'Reduce API response times by 50%', 'Backlog', 'Medium', 'Improvement', 8, 6, 'Performance', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', '2024-08-01', '[]'),
('880e8400-e29b-41d4-a716-446655440005', 'Analytics Dashboard', 'Create comprehensive analytics dashboard', 'Backlog', 'Low', 'Feature', 21, 9, 'Analytics', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', '2024-09-30', '["880e8400-e29b-41d4-a716-446655440006"]'),
('880e8400-e29b-41d4-a716-446655440006', 'Data Collection Framework', 'Implement event tracking system', 'Backlog', 'Medium', 'Feature', 13, 5, 'Analytics', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', '2024-09-15', '[]');

-- Insert meetings
INSERT INTO meetings (id, title, description, scheduled_at, duration_minutes, status, organizer_id, project_id, agenda) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Sprint Planning - Q3 Features', 'Planning session for Q3 feature development', '2025-07-05 10:00:00+00', 120, 'Scheduled', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Review backlog, estimate stories, plan sprint capacity'),
('990e8400-e29b-41d4-a716-446655440002', 'B2B Portal Review', 'Review progress on B2B portal development', '2025-07-08 14:00:00+00', 60, 'Scheduled', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Demo current progress, discuss blockers, plan next steps');

-- Insert meeting attendees
INSERT INTO meeting_attendees (meeting_id, user_id, status) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'Pending'),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440009', 'Pending');

-- Insert decisions
INSERT INTO decisions (id, description, status, meeting_id, made_by, decided_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Prioritized User Auth Epic for next sprint', 'Implemented', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day'),
('aa0e8400-e29b-41d4-a716-446655440002', 'Approved Mobile App redesign approach', 'In Progress', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '1 day');

-- Insert action items
INSERT INTO action_items (id, description, status, meeting_id, assignee_id, due_date) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Draft user stories for 2FA implementation', 'Open', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '2024-07-10'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Research payment gateway integration options', 'Open', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '2024-07-12');

-- Insert documents
INSERT INTO documents (id, title, type, content, version, status, author_id, project_id) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'E-commerce Platform BRD v1.0', 'BRD', 'Business Requirements Document for E-commerce Platform...', 'v1.0', 'Approved', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
('cc0e8400-e29b-41d4-a716-446655440002', 'B2C Checkout User Stories', 'User Stories', 'User stories for B2C checkout process...', 'v1.1', 'Review', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001'),
('cc0e8400-e29b-41d4-a716-446655440003', 'User Management Service Tech Spec', 'Technical Spec', 'Technical specification for user management service...', 'v0.9', 'Draft', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002');

-- Insert solution designs
INSERT INTO solution_designs (id, title, description, status, project_id, author_id, components) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'B2C Checkout Flow', 'Detailed workflow for B2C checkout process', 'Draft', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '["Cart Review", "Payment Selection", "Order Confirmation"]'),
('dd0e8400-e29b-41d4-a716-446655440002', 'Partner Dashboard Mockup', 'UI mockup for B2B partner dashboard', 'Review', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '["Dashboard Header", "Analytics Cards", "Order History"]'),
('dd0e8400-e29b-41d4-a716-446655440003', 'Product Catalog Data Model', 'Data model for product catalog system', 'Approved', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '["Product Entity", "Category Entity", "Pricing Entity"]');

-- Insert teams
INSERT INTO teams (id, name, description, lead_id) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'Business Analysis Team', 'Core BA team responsible for requirements analysis and documentation', '550e8400-e29b-41d4-a716-446655440001'),
('ee0e8400-e29b-41d4-a716-446655440002', 'Product Team', 'Product management and strategy team', '550e8400-e29b-41d4-a716-446655440006'),
('ee0e8400-e29b-41d4-a716-446655440003', 'Engineering Team', 'Development and technical implementation team', '550e8400-e29b-41d4-a716-446655440007');

-- Insert team members
INSERT INTO team_members (team_id, user_id, role) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Team Lead'),
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Senior Analyst'),
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Analyst'),
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Analyst'),
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'Junior Analyst'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'Product Manager'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440009', 'UX Designer'),
('ee0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'Frontend Developer'),
('ee0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'Backend Developer'),
('ee0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', 'QA Engineer');

-- Insert stakeholders
INSERT INTO stakeholders (id, name, email, role, department, influence_level, project_id) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', 'Marketing Manager', 'marketing@company.com', 'Marketing Manager', 'Marketing', 'High', '660e8400-e29b-41d4-a716-446655440001'),
('ff0e8400-e29b-41d4-a716-446655440002', 'Sales Director', 'sales@company.com', 'Sales Director', 'Sales', 'High', '660e8400-e29b-41d4-a716-446655440002'),
('ff0e8400-e29b-41d4-a716-446655440003', 'Customer Success Lead', 'cs@company.com', 'Customer Success Lead', 'Customer Success', 'Medium', '660e8400-e29b-41d4-a716-446655440001'),
('ff0e8400-e29b-41d4-a716-446655440004', 'IT Security Manager', 'security@company.com', 'Security Manager', 'IT', 'High', '660e8400-e29b-41d4-a716-446655440001');
