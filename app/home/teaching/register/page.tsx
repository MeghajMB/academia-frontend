import PersistLogin from "@/components/PersistLogin";
import InstructorRegister from "./InstructorRegister";

export default function Page() {
  return (
    <PersistLogin>
      <InstructorRegister />
    </PersistLogin>
  );
}
