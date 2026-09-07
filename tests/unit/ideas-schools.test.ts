import { describe, expect, it } from "vitest";

import { presentSchoolOptions } from "@/features/ideas/school-options";

describe("presentSchoolOptions", () => {
  it("labels persisted schools with city and never invents rows", () => {
    const presented = presentSchoolOptions([
      { id: "school-1", name: "Homestead High School", city: "Cupertino" },
      { id: "school-2", name: "De Anza College", city: null },
    ]);

    expect(presented).toEqual([
      {
        id: "school-1",
        name: "Homestead High School",
        city: "Cupertino",
        label: "Homestead High School (Cupertino)",
      },
      {
        id: "school-2",
        name: "De Anza College",
        city: "",
        label: "De Anza College",
      },
    ]);
  });
});
