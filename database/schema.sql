-- F1 Predictor & Race Simulator - Complete Database Schema
-- PostgreSQL 16

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url VARCHAR(500),
  country VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  refresh_token VARCHAR(500),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_reset_token ON users(reset_token) WHERE reset_token IS NOT NULL;

-- ============================================================
-- TEAMS (ESCUDERÍAS)
-- ============================================================

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  base VARCHAR(255) NOT NULL,
  team_principal VARCHAR(255) NOT NULL,
  chassis VARCHAR(100),
  power_unit VARCHAR(100),
  logo_url VARCHAR(500),
  photo_url VARCHAR(500),
  biography TEXT,
  is_active BOOLEAN DEFAULT true,
  founded_year INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE team_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID UNIQUE NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  championships INT DEFAULT 0,
  wins INT DEFAULT 0,
  podiums INT DEFAULT 0,
  poles INT DEFAULT 0,
  fastest_laps INT DEFAULT 0,
  total_points DECIMAL(10,1) DEFAULT 0,
  season_points DECIMAL(10,1) DEFAULT 0,
  season_position INT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- DRIVERS
-- ============================================================

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  number INT UNIQUE NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id),
  photo_url VARCHAR(500),
  biography TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_drivers_team ON drivers(team_id);
CREATE INDEX idx_drivers_active ON drivers(is_active);

CREATE TABLE driver_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID UNIQUE NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  championships INT DEFAULT 0,
  wins INT DEFAULT 0,
  podiums INT DEFAULT 0,
  poles INT DEFAULT 0,
  fastest_laps INT DEFAULT 0,
  total_points DECIMAL(10,1) DEFAULT 0,
  races_entered INT DEFAULT 0,
  season_points DECIMAL(10,1) DEFAULT 0,
  season_position INT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CIRCUITS
-- ============================================================

CREATE TABLE circuits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  length_km DECIMAL(6,3) NOT NULL,
  turns INT NOT NULL,
  drs_zones INT DEFAULT 0,
  lap_record VARCHAR(100),
  lap_record_time DECIMAL(8,3),
  lap_record_driver_id UUID REFERENCES drivers(id),
  lap_record_year INT,
  capacity INT,
  first_gp_year INT NOT NULL,
  circuit_map_url VARCHAR(500),
  image_url VARCHAR(500),
  description TEXT,
  altitude INT,
  is_street_circuit BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SEASONS
-- ============================================================

CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  total_races INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- RACES
-- ============================================================

CREATE TABLE races (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id),
  circuit_id UUID NOT NULL REFERENCES circuits(id),
  name VARCHAR(255) NOT NULL,
  round INT NOT NULL,
  status VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'qualifying_complete', 'completed', 'cancelled')),
  date DATE NOT NULL,
  qualifying_date TIMESTAMP WITH TIME ZONE NOT NULL,
  race_date TIMESTAMP WITH TIME ZONE NOT NULL,
  local_timezone VARCHAR(50) NOT NULL,
  weather_forecast JSONB,
  laps INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(season_id, round)
);

CREATE INDEX idx_races_season ON races(season_id);
CREATE INDEX idx_races_status ON races(status);
CREATE INDEX idx_races_date ON races(race_date);

-- ============================================================
-- QUALIFYING RESULTS
-- ============================================================

CREATE TABLE qualifying_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  race_id UUID NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  position INT NOT NULL,
  q1_time VARCHAR(20),
  q2_time VARCHAR(20),
  q3_time VARCHAR(20),
  laps INT DEFAULT 0,
  UNIQUE(race_id, driver_id)
);

CREATE INDEX idx_qualifying_race ON qualifying_results(race_id);

-- ============================================================
-- RACE RESULTS
-- ============================================================

