from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=["http://localhost:5173"], # REACT SERVER
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Student(BaseModel):
    id: int
    name: str
    grade: int

students = [
    Student(id=1,name='Ali',grade=2),
    Student(id=1,name='Ali',grade=2)
]

# Read
@app.get("/students/")
def read_student():
    return students

# Create
@app.post("/students/")
def create_student(New_student: Student):
    students.append(New_student)
    print(students)
    return New_student

# Update
@app.put("/students/{student_id}")
def update_student(student_id: int, updated_student: Student):
    for index, student in enumerate(students):
        if student_id == student.id:
            student[index] = updated_student
            return updated_student
    return {"error": "Student not found"}

# Delete
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    for index, student in enumerate(students):
        if student_id == student.id:
            del students[index]
            return {"message": "Student deleted "}
    return {"error": "Student not found"}



# git remote set-url origin https://AbdellatifSatir:YOUR-TOKEN@github.com/AbdellatifSatir/repo.git
