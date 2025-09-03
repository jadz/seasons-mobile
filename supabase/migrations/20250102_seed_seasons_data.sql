-- Seed data for seasons domain
-- This migration inserts system pillars and predefined areas of focus and metrics

-- ================================================================================================
-- SYSTEM PILLARS
-- ================================================================================================

INSERT INTO pillars (name, display_name, description, sort_order) VALUES 
('health_fitness', 'Health & Fitness', 'Physical health, fitness, nutrition, and body composition goals', 1),
('wealth', 'Wealth', 'Financial goals, income, investments, and financial planning', 2),
('family', 'Family', 'Relationships, family time, and personal connections', 3),
('head_game', 'Head Game', 'Mental health, mindset, learning, and personal development', 4),
('career', 'Career', 'Professional development, work goals, and career advancement', 5);

-- ================================================================================================
-- PREDEFINED AREAS OF FOCUS
-- ================================================================================================

-- Health & Fitness Areas
INSERT INTO areas_of_focus (name, description, pillar_id, is_predefined) VALUES 
('Weight Loss', 'Focus on reducing body weight and body fat percentage', (SELECT id FROM pillars WHERE name = 'health_fitness'), true),
('Muscle Gain', 'Build lean muscle mass and improve body composition', (SELECT id FROM pillars WHERE name = 'health_fitness'), true),
('Strength Training', 'Increase maximum strength and power in key lifts', (SELECT id FROM pillars WHERE name = 'health_fitness'), true),
('Cardiovascular Fitness', 'Improve heart health and endurance capacity', (SELECT id FROM pillars WHERE name = 'health_fitness'), true),
('Flexibility & Mobility', 'Enhance range of motion and movement quality', (SELECT id FROM pillars WHERE name = 'health_fitness'), true),
('Nutrition Consistency', 'Maintain consistent and healthy eating habits', (SELECT id FROM pillars WHERE name = 'health_fitness'), true),
('Sleep Quality', 'Optimize sleep duration and quality for recovery', (SELECT id FROM pillars WHERE name = 'health_fitness'), true),
('Injury Prevention', 'Reduce injury risk and maintain long-term health', (SELECT id FROM pillars WHERE name = 'health_fitness'), true);

-- Wealth Areas
INSERT INTO areas_of_focus (name, description, pillar_id, is_predefined) VALUES 
('Emergency Fund', 'Build and maintain emergency savings fund', (SELECT id FROM pillars WHERE name = 'wealth'), true),
('Debt Reduction', 'Pay down existing debts and improve debt-to-income ratio', (SELECT id FROM pillars WHERE name = 'wealth'), true),
('Investment Growth', 'Grow investment portfolio and long-term wealth', (SELECT id FROM pillars WHERE name = 'wealth'), true),
('Income Increase', 'Increase primary and secondary income streams', (SELECT id FROM pillars WHERE name = 'wealth'), true),
('Expense Management', 'Control and optimize monthly expenses', (SELECT id FROM pillars WHERE name = 'wealth'), true),
('Financial Education', 'Learn about personal finance and investment strategies', (SELECT id FROM pillars WHERE name = 'wealth'), true);

-- Family Areas
INSERT INTO areas_of_focus (name, description, pillar_id, is_predefined) VALUES 
('Quality Time', 'Spend meaningful time with family and loved ones', (SELECT id FROM pillars WHERE name = 'family'), true),
('Communication', 'Improve communication and emotional connection', (SELECT id FROM pillars WHERE name = 'family'), true),
('Relationship Building', 'Strengthen existing relationships and build new ones', (SELECT id FROM pillars WHERE name = 'family'), true),
('Family Activities', 'Engage in regular family activities and traditions', (SELECT id FROM pillars WHERE name = 'family'), true),
('Support System', 'Build and maintain a strong support network', (SELECT id FROM pillars WHERE name = 'family'), true);

