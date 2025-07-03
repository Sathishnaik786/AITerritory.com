import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'sonner';

// --- Service functions for Automation Tools ---
const fetchTools = async () => (await api.get('/ai-automation/tools')).data;
const createTool = async (data: any) => (await api.post('/ai-automation/tools', data)).data;
const updateTool = async ({ id, ...data }: any) => (await api.put(`/ai-automation/tools/${id}`, data)).data;
const deleteTool = async (id: string) => (await api.delete(`/ai-automation/tools/${id}`)).data;

const emptyTool = { title: '', description: '', image: '', link: '', category: '' };

// --- Service functions for Use Cases ---
const fetchUseCases = async () => (await api.get('/ai-automation/use-cases')).data;
const createUseCase = async (data: any) => (await api.post('/ai-automation/use-cases', data)).data;
const updateUseCase = async ({ id, ...data }: any) => (await api.put(`/ai-automation/use-cases/${id}`, data)).data;
const deleteUseCase = async (id: string) => (await api.delete(`/ai-automation/use-cases/${id}`)).data;

const emptyUseCase = { title: '', description: '', image: '', link: '', duration: '', level: '' };

// --- Service functions for Guides ---
const fetchGuides = async () => (await api.get('/ai-automation/guides')).data;
const createGuide = async (data: any) => (await api.post('/ai-automation/guides', data)).data;
const updateGuide = async ({ id, ...data }: any) => (await api.put(`/ai-automation/guides/${id}`, data)).data;
const deleteGuide = async (id: string) => (await api.delete(`/ai-automation/guides/${id}`)).data;

const emptyGuide = { title: '', description: '', video_link: '' };

