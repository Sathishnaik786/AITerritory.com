import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Service functions for CRUD
const fetchAIAgents = async () => (await api.get('/ai-agents')).data;
const createAIAgent = async (data: any) => (await api.post('/ai-agents', data)).data;
const updateAIAgent = async ({ id, ...data }: any) => (await api.put(`/ai-agents/${id}`, data)).data;
const deleteAIAgent = async (id: string) => (await api.delete(`/ai-agents/${id}`)).data;

const emptyForm = { type: 'featured', title: '', description: '', image: '', link: '', category: '', stars: '' };

const AIAgentsAdmin = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: fetchAIAgents,
  });
  const createMutation = useMutation({
    mutationFn: createAIAgent,
    onSuccess: () => { setModalOpen(false); setForm(emptyForm); queryClient.invalidateQueries({ queryKey: ['ai-agents'] }); }
  });
  const updateMutation = useMutation({
    mutationFn: updateAIAgent,
    onSuccess: () => { setModalOpen(false); setForm(emptyForm); setEditId(null); queryClient.invalidateQueries({ queryKey: ['ai-agents'] }); }
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAIAgent,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-agents'] }); }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const handleEdit = (item: any) => { setEditId(item.id); setForm(item); setModalOpen(true); };
  const handleAdd = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const handleDelete = (id: string) => { if (window.confirm('Delete this AI agent?')) deleteMutation.mutate(id); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) updateMutation.mutate({ id: editId, ...form });
    else createMutation.mutate(form);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Agents</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Add New</button>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Stars</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="p-2 border">{item.type}</td>
                <td className="p-2 border">{item.title}</td>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border"><img src={item.image} alt={item.title} className="w-12 h-12 object-cover" /></td>
                <td className="p-2 border"><a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Link</a></td>
                <td className="p-2 border">{item.category}</td>
                <td className="p-2 border">{item.stars}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px]" onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold mb-4">{editId ? 'Edit' : 'Add'} AI Agent</h3>
            <div className="mb-3">
              <label className="block mb-1">Type</label>
              <select className="w-full border p-2 rounded" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                <option value="featured">Featured</option>
                <option value="popular">Popular</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1">Title</label>
              <input className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Description</label>
              <textarea className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Image URL</label>
              <input className="w-full border p-2 rounded" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Link</label>
              <input className="w-full border p-2 rounded" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Category</label>
              <input className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Stars</label>
              <input className="w-full border p-2 rounded" value={form.stars} onChange={e => setForm({ ...form, stars: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editId ? 'Update' : 'Create'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setModalOpen(false); setEditId(null); setForm(emptyForm); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAgentsAdmin; 