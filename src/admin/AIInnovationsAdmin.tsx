import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// --- Service functions for AI Innovations ---
const fetchAIInnovations = async () => (await api.get('/ai-innovations')).data;
const createAIInnovation = async (data: any) => (await api.post('/ai-innovations', data)).data;
const updateAIInnovation = async ({ id, ...data }: any) => (await api.put(`/ai-innovations/${id}`, data)).data;
const deleteAIInnovation = async (id: string) => (await api.delete(`/ai-innovations/${id}`)).data;

const emptyInnovation = { type: 'latest', title: '', description: '', image: '', link: '', category: '' };

// --- Service functions for Research Papers ---
const fetchResearchPapers = async () => (await api.get('/ai-innovations/papers/all')).data;
const createResearchPaper = async (data: any) => (await api.post('/ai-innovations/papers', data)).data;
const updateResearchPaper = async ({ id, ...data }: any) => (await api.put(`/ai-innovations/papers/${id}`, data)).data;
const deleteResearchPaper = async (id: string) => (await api.delete(`/ai-innovations/papers/${id}`)).data;

const emptyPaper = { title: '', authors: '', abstract: '', link: '', image: '' };

const AIInnovationsAdmin = () => {
  const queryClient = useQueryClient();
  // Innovations
  const { data: innovations, isLoading: loadingInnovations } = useQuery({
    queryKey: ['ai-innovations'],
    queryFn: fetchAIInnovations,
  });
  const createInnovation = useMutation({
    mutationFn: createAIInnovation,
    onSuccess: () => { setInnovationModal(false); setInnovationForm(emptyInnovation); setEditInnovationId(null); queryClient.invalidateQueries({ queryKey: ['ai-innovations'] }); }
  });
  const updateInnovation = useMutation({
    mutationFn: updateAIInnovation,
    onSuccess: () => { setInnovationModal(false); setInnovationForm(emptyInnovation); setEditInnovationId(null); queryClient.invalidateQueries({ queryKey: ['ai-innovations'] }); }
  });
  const deleteInnovation = useMutation({
    mutationFn: deleteAIInnovation,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-innovations'] }); }
  });

  // Research Papers
  const { data: papers, isLoading: loadingPapers } = useQuery({
    queryKey: ['ai-research-papers'],
    queryFn: fetchResearchPapers,
  });
  const createPaper = useMutation({
    mutationFn: createResearchPaper,
    onSuccess: () => { setPaperModal(false); setPaperForm(emptyPaper); setEditPaperId(null); queryClient.invalidateQueries({ queryKey: ['ai-research-papers'] }); }
  });
  const updatePaper = useMutation({
    mutationFn: updateResearchPaper,
    onSuccess: () => { setPaperModal(false); setPaperForm(emptyPaper); setEditPaperId(null); queryClient.invalidateQueries({ queryKey: ['ai-research-papers'] }); }
  });
  const deletePaper = useMutation({
    mutationFn: deleteResearchPaper,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-research-papers'] }); }
  });

  // Modal state
  const [innovationModal, setInnovationModal] = useState(false);
  const [editInnovationId, setEditInnovationId] = useState<string | null>(null);
  const [innovationForm, setInnovationForm] = useState<any>(emptyInnovation);

  const [paperModal, setPaperModal] = useState(false);
  const [editPaperId, setEditPaperId] = useState<string | null>(null);
  const [paperForm, setPaperForm] = useState<any>(emptyPaper);

  // Handlers for Innovations
  const handleEditInnovation = (item: any) => { setEditInnovationId(item.id); setInnovationForm(item); setInnovationModal(true); };
  const handleAddInnovation = () => { setEditInnovationId(null); setInnovationForm(emptyInnovation); setInnovationModal(true); };
  const handleDeleteInnovation = (id: string) => { if (window.confirm('Delete this innovation?')) deleteInnovation.mutate(id); };
  const handleSubmitInnovation = (e: React.FormEvent) => {
    e.preventDefault();
    if (editInnovationId) updateInnovation.mutate({ id: editInnovationId, ...innovationForm });
    else createInnovation.mutate(innovationForm);
  };

  // Handlers for Papers
  const handleEditPaper = (item: any) => { setEditPaperId(item.id); setPaperForm(item); setPaperModal(true); };
  const handleAddPaper = () => { setEditPaperId(null); setPaperForm(emptyPaper); setPaperModal(true); };
  const handleDeletePaper = (id: string) => { if (window.confirm('Delete this research paper?')) deletePaper.mutate(id); };
  const handleSubmitPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPaperId) updatePaper.mutate({ id: editPaperId, ...paperForm });
    else createPaper.mutate(paperForm);
  };

  return (
    <div>
      {/* Innovations Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Innovations</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddInnovation}>Add New</button>
      </div>
      {loadingInnovations ? <div>Loading...</div> : (
        <table className="min-w-full border mb-12">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {innovations && innovations.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="p-2 border">{item.type}</td>
                <td className="p-2 border">{item.title}</td>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border"><img src={item.image} alt={item.title} className="w-12 h-12 object-cover" loading="lazy" /></td>
                <td className="p-2 border"><a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Link</a></td>
                <td className="p-2 border">{item.category}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEditInnovation(item)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDeleteInnovation(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal for Add/Edit Innovation */}
      {innovationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px]" onSubmit={handleSubmitInnovation}>
            <h3 className="text-lg font-bold mb-4">{editInnovationId ? 'Edit' : 'Add'} AI Innovation</h3>
            <div className="mb-3">
              <label className="block mb-1">Type</label>
              <select className="w-full border p-2 rounded" value={innovationForm.type} onChange={e => setInnovationForm({ ...innovationForm, type: e.target.value })} required>
                <option value="latest">Latest</option>
                <option value="research">Research</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1">Title</label>
              <input className="w-full border p-2 rounded" value={innovationForm.title} onChange={e => setInnovationForm({ ...innovationForm, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Description</label>
              <textarea className="w-full border p-2 rounded" value={innovationForm.description} onChange={e => setInnovationForm({ ...innovationForm, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Image URL</label>
              <input className="w-full border p-2 rounded" value={innovationForm.image} onChange={e => setInnovationForm({ ...innovationForm, image: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Link</label>
              <input className="w-full border p-2 rounded" value={innovationForm.link} onChange={e => setInnovationForm({ ...innovationForm, link: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Category</label>
              <input className="w-full border p-2 rounded" value={innovationForm.category} onChange={e => setInnovationForm({ ...innovationForm, category: e.target.value })} required />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editInnovationId ? 'Update' : 'Create'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setInnovationModal(false); setEditInnovationId(null); setInnovationForm(emptyInnovation); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Research Papers Section */}
      <div className="flex justify-between items-center mb-6 mt-12">
        <h2 className="text-2xl font-bold">AI Research Papers</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddPaper}>Add New</button>
      </div>
      {loadingPapers ? <div>Loading...</div> : (
        <table className="min-w-full border mb-12">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Authors</th>
              <th className="p-2 border">Abstract</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {papers && papers.map((paper: any) => (
              <tr key={paper.id} className="border-b">
                <td className="p-2 border">{paper.title}</td>
                <td className="p-2 border">{paper.authors}</td>
                <td className="p-2 border max-w-xs truncate" title={paper.abstract}>{paper.abstract}</td>
                <td className="p-2 border"><img src={paper.image} alt={paper.title} className="w-12 h-12 object-cover" loading="lazy" /></td>
                <td className="p-2 border"><a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Link</a></td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEditPaper(paper)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDeletePaper(paper.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal for Add/Edit Paper */}
      {paperModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px]" onSubmit={handleSubmitPaper}>
            <h3 className="text-lg font-bold mb-4">{editPaperId ? 'Edit' : 'Add'} Research Paper</h3>
            <div className="mb-3">
              <label className="block mb-1">Title</label>
              <input className="w-full border p-2 rounded" value={paperForm.title} onChange={e => setPaperForm({ ...paperForm, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Authors</label>
              <input className="w-full border p-2 rounded" value={paperForm.authors} onChange={e => setPaperForm({ ...paperForm, authors: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Abstract</label>
              <textarea className="w-full border p-2 rounded" value={paperForm.abstract} onChange={e => setPaperForm({ ...paperForm, abstract: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Image URL</label>
              <input className="w-full border p-2 rounded" value={paperForm.image} onChange={e => setPaperForm({ ...paperForm, image: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Link</label>
              <input className="w-full border p-2 rounded" value={paperForm.link} onChange={e => setPaperForm({ ...paperForm, link: e.target.value })} required />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editPaperId ? 'Update' : 'Create'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setPaperModal(false); setEditPaperId(null); setPaperForm(emptyPaper); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIInnovationsAdmin; 