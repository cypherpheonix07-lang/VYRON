import asyncio
import os
import asyncpg

env = {}
if os.path.exists("./.env"):
    with open("./.env", "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip("'\"")

host = env.get("SUPAVISOR_HOST", "aws-0-ap-south-1.pooler.supabase.com")
user = env.get("DB_USER", "postgres.hbbunfizlwgvripgwzdo")
password = env.get("DB_PASSWORD", "BrahmaSecurePass2026!")
db = env.get("DB_NAME", "postgres")

async def main():
    try:
        conn = await asyncpg.connect(
            user=user,
            password=password,
            host=host,
            port=6543,
            database=db,
            ssl="require"
        )
        val = await conn.fetchval("SELECT current_database();")
        print("Connected successfully! Current DB:", val)
        await conn.close()
    except Exception as e:
        print("Connection failed:", e)

asyncio.run(main())
