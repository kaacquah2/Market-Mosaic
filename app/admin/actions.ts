"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function updateAllProductsStock() {
  try {
    const supabase = await createClient()
    
    // Get all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name')
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError)
      return { success: false, error: fetchError.message }
    }
    
    if (!products || products.length === 0) {
      return { success: false, error: 'No products found' }
    }
    
    // Update all products with random stock between 10-100
    const updates = products.map(async (product) => {
      const stockQuantity = Math.floor(Math.random() * 90) + 10
      
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: stockQuantity })
        .eq('id', product.id)
      
      if (error) {
        console.error(`Error updating ${product.name}:`, error)
        return false
      }
      
      return true
    })
    
    await Promise.all(updates)
    
    return { success: true, updated: products.length, cacheClear: true }
  } catch (error) {
    console.error('Error updating stock:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

export async function uploadProductImage(file: File) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Check if user is admin
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()
    
    if (!userRole || userRole.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      })
    
    if (error) {
      console.error('Error uploading image:', error)
      return { success: false, error: error.message }
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)
    
    return { 
      success: true, 
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: 'Failed to upload image' }
  }
}

export async function createProductWithImage(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Check if user is admin
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()
    
    if (!userRole || userRole.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Get form data
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const stockQuantity = formData.get('stock_quantity') as string
    const sku = formData.get('sku') as string
    const imageUrl = formData.get('image_url') as string
    const weight = formData.get('weight') as string
    
    // Upload image if provided
    const imageFile = formData.get('image_file') as File
    let finalImageUrl = imageUrl
    
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadProductImage(imageFile)
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error }
      }
      finalImageUrl = uploadResult.url || ""
    }
    
    // Insert product
    const { error: insertError } = await supabase.from('products').insert({
      name,
      description,
      price: parseFloat(price),
      category,
      image_url: finalImageUrl,
      stock_quantity: stockQuantity ? parseInt(stockQuantity) : 0,
      sku: sku || null,
      weight: weight ? parseFloat(weight) : null,
      is_active: true
    })
    
    if (insertError) {
      console.error('Error creating product:', insertError)
      return { success: false, error: insertError.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
}
