import { useAiLearningPathCourses } from '../hooks/useAiLearningPathCourses';
import { YouTubeVideoPlayer } from './YouTubeVideoPlayer';
import { useTheme } from 'next-themes';

export function AiLearningPathCourses() {
  const { data: courses, isLoading, error } = useAiLearningPathCourses();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: any) => (
        <div key={course.id} className={`rounded-lg shadow p-6 ${
          theme === 'dark' ? 'bg-[#171717] text-white' : 'bg-white text-gray-900'
        }`}>
          <YouTubeVideoPlayer videoId={(function() {
            const id = course.link;
            if (id.includes('youtu.be/')) return id.split('youtu.be/')[1].split('?')[0];
            if (id.includes('youtube.com/watch?v=')) return id.split('watch?v=')[1].split('&')[0];
            return id;
          })()} title={course.title} />
          <h3 className="font-bold mt-2">{course.title}</h3>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
          }`}>{course.description}</p>
          <div className="flex gap-2 text-xs mt-1">
            {course.level && <span className={`px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>{course.level}</span>}
            {course.duration && <span className={
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }>{course.duration}</span>}
          </div>
        </div>
      ))}
    </div>
  );
} 