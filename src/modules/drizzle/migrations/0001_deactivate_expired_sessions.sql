-- Create a function that will deactivate the session if expires_at has expired
CREATE OR REPLACE FUNCTION deactivate_expired_sessions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at IS NOT NULL AND NEW.expires_at < NOW() THEN
    NEW.is_active := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Delete the trigger if it already exists (in case of re-applying the migration)
DROP TRIGGER IF EXISTS trigger_deactivate_expired_sessions ON user_sessions;

-- Create a trigger that calls a function before inserting or updating
CREATE TRIGGER trigger_deactivate_expired_sessions
BEFORE INSERT OR UPDATE ON user_sessions
FOR EACH ROW
EXECUTE FUNCTION deactivate_expired_sessions();
