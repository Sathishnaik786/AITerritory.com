-- Migration: Remove thumbnail_url from youtube_videos
ALTER TABLE youtube_videos DROP COLUMN IF EXISTS thumbnail_url; 