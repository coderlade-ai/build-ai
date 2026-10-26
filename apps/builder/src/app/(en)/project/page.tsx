import { Suspense } from "react";
import { Workspace } from "../../../components/Workspace";

export default function ProjectPage() {
  return (
    <Suspense>
      <Workspace locale="en" />
    </Suspense>
  );
}
