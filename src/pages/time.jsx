import React from "react";
import "./css/time.css";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const semestersSubjects = [
  [
    { name: "Project Lab", teacher: "Teacher1", repeat: 1, isLab: true },
    { name: "ML Lab", teacher: "Teacher6", repeat: 1, isLab: true },
    { name: "Sports", teacher: "Teacher2", repeat: 3, isEtc: true },
    { name: "Mob", teacher: "Teacher3", repeat: 4 },
    { name: "Industrial Specialization", teacher: "Teacher4", repeat: 4 },
    { name: "ST", teacher: "Teacher5", repeat: 4 },
    { name: "EC", teacher: "Teacher7", repeat: 4 },
    { name: "ML", teacher: "Teacher8", repeat: 4 },
    { name: "Library", teacher: "Teacher9", repeat: 3, isEtc: true }
  ],
  [
    { name: "Project Lab", teacher: "Teacher2", repeat: 1, isLab: true },
    { name: "ML Lab", teacher: "Teacher6", repeat: 1, isLab: true },
    { name: "Sports", teacher: "Teacher25", repeat: 3, isEtc: true },
    { name: "Mob", teacher: "Teacher3", repeat: 4 },
    { name: "Industrial Specialization", teacher: "Teacher4", repeat: 4 },
    { name: "ST", teacher: "Teacher5", repeat: 4 },
    { name: "EC", teacher: "Teacher7", repeat: 4 },
    { name: "ML", teacher: "Teacher8", repeat: 4 },
    { name: "Library", teacher: "Teacher99", repeat: 3, isEtc: true }
  ],
  [
    { name: "Project Lab", teacher: "Teacher11", repeat: 1, isLab: true },
    { name: "ML Lab", teacher: "Teacher16", repeat: 1, isLab: true },
    { name: "Sports", teacher: "Teacher124", repeat: 3, isEtc: true },
    { name: "Mob", teacher: "Teacher13", repeat: 4 },
    { name: "Industrial Specialization", teacher: "Teacher14", repeat: 4 },
    { name: "ST", teacher: "Teacher15", repeat: 4 },
    { name: "EC", teacher: "Teacher17", repeat: 4 },
    { name: "ML", teacher: "Teacher18", repeat: 4 },
    { name: "Library", teacher: "Teacher192", repeat: 3, isEtc: true }
  ],
  [
    { name: "Project Lab", teacher: "Teacher11", repeat: 1, isLab: true },
    { name: "ML Lab", teacher: "Teacher16", repeat: 1, isLab: true },
    { name: "Sports", teacher: "Teacher1285", repeat: 3, isEtc: true },
    { name: "Mob", teacher: "Teacher13", repeat: 4 },
    { name: "Industrial Specialization", teacher: "Teacher14", repeat: 4 },
    { name: "ST", teacher: "Teacher15", repeat: 4 },
    { name: "EC", teacher: "Teacher17", repeat: 4 },
    { name: "ML", teacher: "Teacher18", repeat: 4 },
    { name: "Library", teacher: "Teacher192", repeat: 3, isEtc: true }
  ],
  [
    { name: "Project Lab", teacher: "Teacher2123", repeat: 1, isLab: true },
    { name: "ML Lab", teacher: "Teacher26", repeat: 1, isLab: true },
    { name: "Sports", teacher: "Teacher22", repeat: 3, isEtc: true },
    { name: "Mob", teacher: "Teacher23", repeat: 4 },
    { name: "Industrial Specialization", teacher: "Teacher24", repeat: 4 },
    { name: "ST", teacher: "Teacher25", repeat: 4 },
    { name: "EC", teacher: "Teacher27", repeat: 4 },
    { name: "ML", teacher: "Teacher28", repeat: 4 },
    { name: "Library", teacher: "Teacher2945", repeat: 3, isEtc: true }
  ],
  [
    { name: "Project Lab", teacher: "Teacher21", repeat: 1, isLab: true },
    { name: "ML Lab", teacher: "Teacher26", repeat: 1, isLab: true },
    { name: "Sports", teacher: "Teacher2245", repeat: 3, isEtc: true },
    { name: "Mob", teacher: "Teacher23", repeat: 4 },
    { name: "Industrial Specialization", teacher: "Teacher24", repeat: 4 },
    { name: "ST", teacher: "Teacher25", repeat: 4 },
    { name: "EC", teacher: "Teacher27", repeat: 4 },
    { name: "ML", teacher: "Teacher28", repeat: 4 },
    { name: "Library", teacher: "Teacher2965", repeat: 3, isEtc: true }
  ]
];


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
    "Saturday"
  ];


  function generateWordDocument(semesterSchedules) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Document title
            new Paragraph({
              text: "College Timetable",
              heading: "Title",
              alignment: "center",
              spacing: { after: 200 },
            }),
            // Semester tables
            ...semesterSchedules.flatMap((schedule, semesterIndex) => [
              new Paragraph({
                text: `Semester ${semesterIndex + 1}`,
                heading: "Heading1",
                alignment: "left",
                spacing: { before: 400, after: 200 },
              }),
              createSemesterTable(schedule, days),
            ]),
          ],
        },
      ],
    });
  
    // Generate the document and prompt download
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "timetable.docx");
    });
  }
  
  function createSemesterTable(schedule, days) {
    const table = new Table({
      columnWidths: [1008, 1669, 1669, 1669, 1669, 1669], // Approx. 0.7 inch for days, 1.16 inch for periods
      borders: {
        top: { style: "single", size: 1, color: "000000" },
        bottom: { style: "single", size: 1, color: "000000" },
        left: { style: "single", size: 1, color: "000000" },
        right: { style: "single", size: 1, color: "000000" },
        insideHorizontal: { style: "single", size: 1, color: "000000" },
        insideVertical: { style: "single", size: 1, color: "000000" },
      },
      rows: [
        // Header row
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: "", alignment: "center" })],
              shading: { fill: "F2F2F2" },
            }),
            ...Array.from({ length: 5 }, (_, i) => new TableCell({
              children: [new Paragraph({ text: `Period ${i + 1}`, alignment: "center" })],
              shading: { fill: "F2F2F2" },
            })),
          ],
        }),
        // Day rows
        ...schedule.map((daySchedule, dayIndex) => {
          const dayName = days[dayIndex];
          const cells = [
            new TableCell({
              children: [new Paragraph({ text: dayName, alignment: "center" })],
              shading: { fill: "F2F2F2" },
            }),
          ];
          let period = 0;
          while (period < 5) {
            const subject = daySchedule[period];
            if (subject && subject.isLab && period < 4 && daySchedule[period] === daySchedule[period + 1]) {
              // Lab spanning two periods
              const labText = `${subject.name} - ${subject.teacher} (Lab)`;
              cells.push(new TableCell({
                children: [new Paragraph({ text: labText, alignment: "center" })],
                columnSpan: 2,
              }));
              period += 2;
            } else {
              // Regular subject or free period
              const text = subject ? `${subject.name} - ${subject.teacher}` : "Free";
              cells.push(new TableCell({
                children: [new Paragraph({ text: text, alignment: "center" })],
              }));
              period += 1;
            }
          }
          return new TableRow({ children: cells });
        }),
      ],
    });
    return table;
  }

  function countSubjectOccurrences(schedule, subject) {
    return schedule.filter((s) => s && s.name === subject.name).length;
  }

  // Global tracker: one object per day to count teacher assignments.
  function canAssignTeacher(day, subject, teacherAssignments) {
    const currentCount = teacherAssignments[day][subject.teacher] || 0;
    const assignmentCount = subject.isLab ? 2 : 1;
    return currentCount + assignmentCount <= 4;
  }

  function updateTeacherAssignments(day, subject, teacherAssignments) {
    const assignmentCount = subject.isLab ? 2 : 1;
    teacherAssignments[day][subject.teacher] =
      (teacherAssignments[day][subject.teacher] || 0) + assignmentCount;
  }

  function generateSchedule(semester, globalTeacherConflict, teacherAssignments) {
    // Create a 6-day schedule with 5 periods each.
    const schedule = Array.from({ length: 6 }, () => Array(5).fill(null));
    let subjectsPool = semester.flatMap((subject) =>
      Array(subject.repeat).fill(subject)
    );
    subjectsPool = shuffleArray(subjectsPool);

    const dayOrder = [5, 0, 1, 2, 3, 4];

    // For Saturday, reserve 2 allowed slots for isEtc subjects.
    let reservedEtcSlots = [];
    if (dayOrder.includes(5)) {
      const allowedIndices = [2, 3, 4];
      reservedEtcSlots = shuffleArray(allowedIndices).slice(0, 2);
    }

    for (let d = 0; d < dayOrder.length; d++) {
      const day = dayOrder[d];
      for (let period = 0; period < 5; period++) {
        if (schedule[day][period] !== null) continue;

        subjectsPool.sort((a, b) => {
          const countA = countSubjectOccurrences(schedule[day], a);
          const countB = countSubjectOccurrences(schedule[day], b);
          return countA - countB;
        });

        let attemptCount = 0;
        const MAX_ATTEMPTS = 1000;
        let assignedInThisPeriod = false;

        while (!assignedInThisPeriod && attemptCount < MAX_ATTEMPTS) {
          attemptCount++;

          if (subjectsPool.length === 0) {
            console.warn(`No subjects left to assign for day ${day}, period ${period}.`);
            break;
          }

          let assigned = false;
          subjectsPool = shuffleArray(subjectsPool);

          for (let i = 0; i < subjectsPool.length; i++) {
            const subject = subjectsPool[i];

            // Prevent duplicate subject in the same day.
            if (countSubjectOccurrences(schedule[day], subject) >= 1) continue;

            // Check teacher assignment limit.
            if (!canAssignTeacher(day, subject, teacherAssignments)) continue;

            if (period === 0 && subject.isEtc) continue;

            if (day === 5 && reservedEtcSlots.includes(period) && !subject.isEtc) continue;
            if (day === 5 && subject.isEtc && !reservedEtcSlots.includes(period)) continue;

            if (subject.isLab) {
              if (day === 5) continue;
              // Only one lab allowed per day.
              const labScheduled = schedule[day].some((s) => s && s.isLab);
              if (labScheduled) continue;

              // Ensure two consecutive periods are available.
              if (
                period < 4 &&
                schedule[day][period + 1] === null &&
                !globalTeacherConflict[day][period]?.[subject.teacher] &&
                !globalTeacherConflict[day][period + 1]?.[subject.teacher]
              ) {
                schedule[day][period] = subject;
                schedule[day][period + 1] = subject;

                globalTeacherConflict[day][period] = {
                  ...(globalTeacherConflict[day][period] || {}),
                  [subject.teacher]: true
                };
                globalTeacherConflict[day][period + 1] = {
                  ...(globalTeacherConflict[day][period + 1] || {}),
                  [subject.teacher]: true
                };

                updateTeacherAssignments(day, subject, teacherAssignments);
                subjectsPool.splice(i, 1);
                assigned = true;
                break;
              }
            } else {
              if (!globalTeacherConflict[day][period]?.[subject.teacher]) {
                schedule[day][period] = subject;
                globalTeacherConflict[day][period] = {
                  ...(globalTeacherConflict[day][period] || {}),
                  [subject.teacher]: true
                };

                updateTeacherAssignments(day, subject, teacherAssignments);
                subjectsPool.splice(i, 1);
                assigned = true;
                break;
              }
            }
          }

          if (assigned) {
            assignedInThisPeriod = true;
            break;
          } else if (attemptCount >= MAX_ATTEMPTS) {
            console.warn(
              `Could not assign a subject for day ${day}, period ${period} after ${MAX_ATTEMPTS} attempts. Leaving slot free.`
            );
            break;
          }
        }
      }
    }
    return schedule;
  }

  // Attempt to generate schedules up to 10000 times until no free period is present.
  let attempt = 0;
  let semesterSchedules = [];
  let completeSchedule = false;

  while (attempt < 10000 && !completeSchedule) {
    attempt++;
    console.log(`Attempt ${attempt}`);
    // Reinitialize global conflict trackers for each new attempt.
    const globalTeacherConflict = Array.from({ length: 6 }, () => ({}));
    const teacherAssignments = Array.from({ length: 6 }, () => ({}));

    // Generate a schedule for each semester.
    semesterSchedules = semestersSubjects.map((semester) =>
      generateSchedule(semester, globalTeacherConflict, teacherAssignments)
    );

    // Check if every period in every day of every schedule is filled.
    completeSchedule = semesterSchedules.every((schedule) =>
      schedule.every((daySchedule) => daySchedule.every((subject) => subject !== null))
    );
  }

  if (!completeSchedule) {
    console.warn("Could not generate a complete schedule without free periods after 10000 attempts.");
  }

  // --- Aggregate teacher summary for all semesters ---
 

  return (
    <div>
      <button
        className="download-button"
        onClick={() => generateWordDocument(semesterSchedules)}
      >
        Download Timetable as Word
      </button>
      <div className="schedule-container">
        {semesterSchedules.map((schedule, semesterIndex) => (
          <div key={semesterIndex} className="semester-block">
            <h2 className="semester-title">
              Semester {semesterIndex + 1} {completeSchedule ? "" : `(Attempt ${attempt})`}
            </h2>
            <div className="days-grid">
              {schedule.map((daySchedule, dayIndex) => (
                <div key={dayIndex} className="day-card">
                  <h3 className="day-title">{days[dayIndex]}</h3>
                  <ul className="periods-list">
                    {daySchedule.map((subject, periodIndex) => (
                      <li
                        key={periodIndex}
                        className={`period-item ${subject?.isLab ? "lab-period" : ""} ${!subject ? "free-period" : ""}`}
                      >
                        <span className="period-number">Period {periodIndex + 1}:</span>
                        <span className="subject-info">
                          {subject
                            ? `${subject.name} - ${subject.teacher}${subject.isLab ? " (Lab)" : ""}`
                            : "Free"}
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
    </div>
  );
}

export default App;
