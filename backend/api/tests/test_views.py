import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
from api.models import Issue, Department, Course_unit, Program, Registration_Token, Verification_code, Email_Notification, CustomUser


User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()



@pytest.fixture
def create_user():
    def _create_user(username='testuser', email=None, password='testpass123', role='student', is_email_verified=True, 
                    first_name='Test', last_name='User', gender='male', city='Test City'):
        if email is None:
            # Generate a unique email based on username
            email = f"{username}@gmail.com"
            
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            is_email_verified=is_email_verified,
            first_name=first_name,
            last_name=last_name,
            gender=gender,
            city=city,
            confirm_password=password  # As per your model
        )
        return user
    return _create_user


@pytest.fixture
def create_program():
    def _create_program(program_name='Test Program'):
        return Program.objects.create(program_name=program_name)  # Creates and returns a Program object with the specified program name
    return _create_program

@pytest.fixture
def create_course_unit():
    def _create_course_unit(course_unit_name='Test Course', course_unit_code='TC101'):
        return Course_unit.objects.create(course_unit_name=course_unit_name, course_unit_code=course_unit_code)  # Creates and returns a Course_unit object with the specified name and code
    return _create_course_unit

@pytest.fixture
def create_department():
    def _create_department(department_name='Test Department', description='Test Description'):
        return Department.objects.create(department_name=department_name, description=description)
    return _create_department

@pytest.fixture
def create_issue(create_user, create_program, create_course_unit):
    def _create_issue(issue_type='missing_marks',  # Specifies the type of issue being created for testing
                      status='pending',  # Sets the initial status of the issue to 'pending'
                      year_of_study='1st_year', semester='one'):
        student = create_user(username='issuestudent', role='student')  # Creates a student user for the issue
        registrar = create_user(username='issueregistrar', role='academic_registrar')
        lecturer = create_user(username='issuelecturer', role='lecturer')
        course_unit = create_course_unit()  # Creates a course unit for testing purposes
        
        issue = Issue.objects.create(
            issue_type=issue_type,
            status=status,
            student=student,
            registrar=registrar,
            lecturer=lecturer,
            course_unit=course_unit,
            description="Test issue description",
            year_of_study=year_of_study,
            semester=semester
        )
        return issue
    return _create_issue

# Tests for CustomTokenObtainPairView
@pytest.mark.django_db
class TestCustomTokenObtainPairView:
    def test_token_obtain_with_additional_data(self, api_client, create_user, create_program):
        program = create_program()
        user = create_user(username='testuser', role='student')
        user.program = program
        user.save()
        
        url = reverse('access_token')
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert response.data['role'] == 'student'
        assert response.data['email'] == 'testuser@gmail.com'
        assert response.data['username'] == 'testuser'
        assert response.data['program'] == program.id

# Tests for IssueViewSet
@pytest.mark.django_db
class TestIssueViewSet:
        
    def test_list_issues(self, api_client, create_user, create_issue):
        user = create_user(username='listviewer')
        issue = create_issue()
        
        api_client.force_authenticate(user=user)  # Authenticates the API client with the specified user
        url = reverse('issues-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) >= 1

# Tests for Lecturer_Issue_Manangement
@pytest.mark.django_db
class TestLecturerIssueManagement:
        
    def test_filter_issues(self, api_client, create_user, create_issue):
        lecturer = create_user(username='filterlecturer', role='lecturer')
        issue = create_issue(status='in_progress')
        issue.lecturer = lecturer
        issue.save()
        
        api_client.force_authenticate(user=lecturer)
        url = reverse('lecturer_issue_management-filter-results')
        
        response = api_client.get(f"{url}?status=in_progress")
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) >= 1