const AIAutomationAdmin = () => {
  const queryClient = useQueryClient();
  // Tools
  const { data: tools, isLoading: loadingTools } = useQuery({
    queryKey: ['ai-automation-tools'],
    queryFn: fetchTools,
  });
  const createToolMutation = useMutation({
    mutationFn: createTool,
    onSuccess: () => { setToolModal(false); setToolForm(emptyTool); setEditToolId(null); queryClient.invalidateQueries({ queryKey: ['ai-automation-tools'] }); toast.success('Tool saved!'); }
  });
  const updateToolMutation = useMutation({
    mutationFn: updateTool,
    onSuccess: () => { setToolModal(false); setToolForm(emptyTool); setEditToolId(null); queryClient.invalidateQueries({ queryKey: ['ai-automation-tools'] }); toast.success('Tool updated!'); }
  });
  const deleteToolMutation = useMutation({
    mutationFn: deleteTool,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-automation-tools'] }); toast.success('Tool deleted!'); }
  });

  // Use Cases
  const { data: useCases, isLoading: loadingUseCases } = useQuery({
    queryKey: ['ai-automation-use-cases'],
    queryFn: fetchUseCases,
  });
  const createUseCaseMutation = useMutation({
    mutationFn: createUseCase,
    onSuccess: () => { setUseCaseModal(false); setUseCaseForm(emptyUseCase); setEditUseCaseId(null); queryClient.invalidateQueries({ queryKey: ['ai-automation-use-cases'] }); toast.success('Use case saved!'); }
  });
  const updateUseCaseMutation = useMutation({
    mutationFn: updateUseCase,
    onSuccess: () => { setUseCaseModal(false); setUseCaseForm(emptyUseCase); setEditUseCaseId(null); queryClient.invalidateQueries({ queryKey: ['ai-automation-use-cases'] }); toast.success('Use case updated!'); }
  });
  const deleteUseCaseMutation = useMutation({
    mutationFn: deleteUseCase,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-automation-use-cases'] }); toast.success('Use case deleted!'); }
  });

  // Guides
  const { data: guides, isLoading: loadingGuides } = useQuery({
    queryKey: ['ai-automation-guides'],
    queryFn: fetchGuides,
  });
  const createGuideMutation = useMutation({
    mutationFn: createGuide,
    onSuccess: () => { setGuideModal(false); setGuideForm(emptyGuide); setEditGuideId(null); queryClient.invalidateQueries({ queryKey: ['ai-automation-guides'] }); toast.success('Guide saved!'); }
  });
  const updateGuideMutation = useMutation({
    mutationFn: updateGuide,
    onSuccess: () => { setGuideModal(false); setGuideForm(emptyGuide); setEditGuideId(null); queryClient.invalidateQueries({ queryKey: ['ai-automation-guides'] }); toast.success('Guide updated!'); }
  });
  const deleteGuideMutation = useMutation({
    mutationFn: deleteGuide,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-automation-guides'] }); toast.success('Guide deleted!'); }
  });

  // Modal state
  const [toolModal, setToolModal] = useState(false);
  const [editToolId, setEditToolId] = useState<string | null>(null);
  const [toolForm, setToolForm] = useState<any>(emptyTool);

  const [useCaseModal, setUseCaseModal] = useState(false);
  const [editUseCaseId, setEditUseCaseId] = useState<string | null>(null);
  const [useCaseForm, setUseCaseForm] = useState<any>(emptyUseCase);

  const [guideModal, setGuideModal] = useState(false);
  const [editGuideId, setEditGuideId] = useState<string | null>(null);
  const [guideForm, setGuideForm] = useState<any>(emptyGuide);

  // Handlers for Tools
  const handleEditTool = (item: any) => { setEditToolId(item.id); setToolForm(item); setToolModal(true); };
  const handleAddTool = () => { setEditToolId(null); setToolForm(emptyTool); setToolModal(true); };
  const handleDeleteTool = (id: string) => { if (window.confirm('Delete this tool?')) deleteToolMutation.mutate(id); };
  const handleSubmitTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (editToolId) updateToolMutation.mutate({ id: editToolId, ...toolForm });
    else createToolMutation.mutate(toolForm);
  };

  // Handlers for Use Cases
  const handleEditUseCase = (item: any) => { setEditUseCaseId(item.id); setUseCaseForm(item); setUseCaseModal(true); };
  const handleAddUseCase = () => { setEditUseCaseId(null); setUseCaseForm(emptyUseCase); setUseCaseModal(true); };
  const handleDeleteUseCase = (id: string) => { if (window.confirm('Delete this use case?')) deleteUseCaseMutation.mutate(id); };
  const handleSubmitUseCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUseCaseId) updateUseCaseMutation.mutate({ id: editUseCaseId, ...useCaseForm });
    else createUseCaseMutation.mutate(useCaseForm);
  };

  // Handlers for Guides
  const handleEditGuide = (item: any) => { setEditGuideId(item.id); setGuideForm(item); setGuideModal(true); };
  const handleAddGuide = () => { setEditGuideId(null); setGuideForm(emptyGuide); setGuideModal(true); };
  const handleDeleteGuide = (id: string) => { if (window.confirm('Delete this guide?')) deleteGuideMutation.mutate(id); };
  const handleSubmitGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editGuideId) updateGuideMutation.mutate({ id: editGuideId, ...guideForm });
    else createGuideMutation.mutate(guideForm);
  };

  return (
    <div>
      {/* Automation Tools Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Automation Tools</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddTool}>Add New</button>
      </div>
      {loadingTools ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools && tools.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col gap-2 border relative">
              <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-2" loading="lazy" />
              <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 mb-1 w-fit">{item.category}</span>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs mb-1">Visit</a>
              <div className="flex gap-2 mt-auto">
                <button className="text-blue-600 hover:underline" onClick={() => handleEditTool(item)}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDeleteTool(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Add/Edit Tool */}
      {toolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px] max-w-md w-full" onSubmit={handleSubmitTool}>
            <h3 className="text-lg font-bold mb-4">{editToolId ? 'Edit' : 'Add'} Automation Tool</h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Title</label>
              <input className="w-full border p-2 rounded" value={toolForm.title} onChange={e => setToolForm({ ...toolForm, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Description</label>
              <textarea className="w-full border p-2 rounded" value={toolForm.description} onChange={e => setToolForm({ ...toolForm, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Image URL</label>
              <input className="w-full border p-2 rounded" value={toolForm.image} onChange={e => setToolForm({ ...toolForm, image: e.target.value })} required />
              {toolForm.image && <img src={toolForm.image} alt="Preview" className="w-full h-24 object-cover rounded mt-2" loading="lazy" />}
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Link</label>
              <input className="w-full border p-2 rounded" value={toolForm.link} onChange={e => setToolForm({ ...toolForm, link: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Category</label>
              <input className="w-full border p-2 rounded" value={toolForm.category} onChange={e => setToolForm({ ...toolForm, category: e.target.value })} required />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editToolId ? 'Update' : 'Create'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setToolModal(false); setEditToolId(null); setToolForm(emptyTool); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Use Cases Section */}
      <div className="flex justify-between items-center mb-6 mt-12">
        <h2 className="text-2xl font-bold">AI Automation Use Cases</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddUseCase}>Add New</button>
      </div>
      {loadingUseCases ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {useCases && useCases.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col gap-2 border relative">
              <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-2" loading="lazy" />
              <div className="flex gap-2 mb-1">
                <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">{item.level}</span>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-900">{item.duration}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs mb-1">Watch</a>
              <div className="flex gap-2 mt-auto">
                <button className="text-blue-600 hover:underline" onClick={() => handleEditUseCase(item)}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDeleteUseCase(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Add/Edit Use Case */}
      {useCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px] max-w-md w-full" onSubmit={handleSubmitUseCase}>
            <h3 className="text-lg font-bold mb-4">{editUseCaseId ? 'Edit' : 'Add'} Use Case</h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Title</label>
              <input className="w-full border p-2 rounded" value={useCaseForm.title} onChange={e => setUseCaseForm({ ...useCaseForm, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Description</label>
              <textarea className="w-full border p-2 rounded" value={useCaseForm.description} onChange={e => setUseCaseForm({ ...useCaseForm, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Image URL</label>
              <input className="w-full border p-2 rounded" value={useCaseForm.image} onChange={e => setUseCaseForm({ ...useCaseForm, image: e.target.value })} required />
              {useCaseForm.image && <img src={useCaseForm.image} alt="Preview" className="w-full h-24 object-cover rounded mt-2" loading="lazy" />}
            </div>
            <div className="mb-3 flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Duration</label>
                <input className="w-full border p-2 rounded" value={useCaseForm.duration} onChange={e => setUseCaseForm({ ...useCaseForm, duration: e.target.value })} required />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Level</label>
                <input className="w-full border p-2 rounded" value={useCaseForm.level} onChange={e => setUseCaseForm({ ...useCaseForm, level: e.target.value })} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Link</label>
              <input className="w-full border p-2 rounded" value={useCaseForm.link} onChange={e => setUseCaseForm({ ...useCaseForm, link: e.target.value })} required />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editUseCaseId ? 'Update' : 'Create'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setUseCaseModal(false); setEditUseCaseId(null); setUseCaseForm(emptyUseCase); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Implementation Guides Section */}
      <div className="flex justify-between items-center mb-6 mt-12">
        <h2 className="text-2xl font-bold">AI Automation Implementation Guides</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddGuide}>Add New</button>
      </div>
      {loadingGuides ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides && guides.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col gap-2 border relative">
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">{item.description}</p>
              <a href={item.video_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs mb-1">Watch Video</a>
              <div className="flex gap-2 mt-auto">
                <button className="text-blue-600 hover:underline" onClick={() => handleEditGuide(item)}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDeleteGuide(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Add/Edit Guide */}
      {guideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px] max-w-md w-full" onSubmit={handleSubmitGuide}>
            <h3 className="text-lg font-bold mb-4">{editGuideId ? 'Edit' : 'Add'} Guide</h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Title</label>
              <input className="w-full border p-2 rounded" value={guideForm.title} onChange={e => setGuideForm({ ...guideForm, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Description</label>
              <textarea className="w-full border p-2 rounded" value={guideForm.description} onChange={e => setGuideForm({ ...guideForm, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Video Link</label>
              <input className="w-full border p-2 rounded" value={guideForm.video_link} onChange={e => setGuideForm({ ...guideForm, video_link: e.target.value })} required />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editGuideId ? 'Update' : 'Create'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setGuideModal(false); setEditGuideId(null); setGuideForm(emptyGuide); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAutomationAdmin; 