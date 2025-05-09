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
        'role': 'student',
        'city': 'Test City'
    }

@pytest.fixture
def program(db):
    return Program.objects.create(program_name="Computer Science")

@pytest.fixture
def course_unit(db, program):
    course_unit = Course_unit.objects.create(course_unit_name="Programming 101", course_unit_code="CS101")
    program.course_units.add(course_unit)
    return course_unit

@pytest.fixture
def department(db):
    return Department.objects.create(department_name="Computer Science Department", description="Department for CS studies")

@pytest.fixture
def custom_user(db, user_data, program):
    user_data.pop('confirm_password')
    user = CustomUser.objects.create_user(
        **user_data,
        program=program
    )
    return user

@pytest.fixture
def lecturer_user(db):
    return CustomUser.objects.create_user(
        username='lecturer1',
        email='lecturer@gmail.com',
        first_name='John',
        last_name='Doe',
        password='testpassword123',
        gender='male',
        role='lecturer',
        city='Test City'
    )

@pytest.fixture
def issue(db, custom_user, course_unit):
    return Issue.objects.create(
        student=custom_user,
        issue_type="missing_marks",
        course_unit=course_unit,
        description="My grade for Programming 101 is missing",
        status="pending",
        year_of_study="1st_year",
        semester="one"
    )

@pytest.fixture
def registration_token(db):
    return Registration_Token.objects.create(
        email="new_lecturer@gmail.com",
        token="123456",
        role="lecturer"
    )

@pytest.fixture
def verification_code(db, custom_user):
    return Verification_code.objects.create(
        user=custom_user,
        code=12345,
        is_verified=False
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
        assert serializer.data['course_unit_name'] == course_unit.course_unit_name
        assert serializer.data['course_unit_code'] == course_unit.course_unit_code

class TestProgramSerializer:
    def test_program_serializer(self, program):
        serializer = ProgramSerializer(instance=program)
        assert serializer.data['program_name'] == program.program_name

class TestDepartmentSerializer:
    def test_department_serializer(self, department):
        serializer = DepartmentSerializer(instance=department)
        assert serializer.data['department_name'] == department.department_name
        assert serializer.data['description'] == department.description

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
        assert serializer.is_valid(), f"Validation errors: {serializer.errors}"

    def test_password_mismatch(self, user_data, program):
        user_data['confirm_password'] = 'different_password'
        user_data['program'] = program.id
        serializer = Student_RegisterSerializer(data=user_data)
        assert not serializer.is_valid()
        # Check that there's an error related to password mismatch
        assert 'non_field_errors' in serializer.errors or 'confirm_password' in serializer.errors

    def test_duplicate_email(self, custom_user, user_data, program):
        user_data['program'] = program.id
        # Using the same email as the fixture user but changing username to avoid duplicate username error
        user_data['username'] = 'different_user'
        serializer = Student_RegisterSerializer(data=user_data)
        assert not serializer.is_valid()
        # Check that there's an error related to email
        assert 'email' in serializer.errors

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
            'role': 'lecturer',
            'city': 'Test City'
        }
        serializer = Lecturer_and_Registrar_RegisterSerializer(data=data)
        assert serializer.is_valid(), f"Validation errors: {serializer.errors}"

class TestRegistrationTokenSerializer:
    def test_registration_token_serializer(self, registration_token):
        serializer = Registration_Token_Serializer(instance=registration_token)
        assert serializer.data['email'] == registration_token.email
        assert serializer.data['token'] == registration_token.token
        assert serializer.data['role'] == registration_token.role

    def test_registration_token_validation(self, db):
        data = {
            'email': 'new_user@gmail.com',
            'role': 'academic_registrar'
        }
        serializer = Registration_Token_Serializer(data=data)
        assert serializer.is_valid(), f"Validation errors: {serializer.errors}"

class TestVerifyEmailSerializer:
    def test_verify_email_serializer(self, db):
        data = {
            'code': 12345,
            'email': 'test@gmail.com'
        }
        serializer = Verify_Email_serializer(data=data)
        assert serializer.is_valid(), f"Validation errors: {serializer.errors}"

class TestPasswordResetSerializer:
    def test_password_reset_serializer(self, db):
        data = {
            'email': 'test@gmail.com'
        }
        serializer = Password_ResetSerializer(data=data)
        assert serializer.is_valid(), f"Validation errors: {serializer.errors}"

class TestFinalPasswordResetSerializer:
    def test_final_password_reset_serializer(self, db):
        data = {
            'password': 'new_password123',
            'confirm_password': 'new_password123',
            'email': 'test@gmail.com'
        }
        serializer = Final_Password_ResetSerializer(data=data)
        assert serializer.is_valid(), f"Validation errors: {serializer.errors}"

    def test_password_mismatch(self, db):
        data = {
            'password': 'new_password123',
            'confirm_password': 'different_password',
            'email': 'test@gmail.com'
        }
        serializer = Final_Password_ResetSerializer(data=data)
        assert not serializer.is_valid()
        # Check that there's an error related to password mismatch
        assert 'non_field_errors' in serializer.errors or 'confirm_password' in serializer.errors