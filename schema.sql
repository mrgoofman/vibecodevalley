-- Vibecode Valley - Email Waitlist Database Schema
-- Cloudflare D1 (SQLite) Database

-- Create the emails table
CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL,  -- 'hero' or 'footer' to track which form was used
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email ON emails(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_created_at ON emails(created_at DESC);
