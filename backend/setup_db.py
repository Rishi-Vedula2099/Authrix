import asyncio
import asyncpg
import sys

async def setup_db():
    common_passwords = ["password", "postgres", "root", "", "admin", "12345678"]
    user = "postgres"
    host = "localhost"
    port = "5432"
    dbname = "authrix"

    print(f"--- Authrix Database Setup Tool ---")
    
    found_password = None
    for pwd in common_passwords:
        try:
            # Try connecting to 'postgres' database first to see if password works
            conn = await asyncpg.connect(user=user, password=pwd, host=host, port=port, database="postgres")
            print(f"[✓] Success with password: '{pwd}'")
            found_password = pwd
            
            # Check if 'authrix' exists
            exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname=$1", dbname)
            if not exists:
                print(f"[*] Creating database '{dbname}'...")
                await conn.execute(f"CREATE DATABASE {dbname}")
                print(f"[✓] Database '{dbname}' created successfully.")
            else:
                print(f"[i] Database '{dbname}' already exists.")
            
            await conn.close()
            break
        except asyncpg.exceptions.InvalidPasswordError:
            print(f"[x] Password '{pwd}' failed.")
        except Exception as e:
            print(f"[!] Error: {str(e)}")
            break

    if found_password is not None:
        # Update .env file
        env_path = ".env"
        try:
            with open(env_path, "r") as f:
                lines = f.readlines()
            
            with open(env_path, "w") as f:
                for line in lines:
                    if line.startswith("DATABASE_URL="):
                        f.write(f"DATABASE_URL=postgresql+asyncpg://{user}:{found_password}@{host}:{port}/{dbname}\n")
                    else:
                        f.write(line)
            print(f"\n[🚀] Updated .env with working credentials!")
            print(f"You can now run: python -m uvicorn app.main:app --reload")
        except Exception as e:
            print(f"[!] Errow updating .env: {e}")
    else:
        print("\n[⚠️] Could not find a working password. Please check your PostgreSQL settings manually.")

if __name__ == "__main__":
    asyncio.run(setup_db())
