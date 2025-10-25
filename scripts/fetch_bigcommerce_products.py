import os
import requests
import json

# BigCommerce API Configuration
BIGCOMMERCE_STORE_HASH = os.getenv('BIGCOMMERCE_STORE_HASH')
BIGCOMMERCE_ACCESS_TOKEN = os.getenv('BIGCOMMERCE_ACCESS_TOKEN')

def get_bigcommerce_products():
    """Fetch products from BigCommerce API"""
    
    if not BIGCOMMERCE_STORE_HASH or not BIGCOMMERCE_ACCESS_TOKEN:
        print("❌ BigCommerce API credentials not found!")
        print("Please set BIGCOMMERCE_STORE_HASH and BIGCOMMERCE_ACCESS_TOKEN in .env")
        return []
    
    url = f"https://api.bigcommerce.com/stores/{BIGCOMMERCE_STORE_HASH}/v3/catalog/products"
    
    headers = {
        "X-Auth-Token": BIGCOMMERCE_ACCESS_TOKEN,
        "Content-Type": "application/json"
    }
    
    params = {
        "limit": 250,  # BigCommerce allows up to 250 per request
        "include": "images,variants"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        products = data.get('data', [])
        
        print(f"✅ Fetched {len(products)} products from BigCommerce")
        return products
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching products: {e}")
        return []

def convert_to_database_format(bigcommerce_product):
    """Convert BigCommerce product format to our database format"""
    
    # Get first image URL
    image_url = "/placeholder.svg"
    if bigcommerce_product.get('images'):
        image_url = bigcommerce_product['images'][0].get('url_standard', "/placeholder.svg")
    
    # Get price
    price = 0
    if bigcommerce_product.get('price'):
        price = float(bigcommerce_product['price'])
    
    # Get stock quantity
    stock_quantity = 0
    if bigcommerce_product.get('inventory_tracking') == 'product':
        stock_quantity = bigcommerce_product.get('inventory_level', 0)
    
    return {
        'name': bigcommerce_product.get('name', 'Unknown Product'),
        'description': bigcommerce_product.get('description', 'No description available'),
        'price': price,
        'category': bigcommerce_product.get('primary_category_name', 'Other'),
        'image_url': image_url,
        'stock_quantity': stock_quantity,
        'sku': bigcommerce_product.get('sku', ''),
        'external_id': bigcommerce_product.get('id')  # Keep BigCommerce ID for reference
    }

def generate_sql_insert(product):
    """Generate SQL INSERT statement for a product"""
    
    # Escape single quotes in strings
    name = product['name'].replace("'", "''")
    description = product['description'].replace("'", "''")
    image_url = product['image_url'].replace("'", "''")
    sku = product['sku'].replace("'", "''")
    
    return f"('{name}', '{description}', {product['price']}, '{product['category']}', '{image_url}', {product['stock_quantity']}, '{sku}')"

def main():
    print("🚀 Starting BigCommerce product import...")
    
    # Fetch products from BigCommerce
    products = get_bigcommerce_products()
    
    if not products:
        print("❌ No products found or error occurred")
        return
    
    # Generate SQL INSERT statements
    print("\n📝 Generating SQL INSERT statements...")
    
    sql_statements = []
    sql_statements.append("-- BigCommerce Products Import")
    sql_statements.append("DELETE FROM public.products;")
    sql_statements.append("")
    sql_statements.append("INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES")
    
    for product in products:
        formatted_product = convert_to_database_format(product)
        sql_insert = generate_sql_insert(formatted_product)
        sql_statements.append(sql_insert + ",")
    
    # Remove last comma and add semicolon
    sql_statements[-1] = sql_statements[-1].rstrip(',') + ';'
    
    # Add verification queries
    sql_statements.append("")
    sql_statements.append("-- Verification")
    sql_statements.append("SELECT COUNT(*) as total_products FROM public.products;")
    sql_statements.append("SELECT category, COUNT(*) as count FROM public.products GROUP BY category;")
    
    # Write to file
    output_file = "scripts/040_bigcommerce_products.sql"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"✅ SQL file created: {output_file}")
    print(f"📦 Total products: {len(products)}")
    print("\n📝 Next steps:")
    print("1. Open the SQL file in Supabase SQL Editor")
    print("2. Copy and paste the content")
    print("3. Click Run")

if __name__ == '__main__':
    main()