CREATE TABLE race_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  race_id UUID NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  grid_position INT,
  finish_position INT,
  status VARCHAR(20) DEFAULT 'finished' CHECK (status IN ('finished', 'dnf', 'dsq', 'dns')),
  points DECIMAL(8,1) DEFAULT 0,
  laps_completed INT DEFAULT 0,
  total_time INTERVAL,
  fastest_lap BOOLEAN DEFAULT false,
  fastest_lap_time VARCHAR(20),
  pit_stops INT DEFAULT 0,
  starting_tyre VARCHAR(10),
  is_pole BOOLEAN DEFAULT false,
  is_winner BOOLEAN DEFAULT false,
  is_podium BOOLEAN DEFAULT false,
  dnf_reason VARCHAR(255),
  UNIQUE(race_id, driver_id)
);

CREATE INDEX idx_race_results_race ON race_results(race_id);
CREATE INDEX idx_race_results_driver ON race_results(driver_id);
CREATE INDEX idx_race_results_position ON race_results(finish_position);

-- ============================================================
-- PREDICTIONS
-- ============================================================

CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  race_id UUID NOT NULL REFERENCES races(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('qualifying', 'race')),
  pole_prediction UUID REFERENCES drivers(id),
  top3_prediction UUID[],
  top10_prediction UUID[],
  winner_prediction UUID REFERENCES drivers(id),
  podium_prediction UUID[],
  fastest_lap_prediction UUID REFERENCES drivers(id),
  safety_car_prediction BOOLEAN,
  red_flag_prediction BOOLEAN,
  dnfs_prediction INT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_locked BOOLEAN DEFAULT false,
  total_score DECIMAL(8,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, race_id, type)
);

CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_race ON predictions(race_id);
CREATE INDEX idx_predictions_score ON predictions(total_score DESC);

-- ============================================================
-- PREDICTION SCORES
-- ============================================================

CREATE TABLE prediction_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prediction_id UUID UNIQUE NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  pole_score DECIMAL(8,1) DEFAULT 0,
  winner_score DECIMAL(8,1) DEFAULT 0,
  podium_score DECIMAL(8,1) DEFAULT 0,
  top10_score DECIMAL(8,1) DEFAULT 0,
  fastest_lap_score DECIMAL(8,1) DEFAULT 0,
  safety_car_score DECIMAL(8,1) DEFAULT 0,
  red_flag_score DECIMAL(8,1) DEFAULT 0,
  total_score DECIMAL(8,1) DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SCORING CONFIGURATION
-- ============================================================

CREATE TABLE scoring_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(50) UNIQUE NOT NULL,
  points DECIMAL(8,1) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO scoring_config (key, points, description) VALUES
  ('pole', 10, 'Correct pole position prediction'),
  ('winner', 25, 'Correct race winner prediction'),
  ('podium_exact', 50, 'Exact podium prediction (all 3 in correct order)'),
  ('top10_exact', 100, 'Exact top 10 prediction (all 10 in correct order)'),
  ('fastest_lap', 15, 'Correct fastest lap prediction'),
  ('safety_car', 10, 'Correct safety car prediction (yes/no)'),
  ('red_flag', 10, 'Correct red flag prediction (yes/no)'),
  ('dnf_range', 15, 'Correct DNF count within range'),
  ('winner_top3', 10, 'Winner predicted in top 3'),
  ('podium_any', 5, 'Driver correctly placed in podium'),
  ('top10_any', 3, 'Driver correctly placed in top 10');

-- ============================================================
-- FANTASY TEAMS
-- ============================================================

CREATE TABLE fantasy_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id),
  name VARCHAR(100) NOT NULL,
  budget DECIMAL(8,1) DEFAULT 100.0,
  total_score DECIMAL(10,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, season_id)
);

CREATE TABLE fantasy_picks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fantasy_team_id UUID NOT NULL REFERENCES fantasy_teams(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id),
  team_id UUID REFERENCES teams(id),
  type VARCHAR(15) NOT NULL CHECK (type IN ('driver', 'constructor')),
  cost DECIMAL(8,1) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  picked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transferred_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fantasy_pick_check CHECK (
    (type = 'driver' AND driver_id IS NOT NULL AND team_id IS NULL) OR
    (type = 'constructor' AND team_id IS NOT NULL AND driver_id IS NULL)
  )
);

