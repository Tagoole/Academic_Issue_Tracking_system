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
    def _create_user(username='testuser', email='test@gmail.com', password='testpass123', role='student', is_email_verified=True):
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            is_email_verified=is_email_verified
        )
        return user
    return _create_user

@pytest.fixture
def create_program():
    def _create_program(name='Test Program'):
        return Program.objects.create(program_name=name)
    return _create_program

@pytest.fixture
def create_issue(create_user, create_program):
    def _create_issue(issue_type='Test Issue', status='pending'):
        student = create_user(username='student', role='student')
        registrar = create_user(username='registrar', role='academic_registrar')
        lecturer = create_user(username='lecturer', role='lecturer')
        program = create_program()
        
        issue = Issue.objects.create(
            issue_type=issue_type,
            status=status,
            student=student,
            registrar=registrar,
            lecturer=lecturer
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
        assert response.data['email'] == 'test@gmail.com'
        assert response.data['username'] == 'testuser'
        assert response.data['program'] == program.id

# Tests for IssueViewSet
@pytest.mark.django_db
class TestIssueViewSet:
    @patch('django.core.mail.send_mail')
    def test_create_issue(self, mock_send_mail, api_client, create_user):
        student = create_user(username='student', role='student')
        registrar = create_user(username='registrar', role='academic_registrar')
        
        api_client.force_authenticate(user=student)
        
        url = reverse('issues-list')
        data = {
            'issue_type': 'Test Issue',
            'status': 'pending',
            'student': 'student',
            'registrar': 'registrar'
        }
        
        mock_send_mail.return_value = 1
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert mock_send_mail.called
        
    def test_list_issues(self, api_client, create_user, create_issue):
        user = create_user(role='student')
        issue = create_issue()
        
        api_client.force_authenticate(user=user)
        url = reverse('issues-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

# Tests for Lecturer_Issue_Manangement
@pytest.mark.django_db
class TestLecturerIssueManagement:
    @patch('django.core.mail.send_mail')
    def test_update_issue(self, mock_send_mail, api_client, create_user, create_issue):
        lecturer = create_user(username='testlecturer', role='lecturer')
        issue = create_issue()
        issue.lecturer = lecturer
        issue.save()
        
        api_client.force_authenticate(user=lecturer)
        url = reverse('lecturer_issue_management-detail', args=[issue.id])
        
        data = {
            'status': 'resolved'
        }
        
        mock_send_mail.return_value = 1
        response = api_client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'resolved'
        assert mock_send_mail.called
        
    def test_filter_issues(self, api_client, create_user, create_issue):
        lecturer = create_user(username='filterlecturer', role='lecturer')
        issue = create_issue(status='in_progress')
        issue.lecturer = lecturer
        issue.save()
        
        api_client.force_authenticate(user=lecturer)
        url = reverse('lecturer_issue_management-filter-results')
        
        response = api_client.get(f"{url}?status=in_progress")
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

# Tests for Student_Issue_ReadOnlyViewset
@pytest.mark.django_db
class TestStudentIssueReadOnlyViewset:
    def test_list_student_issues(self, api_client, create_user, create_issue):
        student = create_user(username='studentuser', role='student')
        issue = create_issue()
        issue.student = student
        issue.save()
        
        api_client.force_authenticate(user=student)
        url = reverse('student_issues-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        
    def test_filter_student_issues(self, api_client, create_user, create_issue):
        student = create_user(username='filterstudent', role='student')
        issue = create_issue(status='pending')
        issue.student = student
        issue.save()
        
        api_client.force_authenticate(user=student)
        url = reverse('student_issues-filter-results')
        
        response = api_client.get(f"{url}?status=pending")
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

# Tests for Registrar_Issue_ManagementViewSet
@pytest.mark.django_db
class TestRegistrarIssueManagementViewSet:
    @patch('django.core.mail.send_mail')
    def test_update_issue(self, mock_send_mail, api_client, create_user, create_issue):
        registrar = create_user(username='testregistrar', role='academic_registrar')
        issue = create_issue()
        issue.registrar = registrar
        issue.save()
        
        api_client.force_authenticate(user=registrar)
        url = reverse('registrar_issue_management-detail', args=[issue.id])
        
        data = {
            'status': 'resolved'
        }
        
        mock_send_mail.return_value = 1
        response = api_client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'resolved'
        assert mock_send_mail.called

# Tests for DepartmentViewSet, Course_unitViewSet, ProgramViewSet
@pytest.mark.django_db
class TestModelViewSets:
    def test_department_list(self, api_client, create_user):
        user = create_user()
        Department.objects.create(name='Test Department')
        
        api_client.force_authenticate(user=user)
        url = reverse('department-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        
    def test_course_unit_list(self, api_client, create_user):
        user = create_user()
        Course_unit.objects.create(name='Test Course')
        
        api_client.force_authenticate(user=user)
        url = reverse('course_unit-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        
    def test_program_list(self, api_client):
        Program.objects.create(name='Test Program')
        
        url = reverse('program-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
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
            'first_name': 'New',
            'last_name': 'Student',
            'gender': 'Male',
            'program': program.id,
        }
        
        mock_send.return_value = 1
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
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
            'first_name': 'New',
            'last_name': 'Lecturer',
            'gender': 'Male',
            'registration_token': 'abc123',
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'User Created Successfully' in response.data['message']

# Tests for Registration_Token_viewset
@pytest.mark.django_db
class TestRegistrationTokenViewset:
    @patch('django.core.mail.send_mail')
    def test_create_token(self, mock_send_mail, api_client, create_user):
        admin = create_user(role='admin')
        
        api_client.force_authenticate(user=admin)
        url = reverse('registration_token-list')
        
        data = {
            'email': 'newuser@gmail.com',
            'role': 'lecturer'
        }
        
        mock_send_mail.return_value = 1
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'Token created and email sent!' in response.data['message']
        assert mock_send_mail.called

# Tests for Email Verification
@pytest.mark.django_db
class TestEmailVerification:
    def test_verify_email(self, api_client, create_user):
        user = create_user(is_email_verified=False)
        verification = Verification_code.objects.create(
            user=user,
            code=12345
        )
        
        url = reverse('verify_email')
        data = {
            'email': 'test@gmail.com',
            'code': 12345
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'Email verified successfully' in response.data['Message']
        
        # Check if user is verified now
        user.refresh_from_db()
        assert user.is_email_verified == True
    
    @patch('app.models.Verification_code.resend_verification_code')  # Adjust import path
    def test_resend_verification_code(self, mock_resend, api_client, create_user):
        user = create_user()
        
        mock_resend.return_value = True
        
        url = reverse('resend_verify_code')
        data = {
            'email': 'test@gmail.com',
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'Successful' in response.data['Message']
        assert mock_resend.called

# Tests for Password Reset
@pytest.mark.django_db
class TestPasswordReset:
    @patch('django.core.mail.send_mail')
    def test_password_reset_code(self, mock_send_mail, api_client, create_user):
        user = create_user()
        
        url = reverse('password_reset_code')
        data = {
            'email': 'test@gmail.com',
        }
        
        mock_send_mail.return_value = 1
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'Password reset code sent to email' in response.data['message']
        assert mock_send_mail.called
    
    def test_verify_password_reset_code(self, api_client, create_user):
        user = create_user()
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
        
        assert response.status_code == status.HTTP_200_OK
        assert 'Confirmed' in response.data['Message']
    
    def test_final_password_reset(self, api_client, create_user):
        user = create_user()
        
        url = reverse('final_password_reset')
        data = {
            'email': 'test@gmail.com',
            'password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'Password reset successful' in response.data['message']
        
        # Verify password was changed
        user.refresh_from_db()
        assert user.check_password('newpassword123')

    @patch('app.models.Verification_code.resend_verification_code')  # Adjust import path
    def test_resend_password_reset_code(self, mock_resend, api_client, create_user):
        user = create_user()
        
        mock_resend.return_value = True
        
        url = reverse('resend_password_reset_code')
        data = {
            'email': 'test@gmail.com',
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'Successfully Resent' in response.data['Message']
        assert mock_resend.called

# Tests for Notification and User Listing APIs
@pytest.mark.django_db
class TestOtherAPIs:
    def test_get_user_email_notifications(self, api_client, create_user):
        user = create_user()
        issue = Issue.objects.create(issue_type='Test', status='pending', student=user)
        Email_Notification.objects.create(
            user=user,
            issue=issue,
            subject='Test Subject',
            message='Test Message'
        )
        
        api_client.force_authenticate(user=user)
        url = reverse('user_email_notifications')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['number'] == 1
        assert len(response.data['data']) == 1
    
    def test_get_registrars(self, api_client, create_user):
        create_user(username='registrar1', role='academic_registrar')
        create_user(username='registrar2', role='academic_registrar')
        
        url = reverse('get_registrars')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
    
    def test_get_lecturers(self, api_client, create_user):
        create_user(username='lecturer1', role='lecturer')
        create_user(username='lecturer2', role='lecturer')
        
        url = reverse('get_lecturers')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
    
    def test_delete_account(self, api_client, create_user):
        user = create_user()
        
        api_client.force_authenticate(user=user)
        url = reverse('delete_account')
        data = {
            'userId': user.id
        }
        
        response = api_client.delete(url, data, format='json')
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        # Check if user was deleted
        with pytest.raises(User.DoesNotExist):
            User.objects.get(id=user.id)