"""Create or update the default admin user."""

import sys
import uuid
from datetime import datetime, timezone

try:
    import psycopg2
    from psycopg2 import OperationalError
except ImportError:
    print("Missing dependency: psycopg2")
    print("Run `pip install -r requirements.txt` in backend/venv and try again.")
    sys.exit(1)

from app.auth.password import hash_password
from app.config.settings import settings


DEFAULT_ADMIN_NAME = "Administrator"
DEFAULT_ADMIN_ROLE = "SUPER_ADMIN"


def seed_admin() -> None:
    """Ensure the configured admin user exists."""
    try:
        conn = psycopg2.connect(settings.DATABASE_URL)
    except OperationalError as exc:
        print("Failed to connect to PostgreSQL using DATABASE_URL from backend/.env")
        print(str(exc).strip() or "Connection refused or database is unavailable.")
        sys.exit(1)

    try:
        password_hash = hash_password(settings.ADMIN_PASSWORD)
        now = datetime.now(timezone.utc)

        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO "User" (
                      "id",
                      "email",
                      "password_hash",
                      "name",
                      "role",
                      "is_active",
                      "createdAt",
                      "updatedAt"
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT ("email")
                    DO UPDATE SET
                      "password_hash" = EXCLUDED."password_hash",
                      "name" = EXCLUDED."name",
                      "role" = EXCLUDED."role",
                      "is_active" = EXCLUDED."is_active",
                      "updatedAt" = EXCLUDED."updatedAt"
                    RETURNING "email", "role";
                    """,
                    (
                        str(uuid.uuid4()),
                        settings.ADMIN_EMAIL,
                        password_hash,
                        DEFAULT_ADMIN_NAME,
                        DEFAULT_ADMIN_ROLE,
                        True,
                        now,
                        now,
                    ),
                )
                email, role = cur.fetchone()

        print(f"Seeded admin user: {email} ({role})")
        print(f"Login email: {settings.ADMIN_EMAIL}")
        print(f"Login password: {settings.ADMIN_PASSWORD}")
    finally:
        conn.close()


if __name__ == "__main__":
    seed_admin()
