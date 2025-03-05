import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/adminpage.css';

// Predefined subjects for each semester
const subjects = [
  // Semester 1
  ["Mathematics", "Physics", "Programming", "English", "Electronics", "Chemistry"],
  // Semester 2
  ["Data Structures", "Digital Logic", "Database Management", "Discrete Mathematics", "Operating Systems", "Communication Skills"],
  // Semester 3
  ["Algorithms", "Computer Networks", "Software Engineering", "Artificial Intelligence", "Web Development", "Embedded Systems"]
];

const App = () => {
  const [semesters, setSemesters] = useState([
    { A: { subjects: [] }, B: { subjects: [] } },
    { A: { subjects: [] }, B: { subjects: [] } },
    { A: { subjects: [] }, B: { subjects: [] } },
  ]);
  const navigate = useNavigate();

  const teachersWorkload = [
    { name: "Teacher1", workload: 10 },
    { name: "Teacher2", workload: 8 },
    { name: "Teacher3", workload: 12 },
    { name: "Teacher4", workload: 9 },
    { name: "Teacher5", workload: 11 },
    { name: "Teacher6", workload: 7 },
    { name: "Teacher7", workload: 10 },
    { name: "Teacher8", workload: 8 },
    { name: "Teacher9", workload: 9 },
    { name: "Teacher10", workload: 6 },
    { name: "Teacher11", workload: 10 },
    { name: "Teacher12", workload: 7 }
  ];

  const [teachers, setTeachers] = useState(teachersWorkload.map(teacher => ({ name: teacher.name, workHours: teacher.workload.toString() })));
  const [newTeacher, setNewTeacher] = useState({ name: '', workHours: '' });
  const [newSubject, setNewSubject] = useState({
    semester: 0,
    class: 'A',
    subjectName: '',
    assignedTeacher: '',
    repeat: '',
    subjectType: 'none',
    customSubject: ''
  });
  const [editingSubject, setEditingSubject] = useState(null);

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.workHours) {
      alert('Please fill in all fields to add a teacher.');
      return;
    }
    const hours = parseInt(newTeacher.workHours);
    if (hours > 18) {
      alert('Work hours cannot exceed 18 hours');
      return;
    }
    setTeachers([...teachers, newTeacher]);
    setNewTeacher({ name: '', workHours: '' });
  };

  const handleDeleteTeacher = (teacherName) => {
    setTeachers(teachers.filter(teacher => teacher.name !== teacherName));
  };

  const calculateTotalHours = (teacherName) => {
    return semesters.reduce((total, semester) => {
      return total + ['A', 'B'].reduce((classTotal, classKey) => {
        return classTotal + semester[classKey].subjects.reduce((subjectTotal, subject) => {
          return subject.teacher === teacherName ? subjectTotal + parseInt(subject.repeat) : subjectTotal;
        }, 0);
      }, 0);
    }, 0);
  };

  const calculateClassTotalHours = (semesterIndex, classKey) => {
    return semesters[semesterIndex][classKey].subjects.reduce((total, subject) => {
      return total + (subject.subjectType === 'lab' ? parseInt(subject.repeat) * 2 : parseInt(subject.repeat));
    }, 0);
  };

  const handleAddSubject = () => {
    const { semester, class: classKey, subjectName, assignedTeacher, repeat, subjectType, customSubject } = newSubject;
    const subjectToAdd = subjectName === 'Others' ? customSubject : subjectName;
    if (!subjectToAdd || !assignedTeacher || !repeat) {
      alert('Please fill in all fields to add a subject.');
      return;
    }
    const totalHours = calculateTotalHours(assignedTeacher);
    const classTotalHours = calculateClassTotalHours(semester, classKey);
    if (totalHours + parseInt(repeat) > 18) {
      alert('This allocation exceeds the allowed work hours for the teacher.');
      return;
    }
    if (classTotalHours + (subjectType === 'lab' ? parseInt(repeat) * 2 : parseInt(repeat)) > 30) {
      alert('This class section cannot exceed 30 working hours.');
      return;
    }
    const updatedSemesters = [...semesters];
    updatedSemesters[semester][classKey].subjects.push({
      name: subjectToAdd,
      teacher: assignedTeacher,
      repeat: parseInt(repeat),
      subjectType: subjectType,
    });
    setSemesters(updatedSemesters);
    setNewSubject({ semester: 0, class: 'A', subjectName: '', assignedTeacher: '', repeat: '', subjectType: 'none', customSubject: '' });
  };

  const handleDeleteSubject = (semesterIndex, classKey, subjectIndex) => {
    const updatedSemesters = [...semesters];
    const subjectToDelete = updatedSemesters[semesterIndex][classKey].subjects[subjectIndex];
    const teacherName = subjectToDelete.teacher;
    const repeatCount = subjectToDelete.repeat;
    const updatedTeachers = teachers.map(teacher => {
      if (teacher.name === teacherName) {
        const allocatedHours = calculateTotalHours(teacherName);
        const currentWorkHours = parseInt(teacher.workHours);
        const newUnallocatedHours = currentWorkHours - allocatedHours + repeatCount;
        if (newUnallocatedHours > 18) {
          alert(`Error: ${teacherName} cannot have more than 18 hours in the pool.`);
          return teacher;
        }
        return { ...teacher, workHours: newUnallocatedHours.toString() };
      }
      return teacher;
    });
    setTeachers(updatedTeachers);
    updatedSemesters[semesterIndex][classKey].subjects.splice(subjectIndex, 1);
    setSemesters(updatedSemesters);
  };

  const getUnallocatedHours = (teacherName) => {
    const totalHours = parseInt(teachers.find(t => t.name === teacherName)?.workHours || 0);
    const allocatedHours = calculateTotalHours(teacherName);
    const unallocatedHours = totalHours - allocatedHours;
    if (unallocatedHours < 0) {
      alert(`Error: ${teacherName} is overallocated by ${Math.abs(unallocatedHours)} hours.`);
    }
    return unallocatedHours;
  };

  const handleTeacherSelect = (teacherName) => {
    const unallocatedHours = getUnallocatedHours(teacherName);
    setNewSubject({ ...newSubject, assignedTeacher: teacherName, repeat: unallocatedHours >= 0 ? unallocatedHours : '' });
  };

  const handleEditTeacherHours = (teacherName, newHours) => {
    const hours = parseInt(newHours);
    if (hours > 18) {
      alert('Work hours cannot exceed 18 hours');
      return;
    }
    const allocatedHours = calculateTotalHours(teacherName);
    if (hours < allocatedHours) {
      alert('New work hours cannot be less than allocated hours.');
      return;
    }
    setTeachers(teachers.map(teacher => teacher.name === teacherName ? { ...teacher, workHours: newHours } : teacher));
  };

  const handleEditSubject = (semesterIndex, classKey, subjectIndex) => {
    const subject = semesters[semesterIndex][classKey].subjects[subjectIndex];
    setEditingSubject({ semesterIndex, classKey, subjectIndex, ...subject });
  };

  const handleUpdateSubject = () => {
    const { semesterIndex, classKey, subjectIndex, repeat, subjectType } = editingSubject;
    const teacherName = editingSubject.teacher;
    const currentRepeat = parseInt(semesters[semesterIndex][classKey].subjects[subjectIndex].repeat);
    const newRepeat = parseInt(repeat);
    const unallocatedHours = getUnallocatedHours(teacherName);
    if (newRepeat > currentRepeat + unallocatedHours) {
      alert(`Error: The new repeat value must be less than or equal to ${currentRepeat + unallocatedHours}.`);
      return;
    }
    const totalHours = calculateTotalHours(teacherName) - currentRepeat + newRepeat;
    const classTotalHours = calculateClassTotalHours(semesterIndex, classKey) -
      (semesters[semesterIndex][classKey].subjects[subjectIndex].subjectType === 'lab' ? currentRepeat * 2 : currentRepeat) +
      (subjectType === 'lab' ? newRepeat * 2 : newRepeat);
    if (totalHours > 18) {
      alert('This allocation exceeds the allowed work hours for the teacher.');
      return;
    }
    if (classTotalHours > 30) {
      alert('This class section cannot exceed 30 working hours.');
      return;
    }
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex][classKey].subjects[subjectIndex] = {
      ...updatedSemesters[semesterIndex][classKey].subjects[subjectIndex],
      repeat: newRepeat,
      subjectType: subjectType,
    };
    setSemesters(updatedSemesters);
    setEditingSubject(null);
  };

  const handleSubmit = () => {
    const semestersSubjects = semesters.flatMap((semester, semesterIndex) => {
      return ['A', 'B'].map(classKey => {
        return semester[classKey].subjects.map(subject => ({
          name: subject.name,
          teacher: subject.teacher,
          repeat: subject.repeat,
          isLab: subject.subjectType === 'lab',
          isEtc: subject.subjectType === 'extra-curricular'
        }));
      });
    });
    console.log(JSON.stringify(semestersSubjects, null, 2));
    navigate("/time", { state: { semestersSubjects } });
  };

  return (
    <div className="app">
      <h1>Teacher Schedule Manager</h1>

      {/* Add Teacher Section */}
      <div className="section">
        <h2>Add Teacher</h2>
        <div className="add-teacher-form">
          <input
            placeholder="Teacher Name"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Work Hours (max 18)"
            value={newTeacher.workHours}
            onChange={(e) => setNewTeacher({ ...newTeacher, workHours: e.target.value })}
          />
          <button onClick={handleAddTeacher}>Add Teacher</button>
        </div>
      </div>

      {/* Current Teachers Section */}
      <div className="section">
        <h3>Current Teachers</h3>
        {teachers.map((teacher, index) => {
          const unallocatedHours = getUnallocatedHours(teacher.name);
          const error = unallocatedHours < 0 ? 'Error: Overallocated' : '';
          return (
            <div key={index} className="teacher-item">
              <span>{teacher.name} - </span>
              <input
                type="number"
                value={teacher.workHours}
                onChange={(e) => handleEditTeacherHours(teacher.name, e.target.value)}
              />
              <span> hours/week | Unallocated Hours: {unallocatedHours} {unallocatedHours < 0 && <span className="error">{error}</span>}</span>
              <button className="delete-button" onClick={() => handleDeleteTeacher(teacher.name)}>Delete</button>
            </div>
          );
        })}
      </div>

      {/* Add Subject Section */}
      <div className="section">
        <h2>Add Subject</h2>
        <label>
          Semester:
          <select
            value={newSubject.semester}
            onChange={(e) => setNewSubject({ ...newSubject, semester: parseInt(e.target.value) })}
          >
            {semesters.map((_, index) => (
              <option key={index} value={index}>Semester {index + 1}</option>
            ))}
          </select>
        </label>
        <label>
          Class:
          <select
            value={newSubject.class}
            onChange={(e) => setNewSubject({ ...newSubject, class: e.target.value })}
          >
            <option value="A">Class A</option>
            <option value="B">Class B</option>
          </select>
        </label>
        <label>
          Subject:
          <select
            value={newSubject.subjectName}
            onChange={(e) => {
              const selectedSubject = e.target.value;
              setNewSubject({ ...newSubject, subjectName: selectedSubject, customSubject: selectedSubject === 'Others' ? '' : newSubject.customSubject });
            }}
          >
            <option value="">Select Subject</option>
            {subjects[newSubject.semester].map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
            <option value="Others">Others</option>
          </select>
        </label>
        {newSubject.subjectName === 'Others' && (
          <label>
            Custom Subject:
            <input
              placeholder="Enter Custom Subject"
              value={newSubject.customSubject}
              onChange={(e) => setNewSubject({ ...newSubject, customSubject: e.target.value })}
            />
          </label>
        )}
        <label>
          Teacher:
          <select
            value={newSubject.assignedTeacher}
            onChange={(e) => handleTeacherSelect(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachers.filter(teacher => getUnallocatedHours(teacher.name) > 0).map((teacher, index) => (
              <option key={index} value={teacher.name}>{teacher.name}</option>
            ))}
          </select>
        </label>
        <label>
          Repeat Count:
          <input
            type="number"
            placeholder="Repeat Count"
            value={newSubject.repeat}
            onChange={(e) => setNewSubject({ ...newSubject, repeat: e.target.value })}
          />
        </label>
        <div className="subject-type">
          <label>
            <input
              type="radio"
              value="lab"
              checked={newSubject.subjectType === 'lab'}
              onChange={(e) => setNewSubject({ ...newSubject, subjectType: e.target.value })}
            />
            Lab
          </label>
          <label>
            <input
              type="radio"
              value="extra-curricular"
              checked={newSubject.subjectType === 'extra-curricular'}
              onChange={(e) => setNewSubject({ ...newSubject, subjectType: e.target.value })}
            />
            Extra-Curricular Activity
          </label>
          <label>
            <input
              type="radio"
              value="none"
              checked={newSubject.subjectType === 'none'}
              onChange={(e) => setNewSubject({ ...newSubject, subjectType: e.target.value })}
            />
            None
          </label>
        </div>
        <button onClick={handleAddSubject}>Add Subject</button>
      </div>

      {/* Current Allocations Section */}
      <div className="section">
        <h3>Current Allocations</h3>
        {semesters.map((semester, index) => (
          <div key={index} className="semester-card">
            <h4>Semester {index + 1}</h4>
            {['A', 'B'].map((classKey) => (
              <div key={classKey} className="class-section">
                <h5>Class {classKey}</h5>
                <ul>
                  {semester[classKey].subjects.map((subject, subIndex) => (
                    <li key={subIndex}>
                      {subject.name} (Teacher: {subject.teacher}, Repeat: {subject.repeat}, Type: {subject.subjectType})
                      <button onClick={() => handleEditSubject(index, classKey, subIndex)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDeleteSubject(index, classKey, subIndex)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Edit Subject Modal */}
      {editingSubject && (
        <div className="modal-overlay" onClick={() => setEditingSubject(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Subject</h3>
            <label>
              Repeat Count:
              <input
                type="number"
                value={editingSubject.repeat}
                onChange={(e) => setEditingSubject({ ...editingSubject, repeat: e.target.value })}
              />
            </label>
            <div className="subject-type">
              <label>
                <input
                  type="radio"
                  value="lab"
                  checked={editingSubject.subjectType === 'lab'}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subjectType: e.target.value })}
                />
                Lab
              </label>
              <label>
                <input
                  type="radio"
                  value="extra-curricular"
                  checked={editingSubject.subjectType === 'extra-curricular'}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subjectType: e.target.value })}
                />
                Extra-Curricular Activity
              </label>
              <label>
                <input
                  type="radio"
                  value="none"
                  checked={editingSubject.subjectType === 'none'}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subjectType: e.target.value })}
                />
                None
              </label>
            </div>
            <button onClick={handleUpdateSubject}>Update Subject</button>
            <button onClick={() => setEditingSubject(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="submit-container">
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default App;