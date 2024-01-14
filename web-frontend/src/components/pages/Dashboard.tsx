import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { Token } from "src/types/cognito";
import { CourseEntry } from "src/types/course";
import CoursesWidget from "../CoursesWidget";
import DashboardLayout from "../DashboardLayout";
import TrackingTable from "../TrackingTable";
import { API_GATEWAY_ID } from "../../common/config";

type DashboardProps = {
  token: Token | null;
  rawToken: string | null;
};
export default function Dashboard({ token, rawToken }: DashboardProps) {
  const [courses, setCourses] = useState<CourseEntry[]>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<
    Record<string, CourseEntry>
  >({});
  const [loading, setLoading] = useState(false);

  const getCourses = useCallback(async () => {
    setLoading(true);
    if (!token || !rawToken) {
      return;
    }

    await fetch(
      `https://${API_GATEWAY_ID}.execute-api.us-west-2.amazonaws.com/v1/tracking?key=email&email=${token.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: rawToken,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, [token, rawToken]);

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  if (!token || !rawToken) {
    return <div>Not logged in.</div>;
  }

  return (
    <>
      {showAddCourse && (
        <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center">
          <CoursesWidget {...{ token, rawToken, setShowAddCourse }} />
          <div
            className="absolute left-0 top-0 -z-10 h-full w-full bg-primary/50"
            onClick={() => setShowAddCourse(false)}
          />
        </div>
      )}
      <DashboardLayout activeTab="dashboard">
        <div className="text-2xl font-bold">Tracked Courses</div>
        <div className="my-3 flex flex-row gap-2">
          <Button
            className="w-fit"
            onClick={() => {
              setShowAddCourse(true);
            }}
          >
            Add Course
          </Button>
          {Object.keys(selectedCourses).length > 0 && (
            <Button
              variant="destructive"
              className="w-fit"
              onClick={() => {
                console.log(selectedCourses);
              }}
            >
              Delete
            </Button>
          )}
        </div>
        <TrackingTable
          {...{ courses, loading, selectedCourses, setSelectedCourses }}
        />
      </DashboardLayout>
    </>
  );
}
