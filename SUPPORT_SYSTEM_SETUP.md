# Support System Setup & Testing

## Is the Support Page Functional?

**Short Answer:** The support page UI is functional, but you need to set up the database tables first.

## What Works Right Now ✅

1. **Support Page UI** (`/support`)
   - ✅ Contact information displayed (your email and phone)
   - ✅ FAQ section
   - ✅ Support chat interface
   - ✅ Navigation and layout

2. **Support Chat Component**
   - ✅ UI for creating tickets
   - ✅ UI for viewing tickets
   - ✅ UI for sending messages
   - ✅ Real-time unread count

## What Needs Setup ⚠️

### Database Tables Required:

You need to create these tables in Supabase:

1. **`support_tickets`** - Stores support tickets
2. **`support_messages`** - Stores messages in tickets

## Quick Setup - Run This SQL

**Go to Supabase Dashboard → SQL Editor → Run this:**

```sql
-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL CHECK (category IN ('general', 'order', 'product', 'shipping', 'return', 'technical', 'billing')),
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Policies for support_tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tickets" ON support_tickets;
CREATE POLICY "Users can update own tickets" ON support_tickets
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for support_messages
DROP POLICY IF EXISTS "Users can view messages for own tickets" ON support_messages;
CREATE POLICY "Users can view messages for own tickets" ON support_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = support_messages.ticket_id
      AND support_tickets.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can send messages to own tickets" ON support_messages;
CREATE POLICY "Users can send messages to own tickets" ON support_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = ticket_id
      AND support_tickets.user_id = auth.uid()
    )
  );

-- Admin policies (if needed)
DROP POLICY IF EXISTS "Admins can view all tickets" ON support_tickets;
CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all tickets" ON support_tickets;
CREATE POLICY "Admins can update all tickets" ON support_tickets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view all messages" ON support_messages;
CREATE POLICY "Admins can view all messages" ON support_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can send messages to any ticket" ON support_messages;
CREATE POLICY "Admins can send messages to any ticket" ON support_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Verify tables were created
SELECT 
  'support_tickets' as table_name,
  COUNT(*) as row_count
FROM support_tickets
UNION ALL
SELECT 
  'support_messages' as table_name,
  COUNT(*) as row_count
FROM support_messages;
```

## Testing the Support System

### Step 1: Run the SQL Above
This creates all necessary tables and policies.

### Step 2: Go to Support Page
```
http://localhost:3000/support
```

### Step 3: Test Creating a Ticket

1. Scroll down to **"Live Support Chat"** section
2. Click **"Start New Ticket"** (or similar button)
3. Fill in:
   - Subject: "Test ticket"
   - Category: Select one (e.g., "General")
   - Priority: Select one (e.g., "Medium")
   - Message: "This is a test message"
4. Click **"Create Ticket"**

### Step 4: Verify It Works

**Check in Browser Console (F12):**
- ✅ No errors
- ✅ Ticket appears in the list
- ✅ You can click on it to view

**Check in Supabase:**
```sql
-- See all tickets
SELECT * FROM support_tickets;

-- See all messages
SELECT * FROM support_messages;
```

## What the Support System Does

### For Regular Users:
1. **Create Tickets** - Ask questions, report issues
2. **Send Messages** - Reply to tickets
3. **View History** - See all their past tickets
4. **Unread Count** - Shows how many new admin replies

### For Admins:
1. **View All Tickets** - See tickets from all users
2. **Respond to Tickets** - Send admin messages
3. **Assign Tickets** - Assign to specific admins
4. **Update Status** - Change ticket status (open/in_progress/resolved/closed)
5. **Set Priority** - Update urgency

## Troubleshooting

### Issue: "Error creating ticket"
**Check:**
1. Tables exist in Supabase
2. RLS policies are set up correctly
3. You're logged in
4. Check browser console for specific error

### Issue: "Error fetching tickets"
**Check:**
1. RLS policies allow SELECT
2. You're logged in as the correct user
3. Check network tab for 400/401 errors

### Issue: Can't see tickets
**Solution:**
```sql
-- Temporarily disable RLS to test
ALTER TABLE support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages DISABLE ROW LEVEL SECURITY;

-- Try creating a ticket again
-- Then re-enable RLS:
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
```

## Features Available

✅ **Ticket Creation** - Users can create support tickets  
✅ **Categories** - General, Order, Product, Shipping, Return, Technical, Billing  
✅ **Priority Levels** - Low, Medium, High, Urgent  
✅ **Status Tracking** - Open, In Progress, Resolved, Closed  
✅ **Message Threading** - Users and admins can reply  
✅ **Unread Tracking** - Shows new messages from admins  
✅ **Admin Assignment** - Tickets can be assigned to specific admins  
✅ **Time Tracking** - Created, updated, resolved timestamps  

## Summary

**Current Status:**
- ✅ UI is ready and looks good
- ✅ Code is functional
- ⚠️ **Database tables need to be created**

**To Make It Work:**
1. Run the SQL script above in Supabase
2. Refresh the support page
3. Try creating a ticket
4. ✅ Support system will be fully functional!

---

**Run the SQL script now and test it!** 🚀