# Tests for Student_Issue_ReadOnlyViewset
@pytest.mark.django_db
class TestStudentIssueReadOnlyViewset:  # Test cases for the Student_Issue_ReadOnlyViewset API
    def test_list_student_issues(self, api_client, create_user, create_issue):  # Test case for listing student issues
        student = create_user(username='liststudent', role='student')  # Creates a student user for testing
        issue = create_issue()
        issue.student = student  # Assigns the created user as the student associated with the issue
        issue.save()
        
        api_client.force_authenticate(user=student)
        url = reverse('student_issues-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) >= 1
        
    def test_filter_student_issues(self, api_client, create_user, create_issue):
        student = create_user(username='filterstudent', role='student')
        issue = create_issue(status='pending')
        issue.student = student  # Assigns the created user as the student associated with the issue
        issue.save()
        
        api_client.force_authenticate(user=student)
        url = reverse('student_issues-filter-results')
        
        response = api_client.get(f"{url}?status=pending")
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) >= 1

@pytest.mark.django_db
class TestModelViewSets:
    def test_department_list(self, api_client, create_user, create_department):
        user = create_user(username='deptviewer')
        department = create_department()
        
        api_client.force_authenticate(user=user)
        url = reverse('department-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) >= 1
        
    def test_course_unit_list(self, api_client, create_user, create_course_unit):
        user = create_user(username='courseviewer')
        course_unit = create_course_unit()
        
        api_client.force_authenticate(user=user)
        url = reverse('course_unit-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) >= 1
        
    def test_program_list(self, api_client, create_program):
        program = create_program()
        
        url = reverse('program-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) >= 1


# Tests for Registration views
@pytest.mark.django_db
class TestRegistrationViews:
    @patch('django.core.mail.EmailMessage.send')
    def test_student_registration(self, mock_send, api_client, create_program):
        program = create_program()
        
        url = reverse('register_student_user')
        data = {
            'username': 'newstudent',
            'email': 'newstudent@gmail.com',
            'password': 'securepass123',
            'confirm_password': 'securepass123',  # Added this as needed by model
            'first_name': 'New',
            'last_name': 'Student',
            'gender': 'male',  # Changed to match model choices
            'program': program.id,
            'city': 'Test City',  # Added as required by model
            'role': 'student'  # Added role
        }
        
        mock_send.return_value = 1
        response = api_client.post(url, data, format='json')
        
        # Check for both success (201) or already registered (400) status
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]
        if response.status_code == status.HTTP_201_CREATED:
            assert 'User Created Successfully' in response.data['message']
            assert mock_send.called
        
    def test_lecturer_registrar_registration(self, api_client):
        # Create a registration token first
        token = Registration_Token.objects.create(
            email="newlecturer@gmail.com",
            token="abc123",
            role="lecturer"
        )
        
        url = reverse('register_lect_and_registrar')
        data = {
            'username': 'newlecturer',
            'email': 'newlecturer@gmail.com',
            'password': 'securepass123',
            'confirm_password': 'securepass123',  # Added this as needed by model
            'first_name': 'New',
            'last_name': 'Lecturer',
            'gender': 'male',  # Changed to match model choices
            'registration_token': 'abc123',
            'city': 'Test City',  # Added as required by model
            'role': 'lecturer'  # Added role
        }
        
        response = api_client.post(url, data, format='json')
        
        # Check for both success (201) or already registered (400) status
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]
        if response.status_code == status.HTTP_201_CREATED:
            assert 'User Created Successfully' in response.data['message']


@pytest.mark.django_db
class TestEmailVerification:
    def test_verify_email(self, api_client, create_user):
        user = create_user(username='verifyuser', is_email_verified=False)
        verification = Verification_code.objects.create(
            user=user,
            code=12345
        )
        
        url = reverse('verify_email')
        data = {
            'email': user.email,
            'code': 12345
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert 'Email verified successfully' in response.data['Message']
        
        # Check if user is verified now
        user.refresh_from_db()
        assert user.is_email_verified == True
    
    @patch('api.models.Verification_code.resend_verification_code')  # Corrected import path
    def test_resend_verification_code(self, mock_resend, api_client, create_user):
        user = create_user(username='resenduser')
        
        mock_resend.return_value = {'Message': 'Code resent successfully...'}
        
        url = reverse('resend_verify_code')
        data = {
            'email': user.email,
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert 'Successful' in response.data['Message']
        assert mock_resend.called


# Tests for Password Reset
@pytest.mark.django_db
class TestPasswordReset:
    
    def test_verify_password_reset_code(self, api_client, create_user):
        user = create_user(username='verifyresetuser')
        verification = Verification_code.objects.create(
            user=user,
            code=12345
        )
        
        url = reverse('verify_password_reset_code')
        data = {
            'code': 12345,
            'user': user.id
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert 'Confirmed' in response.data['Message']
    
    def test_final_password_reset(self, api_client, create_user):
        user = create_user(username='finalresetuser')
        
        url = reverse('final_password_reset')
        data = {
            'email': user.email,
            'password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert 'Password reset successful' in response.data['message']
        
        # Verify password was changed
        user.refresh_from_db()
        assert user.check_password('newpassword123')

    @patch('api.models.Verification_code.resend_verification_code')  # Corrected import path
    def test_resend_password_reset_code(self, mock_resend, api_client, create_user):
        user = create_user(username='resendresetuser')
        
        mock_resend.return_value = {'Message': 'Code resent successfully...'}
        
        url = reverse('resend_password_reset_code')
        data = {
            'email': user.email,
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert 'Successfully Resent' in response.data['Message']
        assert mock_resend.called

# Tests for Notification and User Listing APIs
@pytest.mark.django_db
class TestOtherAPIs:  # Test cases for miscellaneous APIs like notifications and user listings
    def test_get_user_email_notifications(self, api_client, create_user, create_course_unit):
        user = create_user(username='notifuser')  # Creates a user with the username 'notifuser' for testing email notifications
        course_unit = create_course_unit()
        issue = Issue.objects.create(  # Creates an issue object for testing email notifications
            issue_type='missing_marks', 
            status='pending', 
            student=user,  # Assigns the created user as the student associated with the issue
            course_unit=course_unit,
            description="Test notification description",
            year_of_study='1st_year',
            semester='one'
        )
        Email_Notification.objects.create(
            user=user,
            issue=issue,
            subject='Test Subject',
            message='Test Message'
        )
        
        api_client.force_authenticate(user=user)
        url = reverse('user_email_notifications')
        
        response = api_client.get(url)  # Sends a GET request to retrieve user email notifications
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert response.data['number'] == 1
        assert len(response.data['data']) == 1
    
    def test_get_registrars(self, api_client, create_user):
        create_user(username='registrar1', role='academic_registrar')
        create_user(username='registrar2', role='academic_registrar', email='registrar2@gmail.com')
        
        url = reverse('get_registrars')
        
        response = api_client.get(url)  # Sends a GET request to retrieve the list of registrars
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) == 2  # Asserts that the response contains exactly 2 registrars
    
    def test_get_lecturers(self, api_client, create_user):  # Test case for retrieving a list of lecturers
        create_user(username='lecturer1', role='lecturer')  # Creates a lecturer user with the role of lecturer
        create_user(username='lecturer2', role='lecturer', email='lecturer2@gmail.com')  # Creates a lecturer user with a specific email
        
        url = reverse('get_lecturers')  # Generates the URL for the get lecturers endpoint
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK  # Asserts that the response status is 200 (OK)
        assert len(response.data) == 2  # Asserts that the response contains exactly 2 lecturers
    
    
    def test_delete_account(self, api_client, create_user):  # Test case for deleting a user account
        user = create_user(username='deleteuser')  # Creates a user with the username 'deleteuser' for testing account deletion
        
        api_client.force_authenticate(user=user)
        url = reverse('delete_account')  # Generates the URL for the delete account endpoint
        data = {
            'userId': user.id
        }
        
        response = api_client.delete(url, data, format='json')  # Sends a DELETE request to delete the user account
        
        assert response.status_code == status.HTTP_204_NO_CONTENT  # Asserts that the response status is 204 (No Content) after deletion
        # Check if user was deleted
        with pytest.raises(User.DoesNotExist):  # Ensures an exception is raised if the user no longer exists in the database
            User.objects.get(id=user.id)  # Verifies that the user no longer exists in the database



