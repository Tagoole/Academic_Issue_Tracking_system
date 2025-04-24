import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from api.models import *
from django.contrib.auth.hashers import check_password
from django.core import mail
from datetime import timedelta

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
    