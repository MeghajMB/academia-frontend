import Section from "../ui/Section";
export default function HomePage() {
  return (
    <>
      <main className="pt-24 ml-10 mr-10">
        <section>
          <h2>Carousel</h2>
        </section>
        <Section label={"Top Rated Courses"} />
        <Section label={"Featured Instructors"} />
        <Section label={"New Courses"} />
      </main>
    </>
  );
}
