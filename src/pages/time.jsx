import React from "react";
import { Link, useLocation } from "react-router-dom"






// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const location = useLocation()
  const serializedSemestersSubjects = location.state?.serializedSemestersSubjects; // Ensure it's being accessed safely
  console.log(serializedSemestersSubjects)
  

  function countSubjectOccurrences(schedule, subject) {
    return schedule.filter((s) => s && s.name === subject.name).length;
  }

  // Global tracker: one object per day to count teacher assignments.
  const globalTeacherAssignments = Array.from({ length: 6 }, () => ({}));

  // Checks if assigning this subject on a day would exceed the maximum (4 periods).
  // Lab subjects count as 2 periods; regular subjects as 1.
  function canAssignTeacher(day, subject) {
    const currentCount = globalTeacherAssignments[day][subject.teacher] || 0;
    const assignmentCount = subject.isLab ? 2 : 1;
    return currentCount + assignmentCount <= 4;
  }

  // Update the global count for the teacher.
  function updateTeacherAssignments(day, subject) {
    const assignmentCount = subject.isLab ? 2 : 1;
    globalTeacherAssignments[day][subject.teacher] =
      (globalTeacherAssignments[day][subject.teacher] || 0) + assignmentCount;
  }

  function generateSchedule(semester, globalTeacherConflict) {
    // Create a 6-day schedule with 5 periods each.
    const schedule = Array.from({ length: 6 }, () => Array(5).fill(null));
    let subjectsPool = semester.flatMap((subject) =>
      Array(subject.repeat).fill(subject)
    );
    subjectsPool = shuffleArray(subjectsPool);

    for (let day = 0; day < 6; day++) {
      for (let period = 0; period < 5; period++) {
        if (schedule[day][period] !== null) continue;

        let assigned = false;
        subjectsPool.sort((a, b) => {
          const countA = countSubjectOccurrences(schedule[day], a);
          const countB = countSubjectOccurrences(schedule[day], b);
          return countA - countB;
        });

        for (let i = 0; i < subjectsPool.length; i++) {
          const subject = subjectsPool[i];

          // Ensure no duplicate subject in the same day.
          if (countSubjectOccurrences(schedule[day], subject) >= 1) {
            continue;
          }

          // Check global teacher assignments for the day.
          if (!canAssignTeacher(day, subject)) {
            continue;
          }
          if (subject.isEtc && (period === 0 || period === 1)) {
            continue;
          }
          

          if (subject.isLab) {
            // Only one lab allowed per day.
            const labScheduled = schedule[day].some((s) => s && s.isLab);
            if (labScheduled) {
              continue;
            }
            if (
              period < 4 &&
              schedule[day][period + 1] === null &&
              !globalTeacherConflict[day][period]?.[subject.teacher] &&
              !globalTeacherConflict[day][period + 1]?.[subject.teacher]
            ) {
              // Assign lab subject to two consecutive periods.
              schedule[day][period] = subject;
              schedule[day][period + 1] = subject;

              if (!globalTeacherConflict[day][period]) {
                globalTeacherConflict[day][period] = {};
              }
              if (!globalTeacherConflict[day][period + 1]) {
                globalTeacherConflict[day][period + 1] = {};
              }
              globalTeacherConflict[day][period][subject.teacher] = true;
              globalTeacherConflict[day][period + 1][subject.teacher] = true;

              updateTeacherAssignments(day, subject);
              subjectsPool.splice(i, 1);
              assigned = true;
              break;
            }
          } else {
            if (!globalTeacherConflict[day][period]?.[subject.teacher]) {
              schedule[day][period] = subject;
              if (!globalTeacherConflict[day][period]) {
                globalTeacherConflict[day][period] = {};
              }
              globalTeacherConflict[day][period][subject.teacher] = true;

              updateTeacherAssignments(day, subject);
              subjectsPool = subjectsPool.filter((_, index) => index !== i);
              assigned = true;
              break;
            }
          }
        }

        // If no subject was assigned, reinitialize the pool and try again.
        if (!assigned ) {
          subjectsPool = semester.flatMap((subject) =>
            Array(subject.repeat).fill(subject)
          );
          subjectsPool = shuffleArray(subjectsPool);
          period--;
         
        }
      }
    }

    return schedule;
  }

  // Global teacher conflict tracker: one object per day with period objects.
  const globalTeacherConflict = Array.from({ length: 6 }, () => ({}));

  // Generate a schedule for each semester.
  const semesterSchedules = serializedSemestersSubjects.map((semester) =>
    Array.isArray(semester) && semester.length > 0 ? generateSchedule(semester, globalTeacherConflict) : []
  );

  return (
    <div className="p-4">
      {semesterSchedules.map((schedule, semesterIndex) => (
        <div key={semesterIndex} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Semester {semesterIndex + 1}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map((daySchedule, dayIndex) => (
              <div key={dayIndex} className="bg-white shadow rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {days[dayIndex]}
                </h3>
                <ul className="space-y-2">
                  {daySchedule.map((subject, periodIndex) => (
                    <li
                      key={periodIndex}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium">
                        Period {periodIndex + 1}:
                      </span>
                      <span className="text-gray-600">
                        {subject ? (
                          <>
                            {subject.name} - {subject.teacher}
                            {subject.isLab && " (Lab)"}
                          </>
                        ) : (
                          "Free"
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
