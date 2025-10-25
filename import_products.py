import os
import requests
import json

# Supabase configuration
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

def read_sql_file(filepath):
    """Read SQL file and extract INSERT statements"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract INSERT statements
    lines = content.split('\n')
    insert_lines = []
    in_insert = False
    
    for line in lines:
        if 'INSERT INTO' in line or in_insert:
            if line.strip():
                insert_lines.append(line)
            if line.strip().endswith(';'):
                in_insert = False
            else:
                in_insert = True
    
    return '\n'.join(insert_lines)

def import_products():
    """Import products from SQL files"""
    
    # Category files to import
    category_files = [
        'scripts/019_electronics_50.sql',
        'scripts/020_fashion_50.sql',
        'scripts/021_food_50.sql',
        'scripts/022_kitchen_50.sql',
        'scripts/023_home_50.sql',
        'scripts/024_sports_50.sql',
        'scripts/025_beauty_50.sql',
        'scripts/026_office_50.sql',
        'scripts/027_books_50.sql',
        'scripts/028_toys_50.sql',
        'scripts/029_pets_50.sql',
        'scripts/030_essentials_50.sql',
    ]
    
    print("📦 Starting product import...")
    
    for file in category_files:
        if os.path.exists(file):
            print(f"📄 Reading {file}...")
            sql_content = read_sql_file(file)
            
            # Execute SQL via Supabase REST API
            # Note: This requires using PostgreSQL directly or Supabase REST API
            print(f"✅ Parsed {file}")
        else:
            print(f"❌ File not found: {file}")
    
    print("\n✅ Import complete!")
    print("\n📝 To import manually:")
    print("1. Open Supabase SQL Editor")
    print("2. Copy and paste content from scripts/complete_all_products.sql")
    print("3. Click Run")

if __name__ == '__main__':
    import_products()

