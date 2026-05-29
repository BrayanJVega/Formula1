-- Seed data for 2025 F1 season
INSERT INTO seasons (id, year, is_active, total_races) VALUES
  ('s2025', 2025, true, 24)
ON CONFLICT (id) DO NOTHING;

INSERT INTO races (id, season_id, circuit_id, name, round, status, date, qualifying_date, race_date, local_timezone, laps) VALUES
  ('r01', 's2025', 'c001', 'Formula 1 Gulf Air Bahrain Grand Prix 2025', 1, 'upcoming', '2025-03-14', '2025-03-14T16:00:00+03:00', '2025-03-16T17:00:00+03:00', 'Asia/Bahrain', 57),
  ('r02', 's2025', 'c002', 'Formula 1 STC Saudi Arabian Grand Prix 2025', 2, 'upcoming', '2025-03-21', '2025-03-21T16:00:00+03:00', '2025-03-23T17:00:00+03:00', 'Asia/Riyadh', 50),
  ('r03', 's2025', 'c003', 'Formula 1 Rolex Australian Grand Prix 2025', 3, 'upcoming', '2025-04-04', '2025-04-04T16:00:00+11:00', '2025-04-06T15:00:00+10:00', 'Australia/Melbourne', 58),
  ('r04', 's2025', 'c004', 'Formula 1 MSC Cruises Grand Prix of Emilia-Romagna 2025', 4, 'upcoming', '2025-04-18', '2025-04-18T16:00:00+02:00', '2025-04-20T15:00:00+02:00', 'Europe/Rome', 63),
  ('r05', 's2025', 'c005', 'Formula 1 Crypto.com Miami Grand Prix 2025', 5, 'upcoming', '2025-05-02', '2025-05-02T16:00:00-04:00', '2025-05-04T15:00:00-04:00', 'America/New_York', 57),
  ('r06', 's2025', 'c006', 'Formula 1 AWS Gran Premio de España 2025', 6, 'upcoming', '2025-05-16', '2025-05-16T16:00:00+02:00', '2025-05-18T15:00:00+02:00', 'Europe/Madrid', 66),
  ('r07', 's2025', 'c007', 'Formula 1 Grand Prix de Monaco 2025', 7, 'upcoming', '2025-05-23', '2025-05-23T16:00:00+02:00', '2025-05-25T15:00:00+02:00', 'Europe/Monaco', 78),
  ('r08', 's2025', 'c008', 'Formula 1 AWS Grand Prix du Canada 2025', 8, 'upcoming', '2025-06-06', '2025-06-06T16:00:00-04:00', '2025-06-08T14:00:00-04:00', 'America/Toronto', 70),
  ('r09', 's2025', 'c009', 'Formula 1 Qatar Airways Austrian Grand Prix 2025', 9, 'upcoming', '2025-06-20', '2025-06-20T16:00:00+02:00', '2025-06-22T15:00:00+02:00', 'Europe/Vienna', 71),
  ('r10', 's2025', 'c010', 'Formula 1 Qatar Airways British Grand Prix 2025', 10, 'upcoming', '2025-07-04', '2025-07-04T16:00:00+01:00', '2025-07-06T15:00:00+01:00', 'Europe/London', 52),
  ('r11', 's2025', 'c011', 'Formula 1 Hungarian Grand Prix 2025', 11, 'upcoming', '2025-07-18', '2025-07-18T16:00:00+02:00', '2025-07-20T15:00:00+02:00', 'Europe/Budapest', 70),
  ('r12', 's2025', 'c012', 'Formula 1 Rolex Belgian Grand Prix 2025', 12, 'upcoming', '2025-07-25', '2025-07-25T16:00:00+02:00', '2025-07-27T15:00:00+02:00', 'Europe/Brussels', 44),
  ('r13', 's2025', 'c013', 'Formula 1 Heineken Dutch Grand Prix 2025', 13, 'upcoming', '2025-08-22', '2025-08-22T16:00:00+02:00', '2025-08-24T15:00:00+02:00', 'Europe/Amsterdam', 72),
  ('r14', 's2025', 'c014', 'Formula 1 Pirelli Gran Premio d''Italia 2025', 14, 'upcoming', '2025-09-05', '2025-09-05T16:00:00+02:00', '2025-09-07T15:00:00+02:00', 'Europe/Rome', 53),
  ('r15', 's2025', 'c015', 'Formula 1 Azerbaijan Grand Prix 2025', 15, 'upcoming', '2025-09-19', '2025-09-19T16:00:00+04:00', '2025-09-21T15:00:00+04:00', 'Asia/Baku', 51),
  ('r16', 's2025', 'c016', 'Formula 1 Singapore Airlines Singapore Grand Prix 2025', 16, 'upcoming', '2025-10-03', '2025-10-03T16:00:00+08:00', '2025-10-05T20:00:00+08:00', 'Asia/Singapore', 62),
  ('r17', 's2025', 'c017', 'Formula 1 Pirelli United States Grand Prix 2025', 17, 'upcoming', '2025-10-17', '2025-10-17T16:00:00-05:00', '2025-10-19T14:00:00-05:00', 'America/Chicago', 56),
  ('r18', 's2025', 'c018', 'Formula 1 Gran Premio de la Ciudad de México 2025', 18, 'upcoming', '2025-10-24', '2025-10-24T16:00:00-06:00', '2025-10-26T14:00:00-06:00', 'America/Mexico_City', 71),
  ('r19', 's2025', 'c019', 'Formula 1 Lenovo Grande Prêmio de São Paulo 2025', 19, 'upcoming', '2025-11-07', '2025-11-07T16:00:00-03:00', '2025-11-09T15:00:00-03:00', 'America/Sao_Paulo', 71),
  ('r20', 's2025', 'c020', 'Formula 1 Heineken Las Vegas Grand Prix 2025', 20, 'upcoming', '2025-11-20', '2025-11-20T16:00:00-08:00', '2025-11-22T22:00:00-08:00', 'America/Los_Angeles', 50),
  ('r21', 's2025', 'c021', 'Formula 1 Qatar Airways Qatar Grand Prix 2025', 21, 'upcoming', '2025-11-28', '2025-11-28T16:00:00+03:00', '2025-11-30T17:00:00+03:00', 'Asia/Qatar', 57),
  ('r22', 's2025', 'c022', 'Formula 1 Etihad Airways Abu Dhabi Grand Prix 2025', 22, 'upcoming', '2025-12-05', '2025-12-05T16:00:00+04:00', '2025-12-07T17:00:00+04:00', 'Asia/Dubai', 58)
ON CONFLICT (id) DO NOTHING;
