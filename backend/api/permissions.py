from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'student'
    
class IsLecturer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'lecturer'
    
class IsAcademicRegistrar(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'academic_registrar'
    

class IsStudentOrRegistrarOrLecturer(BasePermission):
    def has_permission(self, request, view):
        # Check if user is authenticated first
        if not request.user.is_authenticated:
            return False
            
        # Check if user has any of the required roles as seen below 
        return (
            IsStudent().has_permission(request, view) or
            IsAcademicRegistrar().has_permission(request, view) or
            IsLecturer().has_permission(request, view)
        )
