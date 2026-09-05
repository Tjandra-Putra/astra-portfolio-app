import Experiences from "@/components/experiences";

const ExperiencesPage = () => (
  <div>
    <section className="glass pad-lg rise">
      <p className="tt-mono">Career</p>
      <h1 className="tt-h1 mt-4 max-w-2xl">
        Where I&apos;ve <span className="acc">worked.</span>
      </h1>
      <p className="tt-body mt-5 max-w-xl">The roles and engagements that shaped how I work.</p>
    </section>

    <Experiences showAll={true} />
  </div>
);

export default ExperiencesPage;
