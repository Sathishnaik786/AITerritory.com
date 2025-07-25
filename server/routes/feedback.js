const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

// CREATE
router.post('/', async (req, res) => {
  const { type, message, email } = req.body;
  if (!type || !message) {
    return res.status(400).json({ error: 'Type and message are required.' });
  }
  const { error } = await supabase
    .from('feedback')
    .insert([{ id: uuidv4(), type, message, email: email || null, created_at: new Date().toISOString() }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true });
});

// READ ALL
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ ONE
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('feedback').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Feedback not found' });
  res.json(data);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type, message, email } = req.body;
  const { data, error } = await supabase
    .from('feedback')
    .update({ type, message, email })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Feedback not found' });
  res.json(data[0]);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('feedback').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router; 