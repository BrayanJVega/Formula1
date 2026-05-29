-- Seed data for F1 teams (2025 season)
INSERT INTO teams (id, name, full_name, nationality, base, team_principal, chassis, power_unit, is_active, founded_year) VALUES
  ('t001', 'Red Bull Racing', 'Oracle Red Bull Racing', 'Austria', 'Milton Keynes, UK', 'Christian Horner', 'RB21', 'Honda RBPT', true, 2005),
  ('t002', 'Mercedes', 'Mercedes-AMG Petronas Formula One Team', 'Germany', 'Brackley, UK', 'Toto Wolff', 'W16', 'Mercedes', true, 1970),
  ('t003', 'Ferrari', 'Scuderia Ferrari HP', 'Italy', 'Maranello, Italy', 'Frederic Vasseur', 'SF-25', 'Ferrari', true, 1950),
  ('t004', 'McLaren', 'McLaren Formula 1 Team', 'United Kingdom', 'Woking, UK', 'Andrea Stella', 'MCL60', 'Mercedes', true, 1966),
  ('t005', 'Aston Martin', 'Aston Martin Aramco Formula One Team', 'United Kingdom', 'Silverstone, UK', 'Mike Krack', 'AMR25', 'Mercedes', true, 1959),
  ('t006', 'Alpine', 'BWT Alpine F1 Team', 'France', 'Enstone, UK', 'Oliver Oakes', 'A525', 'Renault', true, 1986),
  ('t007', 'Williams', 'Williams Racing', 'United Kingdom', 'Grove, UK', 'James Vowles', 'FW47', 'Mercedes', true, 1978),
  ('t008', 'RB', 'Visa Cash App RB Formula One Team', 'Italy', 'Faenza, Italy', 'Laurent Mekies', 'VCARB 02', 'Honda RBPT', true, 2006),
  ('t009', 'Haas', 'MoneyGram Haas F1 Team', 'United States', 'Kannapolis, USA', 'Ayao Komatsu', 'VF-25', 'Ferrari', true, 2016),
  ('t010', 'Sauber', 'Stake F1 Team Kick Sauber', 'Switzerland', 'Hinwil, Switzerland', 'Mattia Binotto', 'C45', 'Ferrari', true, 1993)
ON CONFLICT (id) DO NOTHING;
