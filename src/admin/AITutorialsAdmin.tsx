import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'sonner';

// --- Service functions for Tutorials ---
const fetchTutorials = async () => (await api.get('/ai-tutorials')).data;
const createTutorial = async (data: any) => (await api.post('/ai-tutorials', data)).data;
const updateTutorial = async ({ id, ...data }: any) => (await api.put(`/ai-tutorials/${id}`, data)).data;
const deleteTutorial = async (id: string) => (await api.delete(`/ai-tutorials/${id}`)).data;

const emptyTutorial = { type: 'featured', title: '', description: '', image: '', duration: '', level: '', link: '' };

// --- Service functions for Learning Paths ---
const fetchPaths = async () => (await api.get('/ai-tutorials/paths/all')).data;
const createPath = async (data: any) => (await api.post('/ai-tutorials/paths', data)).data;
const updatePath = async ({ id, ...data }: any) => (await api.put(`/ai-tutorials/paths/${id}`, data)).data;
const deletePath = async (id: string) => (await api.delete(`/ai-tutorials/paths/${id}`)).data;

const emptyPath = { title: '', description: '', image: '' };

// --- Service functions for Courses ---
const fetchCourses = async (learning_path_id?: string) => {
  const url = learning_path_id ? `/ai-tutorials/courses/all?learning_path_id=${learning_path_id}` : '/ai-tutorials/courses/all';
  return (await api.get(url)).data;
};
const createCourse = async (data: any) => (await api.post('/ai-tutorials/courses', data)).data;
const updateCourse = async ({ id, ...data }: any) => (await api.put(`/ai-tutorials/courses/${id}`, data)).data;
const deleteCourse = async (id: string) => (await api.delete(`/ai-tutorials/courses/${id}`)).data;

const emptyCourse = { learning_path_id: '', title: '', description: '', image: '', duration: '', level: '', link: '' };