CREATE TABLE fantasy_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fantasy_team_id UUID NOT NULL REFERENCES fantasy_teams(id) ON DELETE CASCADE,
  driver_out_id UUID REFERENCES drivers(id),
  driver_in_id UUID REFERENCES drivers(id),
  cost DECIMAL(8,1) NOT NULL,
  transfer_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  race_id UUID REFERENCES races(id)
);

CREATE TABLE driver_market_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id),
  current_value DECIMAL(8,1) NOT NULL,
  price_change DECIMAL(8,1) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(driver_id, season_id)
);

-- ============================================================
-- LEAGUES
-- ============================================================

CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  code VARCHAR(20) UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  max_members INT DEFAULT 50,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leagues_code ON leagues(code);
CREATE INDEX idx_leagues_owner ON leagues(owner_id);

CREATE TABLE league_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(10) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_score DECIMAL(10,1) DEFAULT 0,
  UNIQUE(league_id, user_id)
);

CREATE INDEX idx_league_members_league ON league_members(league_id);
CREATE INDEX idx_league_members_user ON league_members(user_id);

-- ============================================================
-- RANKINGS
-- ============================================================

CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id),
  global_position INT,
  global_score DECIMAL(10,1) DEFAULT 0,
  weekly_position INT,
  weekly_score DECIMAL(10,1) DEFAULT 0,
  country_code VARCHAR(5),
  country_position INT,
  league_id UUID REFERENCES leagues(id),
  league_position INT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, season_id)
);

CREATE INDEX idx_rankings_global ON rankings(season_id, global_position);
CREATE INDEX idx_rankings_weekly ON rankings(weekly_position);
CREATE INDEX idx_rankings_country ON rankings(country_code, country_position);

CREATE TABLE ranking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  race_id UUID NOT NULL REFERENCES races(id),
  position INT NOT NULL,
  score DECIMAL(10,1) NOT NULL,
  change INT DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ranking_history_user ON ranking_history(user_id);
CREATE INDEX idx_ranking_history_race ON ranking_history(race_id);

-- ============================================================
-- GAMIFICATION
-- ============================================================

CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  level_number INT UNIQUE NOT NULL,
  min_points DECIMAL(10,1) NOT NULL,
  badge_url VARCHAR(500),
  rewards JSONB
);

INSERT INTO levels (name, level_number, min_points, rewards) VALUES
  ('Rookie', 1, 0, '{"badge": "rookie", "tokens": 0}'),
  ('Rookie II', 2, 50, '{"badge": "rookie_2", "tokens": 10}'),
  ('Rookie III', 3, 100, '{"badge": "rookie_3", "tokens": 20}'),
  ('Amateur', 4, 200, '{"badge": "amateur", "tokens": 30}'),
  ('Amateur II', 5, 350, '{"badge": "amateur_2", "tokens": 40}'),
  ('Amateur III', 6, 500, '{"badge": "amateur_3", "tokens": 50}'),
  ('Professional', 7, 750, '{"badge": "pro", "tokens": 75}'),
  ('Professional II', 8, 1000, '{"badge": "pro_2", "tokens": 100}'),
  ('Professional III', 9, 1500, '{"badge": "pro_3", "tokens": 150}'),
  ('Elite', 10, 2000, '{"badge": "elite", "tokens": 200}'),
  ('Elite II', 11, 3000, '{"badge": "elite_2", "tokens": 250}'),
  ('Elite III', 12, 4500, '{"badge": "elite_3", "tokens": 300}'),
  ('Legend', 13, 6000, '{"badge": "legend", "tokens": 500}');

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_url VARCHAR(500),
  category VARCHAR(30) NOT NULL CHECK (category IN ('prediction', 'fantasy', 'streak', 'social', 'special')),
  points_reward INT DEFAULT 0,
  criteria JSONB NOT NULL
);

