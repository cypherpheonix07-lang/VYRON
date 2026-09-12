import asyncio
import asyncpg

hosts = [
  "aws-0-ap-south-1.pooler.supabase.com",
  "db.hbbunfizlwgvripgwzdo.supabase.co"
]
passwords = [
  "BrahmaSecurePass2026!",
  "SecurePass123!_",
  "AdminSecurePass123!"
]

async def probe():
  for h in hosts:
    for p in passwords:
      for u in ["postgres.hbbunfizlwgvripgwzdo", "postgres"]:
        for port in [6543, 5432]:
          try:
            conn = await asyncio.wait_for(asyncpg.connect(
              user=u,
              password=p,
              host=h,
              port=port,
              database="postgres",
              ssl="require"
            ), timeout=3.0)
            print(f"SUCCESS! host={h}, port={port}, user={u}")
            await conn.close()
            return
          except Exception as e:
            # print(f"fail {h}:{port} {u}: {e}")
            pass
  print("All direct pooler connection combinations failed.")

asyncio.run(probe())
