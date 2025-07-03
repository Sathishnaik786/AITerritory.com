import { useAiLearningPathCourses } from '../hooks/useAiLearningPathCourses';
import { YouTubeVideoPlayer } from './YouTubeVideoPlayer';

export function AiLearningPathCourses() {
  const { data: courses, isLoading, error } = useAiLearningPathCourses();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: any) => (
        <div key={course.id} className="rounded-lg shadow bg-white p-4">
          <YouTubeVideoPlayer videoId={course.link} title={course.title} />
          <h3 className="font-bold mt-2">{course.title}</h3>
          <p className="text-sm text-gray-500">{course.description}</p>
          <div className="flex gap-2 text-xs mt-1">
            {course.level && <span className="bg-blue-100 px-2 py-1 rounded">{course.level}</span>}
            {course.duration && <span>{course.duration}</span>}
          </div>
        </div>
      ))}
    </div>
  );
} 