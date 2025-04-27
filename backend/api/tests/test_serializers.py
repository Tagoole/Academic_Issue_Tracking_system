import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from api.serializers import (
    UserSerializer,
    CustomUserprofileSerializer,
    Course_unitSerializer,
    ProgramSerializer,
    DepartmentSerializer,
    IssueSerializer,
    Student_RegisterSerializer,
    Lecturer_and_Registrar_RegisterSerializer,
    Registration_Token_Serializer,
    CustomTokenObtainPairSerializer,
    Verify_Email_serializer,
    Password_ResetSerializer,
    Final_Password_ResetSerializer
)
from api.models import (
    CustomUser,
    Course_unit,
    Program,
    Department,
    Issue,
    Registration_Token,
    Verification_code
)

@pytest.fixture
def user_data():
    return {
        'username': 'testuser',
        'email': 'test@gmail.com',
        'first_name': 'Test',
        'last_name': 'User',
        'password': 'testpassword123',
        'confirm_password': 'testpassword123',
        'gender': 'male',
    }

@pytest.fixture
def program(db):
    return Program.objects.create(program_name="Computer Science")

@pytest.fixture
def course_unit(db, program):
    return Course_unit.objects.create(course_unit_name="Programming 101", course_unit_code="CS101")

@pytest.fixture
def department(db):
    return Department.objects.create(department_name="Computer Science Department")

@pytest.fixture
def custom_user(db, user_data, program):
    user_data.pop('confirm_password')
    user = CustomUser.objects.create_user(
        **user_data,
        role='student',
        program=program
    )
    return user





@pytest.fixture
def issue(db, custom_user, course_unit):
    return Issue.objects.create(
        student=custom_user,
        issue_type="Missing Grade",
        course_unit=course_unit,
        description="My grade for Programming 101 is missing",
        status="pending"
    )

@pytest.fixture
def registration_token(db):
    return Registration_Token.objects.create(
        email="new_lecturer@gmail.com",
        token="123456",
        role="lecturer"
    )

class TestUserSerializer:
    def test_user_serializer_fields(self, custom_user):
        serializer = UserSerializer(instance=custom_user)
        assert set(serializer.data.keys()) == {'id', 'username', 'email'}
        assert serializer.data['username'] == custom_user.username
        assert serializer.data['email'] == custom_user.email

class TestCustomUserprofileSerializer:
    def test_custom_user_profile_serializer(self, custom_user):
        serializer = CustomUserprofileSerializer(instance=custom_user)
        assert 'id' in serializer.data
        assert 'username' in serializer.data
        assert 'email' in serializer.data
        assert 'role' in serializer.data

class TestCourseUnitSerializer:
    def test_course_unit_serializer(self, course_unit):
        serializer = Course_unitSerializer(instance=course_unit)
        assert serializer.data['name'] == course_unit.name
        assert serializer.data['code'] == course_unit.code

class TestProgramSerializer:
    def test_program_serializer(self, program):
        serializer = ProgramSerializer(instance=program)
        assert serializer.data['program_name'] == program.program_name

    def test_program_serializer_create(self, db, course_unit):
        data = {
            'program_name': 'Information Technology',
            'course_units': [course_unit.id]
        }
        serializer = ProgramSerializer(data=data)
        assert serializer.is_valid()
        program = serializer.save()
        assert program.program_name == 'Information Technology'
        assert list(program.course_units.all()) == [course_unit]

class TestDepartmentSerializer:
    def test_department_serializer(self, department):
        serializer = DepartmentSerializer(instance=department)
        assert serializer.data['department_name'] == department.name

class TestIssueSerializer:
    def test_issue_serializer(self, issue):
        serializer = IssueSerializer(instance=issue)
        assert serializer.data['issue_type'] == issue.issue_type
        assert serializer.data['description'] == issue.description
        assert serializer.data['status'] == issue.status
        assert serializer.data['student']['username'] == issue.student.username