const AITutorialsAdmin = () => {
  const queryClient = useQueryClient();
  // Tutorials
  const { data: tutorials, isLoading: loadingTutorials } = useQuery({
    queryKey: ['ai-tutorials'],
    queryFn: fetchTutorials,
  });
  const createTutorialMutation = useMutation({
    mutationFn: createTutorial,
    onSuccess: () => { setTutorialModal(false); setTutorialForm(emptyTutorial); setEditTutorialId(null); queryClient.invalidateQueries({ queryKey: ['ai-tutorials'] }); }
  });
  const updateTutorialMutation = useMutation({
    mutationFn: updateTutorial,
    onSuccess: () => { setTutorialModal(false); setTutorialForm(emptyTutorial); setEditTutorialId(null); queryClient.invalidateQueries({ queryKey: ['ai-tutorials'] }); }
  });
  const deleteTutorialMutation = useMutation({
    mutationFn: deleteTutorial,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-tutorials'] }); }
  });

  // Learning Paths
  const { data: paths, isLoading: loadingPaths } = useQuery({
    queryKey: ['ai-learning-paths'],
    queryFn: fetchPaths,
  });
  const createPathMutation = useMutation({
    mutationFn: createPath,
    onSuccess: () => { setPathModal(false); setPathForm(emptyPath); setEditPathId(null); queryClient.invalidateQueries({ queryKey: ['ai-learning-paths'] }); }
  });
  const updatePathMutation = useMutation({
    mutationFn: updatePath,
    onSuccess: () => { setPathModal(false); setPathForm(emptyPath); setEditPathId(null); queryClient.invalidateQueries({ queryKey: ['ai-learning-paths'] }); }
  });
  const deletePathMutation = useMutation({
    mutationFn: deletePath,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-learning-paths'] }); }
  });

  // Courses (per path)
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const { data: courses, isLoading: loadingCourses } = useQuery({
    queryKey: ['ai-learning-path-courses', selectedPathId],
    queryFn: () => fetchCourses(selectedPathId || ''),
    enabled: !!selectedPathId,
  });
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => { setCourseModal(false); setCourseForm(emptyCourse); setEditCourseId(null); queryClient.invalidateQueries({ queryKey: ['ai-learning-path-courses', selectedPathId] }); }
  });
  const updateCourseMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => { setCourseModal(false); setCourseForm(emptyCourse); setEditCourseId(null); queryClient.invalidateQueries({ queryKey: ['ai-learning-path-courses', selectedPathId] }); }
  });
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ai-learning-path-courses', selectedPathId] }); }
  });

  // Modal state
  const [tutorialModal, setTutorialModal] = useState(false);
  const [editTutorialId, setEditTutorialId] = useState<string | null>(null);
  const [tutorialForm, setTutorialForm] = useState<any>(emptyTutorial);

  const [pathModal, setPathModal] = useState(false);
  const [editPathId, setEditPathId] = useState<string | null>(null);
  const [pathForm, setPathForm] = useState<any>(emptyPath);

  const [courseModal, setCourseModal] = useState(false);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState<any>(emptyCourse);

  // Handlers for Tutorials
  const handleEditTutorial = (item: any) => { setEditTutorialId(item.id); setTutorialForm(item); setTutorialModal(true); };
  const handleAddTutorial = () => { setEditTutorialId(null); setTutorialForm(emptyTutorial); setTutorialModal(true); };
  const handleDeleteTutorial = (id: string) => {
    if (window.confirm('Delete this tutorial?')) deleteTutorialMutation.mutate(id, {
      onSuccess: () => toast.success('Tutorial deleted!'),
      onError: () => toast.error('Failed to delete tutorial'),
    });
  };
  const handleSubmitTutorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTutorialId) updateTutorialMutation.mutate({ id: editTutorialId, ...tutorialForm }, {
      onSuccess: () => toast.success('Tutorial updated!'),
      onError: () => toast.error('Failed to update tutorial'),
    });
    else createTutorialMutation.mutate(tutorialForm, {
      onSuccess: () => toast.success('Tutorial created!'),
      onError: () => toast.error('Failed to create tutorial'),
    });
  };

  // Handlers for Paths
  const handleEditPath = (item: any) => { setEditPathId(item.id); setPathForm(item); setPathModal(true); };
  const handleAddPath = () => { setEditPathId(null); setPathForm(emptyPath); setPathModal(true); };
  const handleDeletePath = (id: string) => { if (window.confirm('Delete this learning path?')) deletePathMutation.mutate(id); };
  const handleSubmitPath = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPathId) updatePathMutation.mutate({ id: editPathId, ...pathForm });
    else createPathMutation.mutate(pathForm);
  };

  // Handlers for Courses
  const handleEditCourse = (item: any) => { setEditCourseId(item.id); setCourseForm(item); setCourseModal(true); };
  const handleAddCourse = (learning_path_id: string) => { setEditCourseId(null); setCourseForm({ ...emptyCourse, learning_path_id }); setCourseModal(true); };
  const handleDeleteCourse = (id: string) => { if (window.confirm('Delete this course?')) deleteCourseMutation.mutate(id); };
  const handleSubmitCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCourseId) updateCourseMutation.mutate({ id: editCourseId, ...courseForm });
    else createCourseMutation.mutate(courseForm);
  };

  return (
    <div>
      {/* Tutorials Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Tutorials</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddTutorial}>Add New</button>
      </div>
      {loadingTutorials ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tutorials && tutorials.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col gap-2 border relative">
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded mb-2" loading="lazy" />
              <div className="flex gap-2 mb-1">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.type === 'featured' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{item.type}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.level === 'Beginner' ? 'bg-yellow-100 text-yellow-800' : item.level === 'Intermediate' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}>{item.level}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{item.duration}</span>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch</a>
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="text-blue-600 hover:underline" onClick={() => handleEditTutorial(item)}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDeleteTutorial(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Add/Edit Tutorial */}
      {tutorialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px] max-w-md w-full" onSubmit={handleSubmitTutorial}>
            <h3 className="text-lg font-bold mb-4">{editTutorialId ? 'Edit' : 'Add'} AI Tutorial</h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Type</label>
              <select className="w-full border p-2 rounded" value={tutorialForm.type} onChange={e => setTutorialForm({ ...tutorialForm, type: e.target.value })} required>
                <option value="featured">Featured</option>
                <option value="latest">Latest</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Title</label>
              <input className="w-full border p-2 rounded" value={tutorialForm.title} onChange={e => setTutorialForm({ ...tutorialForm, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Description</label>
              <textarea className="w-full border p-2 rounded" value={tutorialForm.description} onChange={e => setTutorialForm({ ...tutorialForm, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Image URL</label>
              <input className="w-full border p-2 rounded" value={tutorialForm.image} onChange={e => setTutorialForm({ ...tutorialForm, image: e.target.value })} required />
              {tutorialForm.image && <img src={tutorialForm.image} alt="Preview" className="w-full h-32 object-cover rounded mt-2" loading="lazy" />}
            </div>
            <div className="mb-3 flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Duration</label>
                <input className="w-full border p-2 rounded" value={tutorialForm.duration} onChange={e => setTutorialForm({ ...tutorialForm, duration: e.target.value })} required />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Level</label>
                <input className="w-full border p-2 rounded" value={tutorialForm.level} onChange={e => setTutorialForm({ ...tutorialForm, level: e.target.value })} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Link</label>
              <input className="w-full border p-2 rounded" value={tutorialForm.link} onChange={e => setTutorialForm({ ...tutorialForm, link: e.target.value })} required />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editTutorialId ? 'Update' : 'Create'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setTutorialModal(false); setEditTutorialId(null); setTutorialForm(emptyTutorial); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Learning Paths Section */}
      <div className="flex justify-between items-center mb-6 mt-12">
        <h2 className="text-2xl font-bold">AI Learning Paths</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddPath}>Add New</button>
      </div>
      {loadingPaths ? <div>Loading...</div> : (
        <table className="min-w-full border mb-12">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paths && paths.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="p-2 border cursor-pointer text-blue-600 underline" onClick={() => setSelectedPathId(item.id)}>{item.title}</td>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border"><img src={item.image} alt={item.title} className="w-12 h-12 object-cover" loading="lazy" /></td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEditPath(item)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDeletePath(item.id)}>Delete</button>
                  <button className="ml-2 bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleAddCourse(item.id)}>Add Course</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal for Add/Edit Path */}
      {pathModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px]" onSubmit={handleSubmitPath}>
            <h3 className="text-lg font-bold mb-4">{editPathId ? 'Edit' : 'Add'} Learning Path</h3>
            <div className="mb-3">
              <label className="block mb-1">Title</label>
              <input className="w-full border p-2 rounded" value={pathForm.title} onChange={e => setPathForm({ ...pathForm, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Description</label>
              <textarea className="w-full border p-2 rounded" value={pathForm.description} onChange={e => setPathForm({ ...pathForm, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Image URL</label>
              <input className="w-full border p-2 rounded" value={pathForm.image} onChange={e => setPathForm({ ...pathForm, image: e.target.value })} required />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editPathId ? 'Update' : 'Create'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setPathModal(false); setEditPathId(null); setPathForm(emptyPath); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Section (for selected path) */}
      {selectedPathId && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Courses for Selected Path</h3>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setSelectedPathId(null)}>Close</button>
          </div>
          {loadingCourses ? <div>Loading...</div> : (
            <table className="min-w-full border mb-12">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Duration</th>
                  <th className="p-2 border">Level</th>
                  <th className="p-2 border">Link</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses && courses.map((item: any) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2 border">{item.title}</td>
                    <td className="p-2 border">{item.description}</td>
                    <td className="p-2 border"><img src={item.image} alt={item.title} className="w-12 h-12 object-cover" loading="lazy" /></td>
                    <td className="p-2 border">{item.duration}</td>
                    <td className="p-2 border">{item.level}</td>
                    <td className="p-2 border"><a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Link</a></td>
                    <td className="p-2 border">
                      <button className="text-blue-600 mr-2" onClick={() => handleEditCourse(item)}>Edit</button>
                      <button className="text-red-600" onClick={() => handleDeleteCourse(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Modal for Add/Edit Course */}
          {courseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <form className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg min-w-[350px]" onSubmit={handleSubmitCourse}>
                <h3 className="text-lg font-bold mb-4">{editCourseId ? 'Edit' : 'Add'} Course</h3>
                <div className="mb-3">
                  <label className="block mb-1">Title</label>
                  <input className="w-full border p-2 rounded" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Description</label>
                  <textarea className="w-full border p-2 rounded" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Image URL</label>
                  <input className="w-full border p-2 rounded" value={courseForm.image} onChange={e => setCourseForm({ ...courseForm, image: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Duration</label>
                  <input className="w-full border p-2 rounded" value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Level</label>
                  <input className="w-full border p-2 rounded" value={courseForm.level} onChange={e => setCourseForm({ ...courseForm, level: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Link</label>
                  <input className="w-full border p-2 rounded" value={courseForm.link} onChange={e => setCourseForm({ ...courseForm, link: e.target.value })} required />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editCourseId ? 'Update' : 'Create'}</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setCourseModal(false); setEditCourseId(null); setCourseForm(emptyCourse); }}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AITutorialsAdmin; 