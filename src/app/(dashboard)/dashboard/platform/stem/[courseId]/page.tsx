import { redirect } from "next/navigation";

export default async function PlatformStemCourseRedirect({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  redirect(`/admin/resources/${courseId}`);
}
