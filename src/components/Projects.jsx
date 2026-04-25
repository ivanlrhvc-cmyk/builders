import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">Proyectos</h2>
          <p className="section-sub">Lo que he construido</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
