import { BookText, Ear, Languages, NotebookPen } from 'lucide-react'

const modules = [
  { title: 'Grammar', lesson: 'Present Perfect', progress: '45%', icon: NotebookPen, color: 'text-indigo-500 bg-indigo-100' },
  { title: 'Listening', lesson: 'Short Conversations', progress: '30%', icon: Ear, color: 'text-teal-500 bg-teal-100' },
  { title: 'Reading', lesson: 'Matching Headings', progress: '60%', icon: BookText, color: 'text-yellow-600 bg-yellow-100' },
  { title: 'Vocabulary', lesson: 'Academic Words', progress: '70%', icon: Languages, color: 'text-pink-500 bg-pink-100' },
]

function LearningModules() {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Continue Learning</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map(({ title, lesson, progress, icon: Icon, color }) => (
          <article key={title} className="dashboard-card !p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{lesson}</p>
              </div>
              <div className={`grid h-9 w-9 place-items-center rounded-lg ${color}`}>
                <Icon size={17} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">{progress} completed</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LearningModules
