#!/usr/bin/env python3
"""
Script to add sample ratings to all products in the database.
This will populate the product_reviews table with fake reviews.
"""

import os
import random
from datetime import datetime, timedelta
from supabase import create_client

# Initialize Supabase client
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("Error: Supabase environment variables not set!")
    print("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def add_sample_ratings():
    """Add sample ratings to all products."""
    
    print("Fetching products...")
    
    # Get all active products
    response = supabase.table("products").select("id").eq("is_active", True).execute()
    
    if not response.data:
        print("No active products found!")
        return
    
    products = response.data
    print(f"Found {len(products)} products to add ratings to...")
    
    total_reviews_added = 0
    
    for product in products:
        product_id = product["id"]
        
        # Generate random number of reviews (5-15)
        num_reviews = random.randint(5, 15)
        
        print(f"\nAdding {num_reviews} reviews to product {product_id}")
        
        for i in range(num_reviews):
            # Random rating between 3 and 5 (mostly positive)
            rating = random.randint(3, 5)
            
            # Generate random review content
            titles = {
                5: "Perfect! Highly recommend",
                4: "Great product, very satisfied",
                3: "Good product, could be better"
            }
            
            comments = {
                5: "This product exceeded my expectations. Great quality and fast shipping!",
                4: "Very happy with my purchase. Quality is good for the price.",
                3: "Product is okay but not amazing. Does the job."
            }
            
            # Generate a fake user ID for each review
            fake_user_id = f"fake-user-{random.randint(100000, 999999)}"
            
            # Random date within last 30 days
            days_ago = random.randint(1, 30)
            created_at = (datetime.now() - timedelta(days=days_ago)).isoformat()
            
            try:
                supabase.table("product_reviews").insert({
                    "product_id": product_id,
                    "user_id": fake_user_id,
                    "rating": rating,
                    "title": titles[rating],
                    "comment": comments[rating],
                    "created_at": created_at
                }).execute()
                
                total_reviews_added += 1
                
            except Exception as e:
                # Ignore conflicts if review already exists
                if "duplicate key" not in str(e).lower():
                    print(f"  Warning: {e}")
    
    print(f"\n✅ Successfully added {total_reviews_added} reviews!")
    
    # Now update the products table with average ratings
    print("\nUpdating products with calculated ratings...")
    
    for product in products:
        product_id = product["id"]
        
        # Get all reviews for this product
        reviews_response = supabase.table("product_reviews").select("rating").eq("product_id", product_id).execute()
        
        if reviews_response.data:
            ratings = [review["rating"] for review in reviews_response.data]
            average_rating = round(sum(ratings) / len(ratings), 1)
            review_count = len(ratings)
            
            # Update the product
            supabase.table("products").update({
                "average_rating": average_rating,
                "review_count": review_count
            }).eq("id", product_id).execute()
            
            print(f"  Updated product {product_id}: {average_rating} ⭐ ({review_count} reviews)")
    
    print("\n✅ Done! All products now have ratings!")
    
    # Show some sample results
    print("\n📊 Sample products with ratings:")
    response = supabase.table("products").select("name, average_rating, review_count").eq("is_active", True).order("average_rating", desc=True).limit(10).execute()
    
    if response.data:
        for product in response.data:
            name = product["name"]
            rating = product["average_rating"]
            count = product["review_count"]
            print(f"  • {name}: {rating} ⭐ ({count} reviews)")

if __name__ == "__main__":
    print("🌟 Adding Sample Ratings to Products")
    print("=" * 50)
    add_sample_ratings()
