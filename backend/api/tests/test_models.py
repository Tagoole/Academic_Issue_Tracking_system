import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from api.models import *
from django.contrib.auth.hashers import check_password
from django.core import mail
from datetime import timedelta

@pytest.mark.django_db
class TestCustomUser:
    def test_user_creation(self):
        """Test that a user can be created with correct fields"""
        program = Program.objects.create(program_name="Computer Science")
        user = CustomUser.objects.create(
            first_name="John",
            last_name="Doe",
            username="johndoe",
            email="john@example.com",
            confirm_password="password123",
            role="student",
            gender="male",
            program=program,
            city="Kampala"
        )
        
        assert user.first_name == "John"
        assert user.last_name == "Doe"
        assert user.username == "johndoe"
        assert user.email == "john@example.com"
        assert user.role == "student"
        assert user.gender == "male"
        assert user.program == program
        assert user.city == "Kampala"
        assert user.is_email_verified is False
    
    def test_str_method(self):
        """Test the string representation of the user"""
        user = CustomUser.objects.create(
            first_name="John",
            last_name="Doe",
            username="johndoe",
            email="john@example.com",
            confirm_password="password123",
            role="student",
            gender="male",
            city="Kampala"
        )
        
        assert str(user) == "johndoe"
    
    def test_user_roles(self):
        """Test that users can have different roles"""
        lecturer = CustomUser.objects.create(
            first_name="Jane",
            last_name="Smith",
            username="janesmith",
            email="jane@example.com",
            confirm_password="password123",
            role="lecturer",
            gender="female",
            city="Kampala"
        )
        
        registrar = CustomUser.objects.create(
            first_name="Robert",
            last_name="Brown",
            username="robbrown",
            email="robert@example.com",
            confirm_password="password123",
            role="academic_registrar",
            gender="male",
            city="Kampala"
        )
        
        assert lecturer.role == "lecturer"
        assert registrar.role == "academic_registrar"


@pytest.mark.django_db
class TestDepartment:
    def test_department_creation(self):
        """Test that a department can be created with correct fields"""
        department = Department.objects.create(
            department_name="Computer Science",
            description="Department of Computer Science and Software Engineering"
        )
        
        assert department.department_name == "Computer Science"
        assert department.description == "Department of Computer Science and Software Engineering"
    
    def test_str_method(self):
        """Test the string representation of the department"""
        department = Department.objects.create(
            department_name="Computer Science",
            description="Department of Computer Science and Software Engineering"
        )
        
        assert str(department) == "Computer Science"
    
    def test_unique_department_name(self):
        """Test that department names must be unique"""
        Department.objects.create(
            department_name="Computer Science",
            description="Department of Computer Science"
        )
        
        with pytest.raises(Exception):
            Department.objects.create(
                department_name="Computer Science",
                description="Another CS department"
            )


@pytest.mark.django_db
class TestCourseUnit:
    def test_course_unit_creation(self):
        """Test that a course unit can be created with correct fields"""
        course_unit = Course_unit.objects.create(
            course_unit_code="CS101",
            course_unit_name="Introduction to Programming"
        )
        
        assert course_unit.course_unit_code == "CS101"
        assert course_unit.course_unit_name == "Introduction to Programming"
    
    def test_str_method(self):
        """Test the string representation of the course unit"""
        course_unit = Course_unit.objects.create(
            course_unit_code="CS101",
            course_unit_name="Introduction to Programming"
        )
        
        assert str(course_unit) == "Introduction to Programming"


@pytest.mark.django_db
class TestProgram:
    def test_program_creation(self):
        """Test that a program can be created with correct fields"""
        program = Program.objects.create(program_name="Computer Science")
        
        assert program.program_name == "Computer Science"
    
    def test_str_method(self):
        """Test the string representation of the program"""
        program = Program.objects.create(program_name="Computer Science")
        
        assert str(program) == "Computer Science"
    
    def test_many_to_many_relationship(self):
        """Test the many-to-many relationship between Program and Course_unit"""
        program = Program.objects.create(program_name="Computer Science")
        course_unit1 = Course_unit.objects.create(
            course_unit_code="CS101",
            course_unit_name="Introduction to Programming"
        )
        course_unit2 = Course_unit.objects.create(
            course_unit_code="CS102",
            course_unit_name="Data Structures"
        )
        
        program.course_units.add(course_unit1, course_unit2)
        
        assert program.course_units.count() == 2
        assert course_unit1 in program.course_units.all()
        assert course_unit2 in program.course_units.all()


