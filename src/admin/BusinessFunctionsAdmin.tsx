import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Service functions for CRUD
const fetchBusinessFunctions = async () => (await api.get('/business-functions/functions')).data;
const createBusinessFunction = async (data: any) => (await api.post('/business-functions', data)).data;
const updateBusinessFunction = async ({ id, ...data }: any) => (await api.put(`/business-functions/${id}`, data)).data;
const deleteBusinessFunction = async (id: string) => (await api.delete(`/business-functions/${id}`)).data;

const emptyForm = { icon: '', title: '', description: '', adoption_percentage: 0 };

const BusinessFunctionsAdmin = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['business-functions'],
    queryFn: fetchBusinessFunctions,
  });
  const createMutation = useMutation({
    mutationFn: createBusinessFunction,
    onSuccess: () => { setModalOpen(false); setForm(emptyForm); queryClient.invalidateQueries({ queryKey: ['business-functions'] }); }
  });
  const updateMutation = useMutation({
    mutationFn: updateBusinessFunction,
    onSuccess: () => { setModalOpen(false); setForm(emptyForm); setEditId(null); queryClient.invalidateQueries({ queryKey: ['business-functions'] }); }
  });
  const deleteMutation = useMutation({
    mutationFn: deleteBusinessFunction,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['business-functions'] }); }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const handleEdit = (item: any) => { setEditId(item.id); setForm(item); setModalOpen(true); };
  const handleAdd = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const handleDelete = (id: string) => { if (window.confirm('Delete this business function?')) deleteMutation.mutate(id); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) updateMutation.mutate({ id: editId, ...form });
    else createMutation.mutate(form);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Business Functions</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Add New</button>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Icon</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Adoption %</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="p-2 border">{item.icon}</td>
                <td className="p-2 border">{item.title}</td>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border text-center">{item.adoption_percentage}</td>
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
            <h3 className="text-lg font-bold mb-4">{editId ? 'Edit' : 'Add'} Business Function</h3>
            <div className="mb-3">
              <label className="block mb-1">Icon</label>
              <input className="w-full border p-2 rounded" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} required />
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
              <label className="block mb-1">Adoption Percentage</label>
              <input type="number" className="w-full border p-2 rounded" value={form.adoption_percentage} onChange={e => setForm({ ...form, adoption_percentage: Number(e.target.value) })} required min={0} max={100} />
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

export default BusinessFunctionsAdmin; 