import { useAiAgentLearningResources } from '../hooks/useAiAgentLearningResources';
import { YouTubeVideoPlayer } from './YouTubeVideoPlayer';

export function AIAgentLearningResources({ learningPathId }: { learningPathId: string }) {
  const { data: resources, isLoading, error } = useAiAgentLearningResources(learningPathId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading resources</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {resources.map((resource: any) => (
        <div key={resource.id} className="rounded-lg shadow bg-white p-4">
          <YouTubeVideoPlayer videoId={resource.link} title={resource.title} />
          <h3 className="font-bold mt-2">{resource.title}</h3>
          <p className="text-sm text-gray-500">{resource.description}</p>
          <div className="flex gap-2 text-xs mt-1">
            {resource.level && <span className="bg-blue-100 px-2 py-1 rounded">{resource.level}</span>}
            {resource.duration && <span>{resource.duration}</span>}
          </div>
        </div>
      ))}
    </div>
  );
} 