-- Seed data for Business Analyst Toolkit
-- Version: 1.0
-- Created: 2025-01-07

-- Insert BA Team Members
INSERT INTO users (id, email, name, role, department, slack_handle, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sarah@company.com', 'Sarah', 'Lead Business Analyst', 'Product', '@sarah.ba', true),
('550e8400-e29b-41d4-a716-446655440002', 'emma@company.com', 'Emma', 'Senior Business Analyst', 'Product', '@emma.ba', true),
('550e8400-e29b-41d4-a716-446655440003', 'jack@company.com', 'Jack', 'Business Analyst', 'Product', '@jack.ba', true),
('550e8400-e29b-41d4-a716-446655440004', 'paul@company.com', 'Paul', 'Business Analyst', 'Product', '@paul.ba', true),
('550e8400-e29b-41d4-a716-446655440005', 'david@company.com', 'David', 'Junior Business Analyst', 'Product', '@david.ba', true);

-- Insert other team members
INSERT INTO users (id, email, name, role, department, slack_handle, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'alice@company.com', 'Alice Johnson', 'Product Manager', 'Product', '@alice.pm', true),
('550e8400-e29b-41d4-a716-446655440007', 'bob@company.com', 'Bob Williams', 'Tech Lead', 'Engineering', '@bob.tech', true),
('550e8400-e29b-41d4-a716-446655440008', 'charlie@company.com', 'Charlie Brown', 'UX Designer', 'Design', '@charlie.ux', true),
('550e8400-e29b-41d4-a716-446655440009', 'diana@company.com', 'Diana Prince', 'QA Lead', 'Quality', '@diana.qa', true),
('550e8400-e29b-41d4-a716-446655440010', 'eve@company.com', 'Eve Davis', 'Marketing Manager', 'Marketing', '@eve.marketing', true);

-- Insert sample projects
INSERT INTO projects (id, name, description, status, priority, owner_id, start_date, target_date) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'E-commerce Platform Redesign', 'Complete redesign of the customer-facing e-commerce platform', 'Active', 'High', '550e8400-e29b-41d4-a716-446655440001', '2025-01-01', '2025-06-30'),
('660e8400-e29b-41d4-a716-446655440002', 'B2B Partner Portal', 'New portal for B2B partners to manage orders and inventory', 'Active', 'High', '550e8400-e29b-41d4-a716-446655440002', '2025-02-01', '2025-08-31'),
('660e8400-e29b-41d4-a716-446655440003', 'Mobile App Enhancement', 'Performance improvements and new features for mobile app', 'Planning', 'Medium', '550e8400-e29b-41d4-a716-446655440003', '2025-03-01', '2025-09-30');