-- Head Game Areas
INSERT INTO areas_of_focus (name, description, pillar_id, is_predefined) VALUES 
('Mindfulness Practice', 'Develop mindfulness and present-moment awareness', (SELECT id FROM pillars WHERE name = 'head_game'), true),
('Stress Management', 'Learn and apply stress reduction techniques', (SELECT id FROM pillars WHERE name = 'head_game'), true),
('Learning & Growth', 'Continuous learning and skill development', (SELECT id FROM pillars WHERE name = 'head_game'), true),
('Mental Health', 'Maintain and improve overall mental wellbeing', (SELECT id FROM pillars WHERE name = 'head_game'), true),
('Goal Setting', 'Develop clear goals and action plans', (SELECT id FROM pillars WHERE name = 'head_game'), true),
('Productivity', 'Improve focus, efficiency, and time management', (SELECT id FROM pillars WHERE name = 'head_game'), true),
('Creative Expression', 'Engage in creative activities and hobbies', (SELECT id FROM pillars WHERE name = 'head_game'), true);

-- Career Areas
INSERT INTO areas_of_focus (name, description, pillar_id, is_predefined) VALUES 
('Skill Development', 'Learn new technical and professional skills', (SELECT id FROM pillars WHERE name = 'career'), true),
('Leadership Growth', 'Develop leadership and management capabilities', (SELECT id FROM pillars WHERE name = 'career'), true),
('Network Building', 'Expand professional network and relationships', (SELECT id FROM pillars WHERE name = 'career'), true),
('Performance Excellence', 'Excel in current role and responsibilities', (SELECT id FROM pillars WHERE name = 'career'), true),
('Career Advancement', 'Progress toward promotion or new opportunities', (SELECT id FROM pillars WHERE name = 'career'), true),
('Work-Life Balance', 'Maintain healthy boundaries between work and personal life', (SELECT id FROM pillars WHERE name = 'career'), true);

-- ================================================================================================
-- PREDEFINED METRICS
-- ================================================================================================

-- Health & Fitness Metrics
INSERT INTO metrics (name, description, unit_type, default_unit, alternative_units, data_type, metric_type) VALUES 
('Body Weight', 'Total body weight measurement', 'weight', 'kg', '["lbs"]', 'decimal', 'predefined'),
('Body Fat Percentage', 'Percentage of body weight that is fat', 'percentage', 'percent_value', '[]', 'decimal', 'predefined'),
('Muscle Mass', 'Total lean muscle mass', 'weight', 'kg', '["lbs"]', 'decimal', 'predefined'),
('Bench Press 1RM', 'One repetition maximum for bench press', 'weight', 'kg', '["lbs"]', 'decimal', 'predefined'),
('Squat 1RM', 'One repetition maximum for back squat', 'weight', 'kg', '["lbs"]', 'decimal', 'predefined'),
('Deadlift 1RM', 'One repetition maximum for deadlift', 'weight', 'kg', '["lbs"]', 'decimal', 'predefined'),
('5K Run Time', 'Time to complete 5 kilometer run', 'time', 'minutes', '["seconds"]', 'decimal', 'predefined'),
('Resting Heart Rate', 'Heart rate at rest (beats per minute)', 'other', 'count', '[]', 'integer', 'predefined'),
('Sleep Hours', 'Total hours of sleep per night', 'time', 'hours', '["minutes"]', 'decimal', 'predefined'),
('Steps Per Day', 'Daily step count', 'other', 'count', '[]', 'integer', 'predefined'),
('Workout Frequency', 'Number of workouts per week', 'other', 'count', '[]', 'integer', 'predefined'),
('Daily Calories', 'Daily caloric intake', 'other', 'count', '[]', 'integer', 'predefined'),
('Daily Protein', 'Daily protein intake in grams', 'weight', 'count', '[]', 'integer', 'predefined');

-- Wealth Metrics
INSERT INTO metrics (name, description, unit_type, default_unit, alternative_units, data_type, metric_type) VALUES 
('Net Worth', 'Total assets minus total liabilities', 'other', 'custom_unit', '[]', 'decimal', 'predefined'),
('Monthly Income', 'Total monthly income from all sources', 'other', 'custom_unit', '[]', 'decimal', 'predefined'),
('Monthly Expenses', 'Total monthly expenses', 'other', 'custom_unit', '[]', 'decimal', 'predefined'),
('Savings Rate', 'Percentage of income saved each month', 'percentage', 'percent_value', '[]', 'decimal', 'predefined'),
('Emergency Fund Months', 'Number of months expenses covered by emergency fund', 'other', 'count', '[]', 'decimal', 'predefined'),
('Investment Portfolio Value', 'Total value of investment accounts', 'other', 'custom_unit', '[]', 'decimal', 'predefined'),
('Debt Total', 'Total outstanding debt', 'other', 'custom_unit', '[]', 'decimal', 'predefined');

