import Projects from "@/components/projects";

const ProjectsPage = () => (
  <div>
    <section className="glass pad-lg rise">
      <p className="tt-mono inline-flex items-center gap-2">
        <span className="pin" /> Work
      </p>
      <h1 className="tt-h1 mt-5 max-w-2xl">
        Selected <span className="acc">projects.</span>
      </h1>
      <p className="tt-body mt-5 max-w-xl">
        A selection of work I&apos;ve built. There is more — these are the ones I can show publicly.
      </p>
    </section>

    <Projects showAll={true} />
  </div>
);

export default ProjectsPage;