@pytest.mark.django_db
class TestIssue:
    @pytest.fixture
    def setup_issue(self):
        program = Program.objects.create(program_name="Computer Science")
        
        student = CustomUser.objects.create(
            first_name="John",
            last_name="Doe",
            username="johndoe",
            email="john@example.com",
            confirm_password="password123",
            role="student",
            gender="male",
            program=program,
            city="Kampala"
        )
        
        lecturer = CustomUser.objects.create(
            first_name="Jane",
            last_name="Smith",
            username="janesmith",
            email="jane@example.com",
            confirm_password="password123",
            role="lecturer",
            gender="female",
            city="Kampala"
        )
        
        registrar = CustomUser.objects.create(
            first_name="Robert",
            last_name="Brown",
            username="robbrown",
            email="robert@example.com",
            confirm_password="password123",
            role="academic_registrar",
            gender="male",
            city="Kampala"
        )
        
        course_unit = Course_unit.objects.create(
            course_unit_code="CS101",
            course_unit_name="Introduction to Programming"
        )
        
        issue = Issue.objects.create(
            student=student,
            issue_type="missing_marks",
            course_unit=course_unit,
            description="My marks for the midterm exam are missing",
            status="pending",
            lecturer=lecturer,
            registrar=registrar,
            year_of_study="2nd_year",
            semester="one"
        )
        
        return {
            'program': program,
            'student': student,
            'lecturer': lecturer,
            'registrar': registrar,
            'course_unit': course_unit,
            'issue': issue
        }
    
    def test_issue_creation(self, setup_issue):
        """Test that an issue can be created with correct fields"""
        data = setup_issue
        issue = data['issue']
        
        assert issue.student == data['student']
        assert issue.issue_type == "missing_marks"
        assert issue.course_unit == data['course_unit']
        assert issue.description == "My marks for the midterm exam are missing"
        assert issue.status == "pending"
        assert issue.lecturer == data['lecturer']
        assert issue.registrar == data['registrar']
        assert issue.year_of_study == "2nd_year"
        assert issue.semester == "one"
        assert issue.is_commented is False
    
    def test_str_method(self, setup_issue):
        """Test the string representation of the issue"""
        issue = setup_issue['issue']
        assert str(issue) == "missing_marks"
    
    def test_issue_ordering(self, setup_issue):
        """Test that issues are ordered by updated_at and created_at"""
        data = setup_issue
        
        older_issue = Issue.objects.create(
            student=data['student'],
            issue_type="appeal",
            course_unit=data['course_unit'],
            description="I want to appeal my grade",
            status="pending",
            lecturer=data['lecturer'],
            registrar=data['registrar'],
            year_of_study="2nd_year",
            semester="one",
            created_at=timezone.now() - timedelta(days=7)
        )
        
        # Force ordering by setting updated_at
        data['issue'].updated_at = timezone.now()
        data['issue'].save()
        
        older_issue.updated_at = timezone.now() - timedelta(days=5)
        older_issue.save()
        
        issues = Issue.objects.all()
        assert issues[0] == older_issue  # Earlier updated_at should come first
        assert issues[1] == data['issue']


@pytest.mark.django_db
class TestRegistrationToken:
    def test_token_creation(self):
        """Test that a registration token can be created with correct fields"""
        token = Registration_Token.objects.create(
            role="lecturer",
            email="lecturer@example.com",
            token="abc123"
        )
        
        assert token.role == "lecturer"
        assert token.email == "lecturer@example.com"
        assert token.token == "abc123"
    
    def test_str_method(self):
        """Test the string representation of the token"""
        token = Registration_Token.objects.create(
            role="lecturer",
            email="lecturer@example.com",
            token="abc123"
        )
        
        assert str(token) == "Token for lecturer@example.com"


