from django.contrib import admin
from .models import CustomUser, Department,Issue,Course_unit,Program
from django.contrib.auth.admin import UserAdmin



class IssueAdmin(admin.ModelAdmin):
    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        if request.user.role == 'student':
            fields = [field for field in fields if field != 'lecturer']
        return fields
    

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_active')  # Display user info
    list_filter = ('role', 'groups')  # Filter by role and groups
    search_fields = ('username', 'email', 'role')

    # Use UserAdmin.fieldsets without modifying it directly
    fieldsets = (
        ('User Information', {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
        ('Role Information', {'fields': ('role',)}),  # Add 'role' separately
    )


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    filter_horizontal = ('course_units',)  

admin.site.register(CustomUser)    
admin.site.register(Issue, IssueAdmin)
admin.site.register(Department)
admin.site.register(Course_unit)