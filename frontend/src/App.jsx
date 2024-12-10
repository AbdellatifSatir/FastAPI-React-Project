// src/App.jsx
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', grade: '' });
  const [editingStudent, setEditingStudent] = useState(null);

  const API_URL = 'http://localhost:8000'; // FastAPI SERVER

  useEffect(() => {
    fetchStudents();
  }, []);


  // Fetch Students
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students/`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Add Student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: students.length + 1,
          name: newStudent.name,
          grade: parseInt(newStudent.grade),
        }),
      });
      const data = await response.json();
      setStudents([...students, data]);
      setNewStudent({ name: '', grade: '' });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };


  // Update Student
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingStudent),
      });
      const data = await response.json();
      setStudents(
        students.map((student) =>
          student.id === editingStudent.id ? data : student
        )
      );
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };


  // Delete Student
  const handleDeleteStudent = async (id) => {
    try {
      await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
      });
      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  
  return (
    <div className="container py-4 ">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Student Management System</h1>
          
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}>
                <div className="row g-3">
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={editingStudent ? editingStudent.name : newStudent.name}
                      onChange={(e) =>
                        editingStudent
                          ? setEditingStudent({ ...editingStudent, name: e.target.value })
                          : setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Grade"
                      value={editingStudent ? editingStudent.grade : newStudent.grade}
                      onChange={(e) =>
                        editingStudent
                          ? setEditingStudent({
                              ...editingStudent,
                              grade: parseInt(e.target.value),
                            })
                          : setNewStudent({ ...newStudent, grade: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-primary me-2">
                      {editingStudent ? 'Update Student' : 'Add Student'}
                    </button>
                    {editingStudent && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditingStudent(null)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="row">
            {students.map((student) => (
              <div className="col-md-4 mb-3" key={student.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{student.name}</h5>
                    <p className="card-text">Grade: {student.grade}</p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning"
                        onClick={() => setEditingStudent(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}