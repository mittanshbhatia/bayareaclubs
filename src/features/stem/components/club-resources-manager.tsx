"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  archiveLearningCollection,
  recommendCourseToClub,
  removeClubRecommendation,
  saveLearningCollection,
} from "@/features/stem/actions";
import {
  STEM_DISCIPLINE_LABELS,
  STEM_DISCIPLINES,
} from "@/lib/validation/stem";

type CourseOption = {
  id: string;
  title: string;
  provider_name: string | null;
  discipline: (typeof STEM_DISCIPLINES)[number] | string | null;
};

export function ClubResourcesManager({
  clubId,
  clubName,
  courses,
  recommendations,
  collections,
}: {
  clubId: string;
  clubName: string;
  courses: CourseOption[];
  recommendations: {
    id: string;
    note: string | null;
    course: CourseOption | null;
  }[];
  collections: {
    id: string;
    title: string;
    description: string | null;
    items: { course: CourseOption | null }[];
  }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [title, setTitle] = useState(`${clubName} — Fall Learning Track`);
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <section className="space-y-3 rounded-lg border border-border bg-surface p-5 shadow-xs">
        <h3 className="font-display text-lg font-semibold">Recommend a resource</h3>
        <p className="text-sm text-muted-foreground">
          Members will see “Recommended by {clubName}”. Recommendations never
          auto-enroll anyone.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="recommend-course">Course</Label>
            <select
              id="recommend-course"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recommend-note">Note (optional)</Label>
            <Input
              id="recommend-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
            />
          </div>
        </div>
        <Button
          disabled={pending || !courseId}
          onClick={() => {
            startTransition(async () => {
              const result = await recommendCourseToClub({
                clubId,
                courseId,
                note,
              });
              setMessage(result.ok ? "Recommendation saved." : result.error.message);
              router.refresh();
            });
          }}
        >
          Recommend to club
        </Button>
      </section>

      <section className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Current recommendations</h3>
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recommendations yet.</p>
        ) : (
          <ul className="space-y-2">
            {recommendations.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium">{item.course?.title ?? "Course"}</p>
                  <p className="text-sm text-muted-foreground">
                    Recommended by {clubName}
                    {item.note ? ` · ${item.note}` : ""}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      await removeClubRecommendation({
                        clubId,
                        recommendationId: item.id,
                      });
                      router.refresh();
                    });
                  }}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-surface p-5 shadow-xs">
        <h3 className="font-display text-lg font-semibold">Learning collection</h3>
        <p className="text-sm text-muted-foreground">
          Build an optional track like “{clubName} — Fall Learning Track”. Members
          choose whether to enroll.
        </p>
        <div className="space-y-2">
          <Label htmlFor="collection-title">Title</Label>
          <Input
            id="collection-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="collection-description">Description</Label>
          <Input
            id="collection-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Courses in this track</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {courses.map((course) => {
              const checked = selected.includes(course.id);
              return (
                <label
                  key={course.id}
                  className="flex items-start gap-2 rounded-md border border-border p-3 text-sm"
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={checked}
                    onChange={() => {
                      setSelected((current) =>
                        checked
                          ? current.filter((id) => id !== course.id)
                          : [...current, course.id],
                      );
                    }}
                  />
                  <span>
                    <span className="font-medium">{course.title}</span>
                    <span className="block text-muted-foreground">
                      {course.provider_name}
                      {course.discipline
                        ? ` · ${
                            STEM_DISCIPLINE_LABELS[
                              course.discipline as (typeof STEM_DISCIPLINES)[number]
                            ] ?? course.discipline
                          }`
                        : ""}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <Button
          disabled={pending || !title.trim()}
          onClick={() => {
            startTransition(async () => {
              const result = await saveLearningCollection({
                clubId,
                title,
                description,
                courseIds: selected,
              });
              setMessage(
                result.ok ? "Learning collection saved." : result.error.message,
              );
              if (result.ok) {
                setSelected([]);
              }
              router.refresh();
            });
          }}
        >
          Save collection
        </Button>
      </section>

      <section className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Club collections</h3>
        {collections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No collections yet.</p>
        ) : (
          <ul className="space-y-3">
            {collections.map((collection) => (
              <li
                key={collection.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{collection.title}</p>
                    {collection.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {collection.description}
                      </p>
                    ) : null}
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                      {collection.items.map((item, index) => (
                        <li key={`${collection.id}-${index}`}>
                          {item.course?.title ?? "Course"}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        await archiveLearningCollection({
                          clubId,
                          collectionId: collection.id,
                        });
                        router.refresh();
                      });
                    }}
                  >
                    Archive
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
