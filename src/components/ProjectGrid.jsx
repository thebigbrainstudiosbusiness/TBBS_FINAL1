import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { safeImageUrl } from '../sanityClient';

// --------------------
// Project Grid (separate, memoized, no blink)
// --------------------
const ProjectGrid = React.memo(function ProjectGrid({
  visibleProjects,
  onProjectClick,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
      {visibleProjects.map((project, idx) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.45,
            delay: idx * 0.05,
            ease: "easeOut",
          }}
          className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-black/80 overflow-hidden backdrop-blur cursor-pointer transition-all duration-300 hover:border-red-500/50"
          onClick={() => onProjectClick(project)}
        >
          <div className="relative h-56 overflow-hidden">
            {(() => {
              const imgSrc = safeImageUrl(project.image, { width: 1600 });
              return imgSrc && (
                <img
                  src={imgSrc}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              );
            })()}
            <div className={`absolute inset-0 bg-gradient-to-t ${project.accent}`} />
            <div className="absolute top-4 left-4 px-3 py-1 text-xs uppercase tracking-[0.4em] bg-black/50 rounded-full">
              {project.tag}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black">{project.title}</h3>
              <span className="text-sm text-gray-400">{project.duration}</span>
            </div>

            <p className="text-gray-300 line-clamp-2">{project.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Shots: {project.shots}</span>
              <span>Passes: {2 + (idx % 3)}</span>
            </div>

            <div className="flex gap-3">
              {project.images?.slice(0, 3).map((img, imgIdx) => {
                const src = safeImageUrl(img, { width: 500 });
                return src && (
                  <img
                    key={`${project._id}-${imgIdx}`}
                    src={src}
                    alt={`${project.title} frame ${imgIdx + 1}`}
                    className="h-14 w-16 object-cover rounded-xl border border-white/10"
                  />
                );
              })}
            </div>

            <button className="w-full mt-2 px-4 py-3 border border-white/20 rounded-full text-sm font-semibold transition hover:bg-white/10">
              Open case study →
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

export default ProjectGrid;
