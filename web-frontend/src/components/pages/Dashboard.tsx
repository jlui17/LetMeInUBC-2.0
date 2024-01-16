import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { Token } from "src/types/cognito";
import { CourseEntry, CourseForm } from "src/types/course";
import CoursesWidget from "../CoursesWidget";
import AppLayout from "../AppLayout";
import TrackingTable from "../TrackingTable";
import { API_GATEWAY_ID, LOGIN_URL } from "../../common/config";
import { LoadingSpinner } from "../LoadingSpinner";

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
  const [loadingDelete, setLoadingDelete] = useState(false);

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
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        window.location.href = LOGIN_URL;
      });
  }, [token, rawToken]);

  const addCourse = async (data: CourseForm) => {
    if (!token || !rawToken) return Promise.resolve(); // should never happen

    const response = await fetch(
      `https://${API_GATEWAY_ID}.execute-api.us-west-2.amazonaws.com/v1/tracking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: rawToken,
        },
        body: JSON.stringify({
          session: data.session.toUpperCase(),
          department: data.department.toUpperCase(),
          number: data.number.toUpperCase(),
          section: data.section.toUpperCase(),
          email: token.email,
          restricted: data.restricted ? "true" : "false",
        }),
      },
    );
    if (response.status === 404) {
      alert("Invalid Course Specified");
    } else if (response.status === 201) {
      setShowAddCourse && setShowAddCourse(false);
      getCourses();
    }
  };

  const deleteCourses = async (
    selectedCourses: Record<string, CourseEntry>,
  ) => {
    if (!token || !rawToken) return Promise.resolve(); // should never happen
    setLoadingDelete(true);

    const newState = { ...selectedCourses };
    for (const [id, course] of Object.entries(selectedCourses)) {
      await fetch(
        `https://${API_GATEWAY_ID}.execute-api.us-west-2.amazonaws.com/v1/tracking`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: rawToken,
          },
          body: JSON.stringify({
            session: course.session.S,
            department: course.department.S,
            number: course.number.S,
            section: course.section.S,
            email: token.email,
          }),
        },
      ).then(() => {
        console.log("deleted course", course);
        delete newState[id];
      });
    }

    setSelectedCourses(newState);
    setLoadingDelete(false);
    getCourses();
  };

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  if (!token || !rawToken) {
    return <div>Not logged in.</div>;
  }

  return (
    <div className="w-full">
      {showAddCourse && (
        <div className="absolute left-0 top-0 z-10 flex h-screen w-screen items-center justify-center">
          <CoursesWidget {...{ addCourse, setShowAddCourse }} />
          <div
            className="absolute left-0 top-0 -z-10 h-full w-full bg-primary/50"
            onClick={() => setShowAddCourse(false)}
          />
        </div>
      )}
      <AppLayout activeTab="dashboard" rawToken={rawToken}>
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
              onClick={() => deleteCourses(selectedCourses)}
            >
              {loadingDelete ? <LoadingSpinner /> : "Delete"}
            </Button>
          )}
        </div>
        <TrackingTable
          {...{ courses, loading, selectedCourses, setSelectedCourses }}
        />
      </AppLayout>
    </div>
  );
}