class TestStudentRegisterSerializer:
    def test_student_register_serializer_validation(self, user_data, program):
        user_data['program'] = program.id
        serializer = Student_RegisterSerializer(data=user_data)
        assert serializer.is_valid()

    def test_student_register_invalid_email(self, user_data, program):
        user_data['email'] = 'test@yahoo.com'  # Non-Gmail email
        user_data['program'] = program.id
        serializer = Student_RegisterSerializer(data=user_data)
        assert not serializer.is_valid()
        assert 'Only Gmail accounts are allowed' in str(serializer.errors['email'])

    def test_password_mismatch(self, user_data, program):
        user_data['confirm_password'] = 'different_password'
        user_data['program'] = program.id
        serializer = Student_RegisterSerializer(data=user_data)
        assert not serializer.is_valid()
        assert "Passwords don't match" in str(serializer.errors)

    def test_duplicate_email(self, custom_user, user_data, program):
        user_data['program'] = program.id
        # Using the same email as the fixture user
        serializer = Student_RegisterSerializer(data=user_data)
        assert not serializer.is_valid()
        assert "Email already taken" in str(serializer.errors)

class TestLecturerAndRegistrarRegisterSerializer:
    def test_lecturer_registrar_serializer_validation(self, db):
        data = {
            'username': 'lecturer1',
            'email': 'lecturer@gmail.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'testpassword123',
            'confirm_password': 'testpassword123',
            'gender': 'male',
            'role': 'lecturer'
        }
        serializer = Lecturer_and_Registrar_RegisterSerializer(data=data)
        assert serializer.is_valid()

    def test_invalid_email(self, db):
        data = {
            'username': 'lecturer1',
            'email': 'lecturer@yahoo.com',  # Non-Gmail email
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'testpassword123',
            'confirm_password': 'testpassword123',
            'gender': 'male',
            'role': 'lecturer'
        }
        serializer = Lecturer_and_Registrar_RegisterSerializer(data=data)
        assert not serializer.is_valid()
        assert 'Only Gmail accounts are allowed' in str(serializer.errors['email'])

class TestRegistrationTokenSerializer:
    def test_registration_token_serializer(self, registration_token):
        serializer = Registration_Token_Serializer(instance=registration_token)
        assert serializer.data['email'] == registration_token.email
        assert serializer.data['token'] == registration_token.token
        assert serializer.data['role'] == registration_token.role

    def test_registration_token_validation(self, db):
        data = {
            'email': 'new_user@gmail.com',
            'token': '654321',
            'role': 'academic_registrar'
        }
        serializer = Registration_Token_Serializer(data=data)
        assert serializer.is_valid()

    def test_invalid_email_domain(self, db):
        data = {
            'email': 'new_user@yahoo.com',  # Non-Gmail email
            'token': '654321',
            'role': 'academic_registrar'
        }
        serializer = Registration_Token_Serializer(data=data)
        assert not serializer.is_valid()
        assert 'Only Gmail accounts are allowed' in str(serializer.errors['email'])

class TestVerifyEmailSerializer:
    def test_verify_email_serializer(self, db):
        data = {
            'code': 12345,
            'email': 'test@gmail.com'
        }
        serializer = Verify_Email_serializer(data=data)
        assert serializer.is_valid()

class TestPasswordResetSerializer:
    def test_password_reset_serializer(self, db):
        data = {
            'email': 'test@gmail.com'
        }
        serializer = Password_ResetSerializer(data=data)
        assert serializer.is_valid()

class TestFinalPasswordResetSerializer:
    def test_final_password_reset_serializer(self, db):
        data = {
            'password': 'new_password123',
            'confirm_password': 'new_password123',
            'email': 'test@gmail.com'
        }
        serializer = Final_Password_ResetSerializer(data=data)
        assert serializer.is_valid()

    def test_password_mismatch(self, db):
        data = {
            'password': 'new_password123',
            'confirm_password': 'different_password',
            'email': 'test@gmail.com'
        }
        serializer = Final_Password_ResetSerializer(data=data)
        assert not serializer.is_valid()
        assert "Passwords donot match" in str(serializer.errors)