-- Insert sample requirements
INSERT INTO requirements (id, title, description, status, priority, type, source, requestor_id, project_id, assigned_ba_id, business_justification, expected_outcomes, stakeholder_ids, sentiment, sentiment_score, submitted_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'User Authentication Enhancement', 'Implement multi-factor authentication for improved security', 'In Progress', 'High', 'Feature Request', 'Email', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Improve security posture and reduce fraud', 'Reduce security incidents by 50%', '["550e8400-e29b-41d4-a716-446655440006", "550e8400-e29b-41d4-a716-446655440007"]', 'Positive', 0.8, NOW() - INTERVAL '2 days'),
('770e8400-e29b-41d4-a716-446655440002', 'Mobile Performance Issues', 'App is loading slowly on mobile devices, causing user frustration', 'Analyzed', 'High', 'Bug Report', 'Support Ticket', '550e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Improve user experience and retention', 'Reduce app load time by 40%', '["550e8400-e29b-41d4-a716-446655440009", "550e8400-e29b-41d4-a716-446655440007"]', 'Negative', 0.2, NOW() - INTERVAL '4 hours'),
('770e8400-e29b-41d4-a716-446655440003', 'B2B Reporting Dashboard', 'Partners need better visibility into their order history and analytics', 'New', 'Medium', 'Feature Request', 'Form', '550e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Improve partner satisfaction and self-service', 'Reduce partner support tickets by 30%', '["550e8400-e29b-41d4-a716-446655440010", "550e8400-e29b-41d4-a716-446655440006"]', 'Neutral', 0.6, NOW() - INTERVAL '1 day');

-- Insert sample backlog items
INSERT INTO backlog_items (id, title, description, status, priority, type, effort_points, business_value, cluster, project_id, assigned_to, due_date, dependency_ids) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Implement OAuth 2.0 Integration', 'Set up OAuth 2.0 for third-party authentication providers', 'In Progress', 'High', 'Feature', 8, 9, 'Authentication', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '2025-07-15', '[]'),
('880e8400-e29b-41d4-a716-446655440002', 'Mobile App Performance Optimization', 'Optimize image loading and caching mechanisms', 'To Do', 'High', 'Improvement', 13, 8, 'Performance', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', '2025-07-30', '[]'),
('880e8400-e29b-41d4-a716-446655440003', 'Partner Analytics Dashboard', 'Create comprehensive analytics dashboard for B2B partners', 'To Do', 'Medium', 'Feature', 21, 7, 'Analytics', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', '2025-08-15', '["880e8400-e29b-41d4-a716-446655440004"]'),
('880e8400-e29b-41d4-a716-446655440004', 'Data Collection Framework', 'Implement event tracking and data collection system', 'Done', 'Medium', 'Feature', 13, 6, 'Analytics', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', '2025-06-30', '[]');

-- Insert sample meetings
INSERT INTO meetings (id, title, description, scheduled_at, duration_minutes, status, organizer_id, project_id, agenda) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Sprint Planning - Q3 Features', 'Planning session for Q3 feature development', '2025-07-05 10:00:00+00', 120, 'Scheduled', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Review backlog, estimate stories, plan sprint capacity'),
('990e8400-e29b-41d4-a716-446655440002', 'B2B Portal Requirements Review', 'Review and validate B2B portal requirements with stakeholders', '2025-07-08 14:00:00+00', 90, 'Scheduled', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Requirements walkthrough, stakeholder feedback, next steps'),
('990e8400-e29b-41d4-a716-446655440003', 'Mobile Performance Deep Dive', 'Technical discussion on mobile performance optimization strategies', '2025-07-10 11:00:00+00', 60, 'Scheduled', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Performance analysis, optimization strategies, implementation plan');

-- Insert meeting attendees
INSERT INTO meeting_attendees (meeting_id, user_id, status) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'Pending'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Accepted'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'Accepted');

-- Insert sample decisions
INSERT INTO decisions (id, description, status, meeting_id, made_by, decided_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Prioritize OAuth 2.0 implementation for Sprint 1', 'Implemented', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day'),
('aa0e8400-e29b-41d4-a716-446655440002', 'Approved mobile app redesign mockups', 'In Progress', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '1 day');

-- Insert sample action items
INSERT INTO action_items (id, description, status, meeting_id, assignee_id, due_date) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Draft user stories for OAuth 2.0 integration', 'Open', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2025-07-12'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Research third-party authentication providers', 'In Progress', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '2025-07-10'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Validate B2B portal wireframes with partners', 'Open', '990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '2025-07-15');

-- Insert sample documents
INSERT INTO documents (id, title, type, content, version, status, author_id, project_id) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'E-commerce Platform BRD v2.0', 'BRD', 'Business Requirements Document for the e-commerce platform redesign project...', 'v2.0', 'Approved', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
('cc0e8400-e29b-41d4-a716-446655440002', 'B2B Portal User Stories', 'User Stories', 'Collection of user stories for the B2B partner portal...', 'v1.1', 'Review', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002'),
('cc0e8400-e29b-41d4-a716-446655440003', 'Mobile App Technical Specification', 'Technical Spec', 'Technical specification for mobile app performance improvements...', 'v0.9', 'Draft', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003');

-- Insert sample solution designs
INSERT INTO solution_designs (id, title, description, status, project_id, author_id, components, diagram_url) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'OAuth 2.0 Authentication Flow', 'Detailed design for implementing OAuth 2.0 authentication', 'Review', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '["Login Component", "OAuth Provider Integration", "Token Management"]', '/placeholder.svg?height=300&width=500'),
('dd0e8400-e29b-41d4-a716-446655440002', 'B2B Partner Dashboard Architecture', 'System architecture for the B2B partner dashboard', 'Draft', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '["Dashboard API", "Analytics Engine", "Reporting Module"]', '/placeholder.svg?height=300&width=500');

-- Insert sample stakeholders
INSERT INTO stakeholders (id, name, email, role, department, influence_level, project_id) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'Marketing Director', 'marketing.director@company.com', 'Director', 'Marketing', 'High', '660e8400-e29b-41d4-a716-446655440001'),
('ee0e8400-e29b-41d4-a716-446655440002', 'Sales Manager', 'sales.manager@company.com', 'Manager', 'Sales', 'Medium', '660e8400-e29b-41d4-a716-446655440002'),
('ee0e8400-e29b-41d4-a716-446655440003', 'Customer Support Lead', 'support.lead@company.com', 'Lead', 'Support', 'Medium', '660e8400-e29b-41d4-a716-446655440003');

-- Insert BA team
INSERT INTO teams (id, name, description, lead_id) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', 'Business Analysis Team', 'Core business analysis team responsible for requirements gathering and documentation', '550e8400-e29b-41d4-a716-446655440001');

-- Insert team members
INSERT INTO team_members (team_id, user_id, role) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Team Lead'),
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Senior BA'),
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'BA'),
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'BA'),
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'Junior BA');