INSERT INTO achievements (key, name, description, category, points_reward, criteria) VALUES
  ('first_prediction', 'First Prediction', 'Submit your first prediction', 'prediction', 10, '{"type": "predictions_count", "count": 1}'),
  ('perfect_podium', 'Perfect Podium', 'Predict the exact podium in correct order', 'prediction', 50, '{"type": "podium_exact"}'),
  ('pole_perfect', 'Pole Master', 'Predict the pole position correctly', 'prediction', 20, '{"type": "pole_correct", "count": 1}'),
  ('race_winner', 'Winner Caller', 'Predict the race winner correctly', 'prediction', 25, '{"type": "winner_correct", "count": 1}'),
  ('streak_3', 'On Fire', '3 correct predictions in a row', 'streak', 30, '{"type": "streak", "count": 3}'),
  ('streak_5', 'Unstoppable', '5 correct predictions in a row', 'streak', 75, '{"type": "streak", "count": 5}'),
  ('streak_10', 'Legendary Streak', '10 correct predictions in a row', 'streak', 200, '{"type": "streak", "count": 10}'),
  ('century', 'Century', 'Score 100 points in a single race', 'prediction', 100, '{"type": "single_race_score", "points": 100}'),
  ('fantasy_500', 'Fantasy Contender', 'Reach 500 points with fantasy team', 'fantasy', 50, '{"type": "fantasy_score", "points": 500}'),
  ('fantasy_1000', 'Fantasy Champion', 'Reach 1000 points with fantasy team', 'fantasy', 150, '{"type": "fantasy_score", "points": 1000}'),
  ('league_winner', 'League Champion', 'Win a private league', 'social', 100, '{"type": "league_win"}'),
  ('full_season', 'Full Season', 'Predict all races in a season', 'prediction', 200, '{"type": "season_predictions", "count": "all"}'),
  ('rain_master', 'Rain Master', 'Best prediction score in a wet race', 'special', 50, '{"type": "wet_race_best"}'),
  ('invictus', 'Invictus', 'Correctly predict pole, winner, and fastest lap', 'prediction', 100, '{"type": "triple_correct"}'),
  ('top10_king', 'Top 10 King', 'Get 5 perfect top 10 predictions', 'prediction', 150, '{"type": "top10_perfect", "count": 5}');

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_displayed BOOLEAN DEFAULT false,
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

CREATE TABLE user_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES levels(id),
  current_xp DECIMAL(10,1) DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);

CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  last_prediction_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'prediction_open', 'prediction_closing', 'qualifying_start',
    'race_start', 'results_available', 'league_invite',
    'achievement_unlocked', 'level_up'
  )),
  title VARCHAR(200) NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ============================================================
-- SIMULATION HISTORY
-- ============================================================

CREATE TABLE simulation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  race_id UUID REFERENCES races(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('race', 'season', 'what_if')),
  parameters JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circuits_updated_at
  BEFORE UPDATE ON circuits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_races_updated_at
  BEFORE UPDATE ON races FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
  BEFORE UPDATE ON predictions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS (Row Level Security) Policies (DISABLED)
-- ============================================================

-- RLS is disabled because user authentication and authorization are handled 
-- entirely at the application layer by the Express server.
--
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE fantasy_teams ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY user_read_own ON users
--   FOR SELECT USING (id = current_setting('app.current_user_id')::UUID OR current_setting('app.user_role') = 'admin');
-- 
-- CREATE POLICY prediction_read_own ON predictions
--   FOR SELECT USING (user_id = current_setting('app.current_user_id')::UUID);
-- 
-- CREATE POLICY fantasy_read_own ON fantasy_teams
--   FOR SELECT USING (user_id = current_setting('app.current_user_id')::UUID);
-- 
-- CREATE POLICY league_member_read ON league_members
--   FOR SELECT USING (
--     league_id IN (
--       SELECT league_id FROM league_members WHERE user_id = current_setting('app.current_user_id')::UUID
--     )
--   );
-- 
-- CREATE POLICY notification_read_own ON notifications
--   FOR SELECT USING (user_id = current_setting('app.current_user_id')::UUID);
