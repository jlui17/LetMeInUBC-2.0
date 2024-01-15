import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseEntry } from "src/types/course";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "./LoadingSpinner";

type TrackingTableProps = {
  courses: CourseEntry[];
  loading: boolean;
  selectedCourses: Record<string, CourseEntry>;
  setSelectedCourses?: (selectedCourses: Record<string, CourseEntry>) => void;
};
export default function TrackingTable({
  courses,
  loading,
  selectedCourses,
  setSelectedCourses,
}: TrackingTableProps) {
  const handleSelectCourse = (
    course: CourseEntry,
    checked: string | boolean,
  ) => {
    if (!checked) {
      const newSelectedCourses = { ...selectedCourses };
      delete newSelectedCourses[course.name.S];
      setSelectedCourses && setSelectedCourses(newSelectedCourses);
    } else {
      setSelectedCourses &&
        setSelectedCourses({
          ...selectedCourses,
          [course.name.S]: course,
        });
    }
  };

  return (
    <Table>
      <TableCaption>The list of courses you are tracking</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Session</TableHead>
          <TableHead>Include Restricted Seats</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading && (
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex gap-2">
                <LoadingSpinner />
                Loading...
              </div>
            </TableCell>
          </TableRow>
        )}

        {!loading &&
          courses.map((course: CourseEntry) => (
            <TableRow key={course.name.S} className="h-12">
              <TableCell className="w-9">
                <Checkbox
                  checked={!!selectedCourses[course.name.S]}
                  onCheckedChange={(checked) =>
                    handleSelectCourse(course, checked)
                  }
                  className="h-5 w-5"
                />
              </TableCell>
              <TableCell>{course.department.S}</TableCell>
              <TableCell>{course.number.S}</TableCell>
              <TableCell>{course.section.S}</TableCell>
              <TableCell>{course.session.S}</TableCell>
              <TableCell>
                {course.restricted.S === "true" ? "Yes" : "No"}
              </TableCell>
              <TableCell>{course.description.S}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
