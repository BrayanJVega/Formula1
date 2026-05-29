-- Seed data for F1 drivers (2025 season)
INSERT INTO drivers (id, name, number, nationality, date_of_birth, team_id, is_active) VALUES
  ('d001', 'Max Verstappen', 1, 'Netherlands', '1997-09-30', 't001', true),
  ('d002', 'Sergio Perez', 11, 'Mexico', '1990-01-26', 't001', true),
  ('d003', 'Lewis Hamilton', 44, 'United Kingdom', '1985-01-07', 't002', true),
  ('d004', 'George Russell', 63, 'United Kingdom', '1998-02-15', 't002', true),
  ('d005', 'Charles Leclerc', 16, 'Monaco', '1997-10-16', 't003', true),
  ('d006', 'Carlos Sainz', 55, 'Spain', '1994-09-01', 't003', true),
  ('d007', 'Lando Norris', 4, 'United Kingdom', '1999-11-13', 't004', true),
  ('d008', 'Oscar Piastri', 81, 'Australia', '2001-04-06', 't004', true),
  ('d009', 'Fernando Alonso', 14, 'Spain', '1981-07-29', 't005', true),
  ('d010', 'Lance Stroll', 18, 'Canada', '1998-10-29', 't005', true),
  ('d011', 'Pierre Gasly', 10, 'France', '1996-02-07', 't006', true),
  ('d012', 'Esteban Ocon', 31, 'France', '1996-09-17', 't006', true),
  ('d013', 'Alexander Albon', 23, 'Thailand', '1996-03-23', 't007', true),
  ('d014', 'Franco Colapinto', 43, 'Argentina', '2003-05-27', 't007', true),
  ('d015', 'Yuki Tsunoda', 22, 'Japan', '2000-05-11', 't008', true),
  ('d016', 'Daniel Ricciardo', 3, 'Australia', '1989-07-01', 't008', true),
  ('d017', 'Kevin Magnussen', 20, 'Denmark', '1992-10-05', 't009', true),
  ('d018', 'Nico Hulkenberg', 27, 'Germany', '1987-08-19', 't009', true),
  ('d019', 'Valtteri Bottas', 77, 'Finland', '1989-08-28', 't010', true),
  ('d020', 'Zhou Guanyu', 24, 'China', '1999-05-30', 't010', true)
ON CONFLICT (id) DO NOTHING;
