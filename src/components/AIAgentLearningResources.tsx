import { useAiAgentLearningResources } from '../hooks/useAiAgentLearningResources';
import { YouTubeThumbnail } from './YouTubeThumbnail';
import { useTheme } from 'next-themes';

export function AIAgentLearningResources({ learningPathId }: { learningPathId: string }) {
  const { data: resources, isLoading, error } = useAiAgentLearningResources(learningPathId);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading resources</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {resources.map((resource: any) => (
        <div key={resource.id} className={`rounded-lg shadow p-6 ${
          theme === 'dark' ? 'bg-[#171717] text-white' : 'bg-white text-gray-900'
        }`}>
          <YouTubeThumbnail videoId={(function() {
            const id = resource.link;
            if (id.includes('youtu.be/')) return id.split('youtu.be/')[1].split('?')[0];
            if (id.includes('youtube.com/watch?v=')) return id.split('watch?v=')[1].split('&')[0];
            return id;
          })()} title={resource.title} />
          <h3 className="font-bold mt-2">{resource.title}</h3>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
          }`}>{resource.description}</p>
          <div className="flex gap-2 text-xs mt-1">
            {resource.level && <span className={`px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>{resource.level}</span>}
            {resource.duration && <span className={
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }>{resource.duration}</span>}
          </div>
        </div>
      ))}
    </div>
  );
} 