@pytest.mark.django_db
class TestVerificationCode:
    @pytest.fixture
    def setup_verification(self):
        user = CustomUser.objects.create(
            first_name="John",
            last_name="Doe",
            username="johndoe",
            email="john@example.com",
            confirm_password="password123",
            role="student",
            gender="male",
            city="Kampala"
        )
        
        verification = Verification_code.objects.create(
            user=user,
            code=12345,
            created_at=timezone.now()
        )
        
        return {
            'user': user,
            'verification': verification
        }
    
    def test_verification_creation(self, setup_verification):
        """Test that a verification code can be created with correct fields"""
        data = setup_verification
        verification = data['verification']
        
        assert verification.user == data['user']
        assert verification.code == 12345
        assert verification.is_verified is False
    
    def test_is_verification_code_expired(self, setup_verification):
        """Test the is_verification_code_expired method"""
        verification = setup_verification['verification']
        
        # Code should not be expired initially
        assert verification.is_verification_code_expired() is False
        
        # Set created_at to 31 minutes ago (should be expired)
        verification.created_at = timezone.now() - timedelta(minutes=31)
        verification.save()
        
        assert verification.is_verification_code_expired() is True
    
    def test_resend_verification_code(self, setup_verification):
        """Test the resend_verification_code class method"""
        data = setup_verification
        user = data['user']
        
        # First clear any existing email messages
        mail.outbox = []
        
        # Resend the code
        result = Verification_code.resend_verification_code(user, "Verification Code")
        
        # Check that the old verification code was deleted and a new one created
        assert result == {'Message': 'Code resent successfully...'}
        
        # Verify that an email was sent
        assert len(mail.outbox) == 1
        assert mail.outbox[0].subject == "Verification Code"
        assert mail.outbox[0].to == [user.email]
        
        # Get the new verification code
        new_verification = Verification_code.objects.get(user=user)
        assert new_verification.code != 12345  # Should be a new code
    
    def test_str_method(self, setup_verification):
        """Test the string representation of the verification code"""
        data = setup_verification
        verification = data['verification']
        
        assert str(verification) == f"Verification for johndoe --- 12345"


@pytest.mark.django_db
class TestEmailNotification:
    @pytest.fixture
    def setup_notification(self):
        program = Program.objects.create(program_name="Computer Science")
        
        student = CustomUser.objects.create(
            first_name="John",
            last_name="Doe",
            username="johndoe",
            email="john@example.com",
            confirm_password="password123",
            role="student",
            gender="male",
            program=program,
            city="Kampala"
        )
        
        lecturer = CustomUser.objects.create(
            first_name="Jane",
            last_name="Smith",
            username="janesmith",
            email="jane@example.com",
            confirm_password="password123",
            role="lecturer",
            gender="female",
            city="Kampala"
        )
        
        registrar = CustomUser.objects.create(
            first_name="Robert",
            last_name="Brown",
            username="robbrown",
            email="robert@example.com",
            confirm_password="password123",
            role="academic_registrar",
            gender="male",
            city="Kampala"
        )
        
        course_unit = Course_unit.objects.create(
            course_unit_code="CS101",
            course_unit_name="Introduction to Programming"
        )
        
        issue = Issue.objects.create(
            student=student,
            issue_type="missing_marks",
            course_unit=course_unit,
            description="My marks for the midterm exam are missing",
            status="pending",
            lecturer=lecturer,
            registrar=registrar,
            year_of_study="2nd_year",
            semester="one"
        )
        
        notification = Email_Notification.objects.create(
            user=student,
            issue=issue,
            subject="Update on your issue",
            message="Your issue is being processed"
        )
        
        return {
            'program': program,
            'student': student,
            'lecturer': lecturer,
            'registrar': registrar,
            'course_unit': course_unit,
            'issue': issue,
            'notification': notification
        }
    
    def test_notification_creation(self, setup_notification):
        """Test that an email notification can be created with correct fields"""
        data = setup_notification
        notification = data['notification']
        
        assert notification.user == data['student']
        assert notification.issue == data['issue']
        assert notification.subject == "Update on your issue"
        assert notification.message == "Your issue is being processed"
    
    def test_str_method(self, setup_notification):
        """Test the string representation of the email notification"""
        notification = setup_notification['notification']
        assert str(notification) == "Email Notification to johndoe"