-- Family Metrics
INSERT INTO metrics (name, description, unit_type, default_unit, alternative_units, data_type, metric_type) VALUES 
('Family Time Hours', 'Hours spent with family per week', 'time', 'hours', '["minutes"]', 'decimal', 'predefined'),
('Date Nights', 'Number of date nights per month', 'other', 'count', '[]', 'integer', 'predefined'),
('Family Activities', 'Number of family activities per month', 'other', 'count', '[]', 'integer', 'predefined'),
('Social Connections', 'Number of meaningful social interactions per week', 'other', 'count', '[]', 'integer', 'predefined');

-- Head Game Metrics
INSERT INTO metrics (name, description, unit_type, default_unit, alternative_units, data_type, metric_type) VALUES 
('Meditation Minutes', 'Daily meditation time in minutes', 'time', 'minutes', '["hours"]', 'integer', 'predefined'),
('Books Read', 'Number of books completed per month', 'other', 'count', '[]', 'integer', 'predefined'),
('Learning Hours', 'Hours spent learning new skills per week', 'time', 'hours', '["minutes"]', 'decimal', 'predefined'),
('Stress Level', 'Self-reported stress level (1-10 scale)', 'other', 'count', '[]', 'integer', 'predefined'),
('Mood Rating', 'Daily mood rating (1-10 scale)', 'other', 'count', '[]', 'integer', 'predefined'),
('Gratitude Entries', 'Number of gratitude journal entries per week', 'other', 'count', '[]', 'integer', 'predefined');

-- Career Metrics
INSERT INTO metrics (name, description, unit_type, default_unit, alternative_units, data_type, metric_type) VALUES 
('Professional Development Hours', 'Hours spent on professional development per month', 'time', 'hours', '["minutes"]', 'decimal', 'predefined'),
('Networking Events', 'Number of networking events attended per month', 'other', 'count', '[]', 'integer', 'predefined'),
('Certifications Earned', 'Number of professional certifications earned', 'other', 'count', '[]', 'integer', 'predefined'),
('Performance Rating', 'Work performance rating (1-10 scale)', 'other', 'count', '[]', 'integer', 'predefined'),
('Work Hours', 'Average work hours per week', 'time', 'hours', '["minutes"]', 'decimal', 'predefined'),
('Side Project Hours', 'Hours spent on side projects per week', 'time', 'hours', '["minutes"]', 'decimal', 'predefined');

-- ================================================================================================
-- APP-CALCULATED METRICS (placeholders for future implementation)
-- ================================================================================================

-- These metrics will be calculated by the app based on user activity
INSERT INTO metrics (name, description, unit_type, default_unit, alternative_units, data_type, metric_type, calculation_method) VALUES 
('Workout Consistency', 'Percentage of planned workouts completed', 'percentage', 'percent_value', '[]', 'decimal', 'app_calculated', 'workout_completion_rate'),
('Progressive Overload', 'Rate of strength increase over time', 'percentage', 'percent_value', '[]', 'decimal', 'app_calculated', 'strength_progression_rate'),
('Recovery Score', 'Calculated recovery score based on sleep and stress', 'other', 'count', '[]', 'integer', 'app_calculated', 'recovery_calculation'),
('Habit Streak', 'Longest current streak of consistent habits', 'other', 'count', '[]', 'integer', 'app_calculated', 'habit_consistency_streak');

-- Add comments for documentation
COMMENT ON TABLE pillars IS 'System-controlled life pillars - these 5 core areas form the foundation of the seasons approach';
COMMENT ON TABLE areas_of_focus IS 'Predefined areas of focus that users can select from, plus their own custom areas';
COMMENT ON TABLE metrics IS 'Comprehensive set of predefined metrics covering all pillars, plus app-calculated metrics';

